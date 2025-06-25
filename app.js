// PDF.jsのワーカー設定
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

// グローバル変数
let extractedTextContent = '';
let currentFiles = [];
let processedFiles = [];
let currentTab = 'text';

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadHistory();
}

function setupEventListeners() {
    // ファイル入力
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
    
    // ドラッグ&ドロップ
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // 検索機能
    document.getElementById('searchInput').addEventListener('input', debounce(searchText, 300));
}

// ファイル選択処理
function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    addFilesToQueue(files);
}

// ドラッグ&ドロップ処理
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/pdf');
    if (files.length > 0) {
        addFilesToQueue(files);
    } else {
        showModal('エラー', 'PDFファイルのみ対応しています。');
    }
}

// ファイルキューに追加
function addFilesToQueue(files) {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const validFiles = files.filter(file => {
        if (file.size > maxSize) {
            showModal('エラー', `${file.name} はファイルサイズが大きすぎます（最大50MB）`);
            return false;
        }
        return true;
    });
    
    currentFiles = [...currentFiles, ...validFiles];
    updateFileQueue();
}

// ファイルキュー表示更新
function updateFileQueue() {
    const queue = document.getElementById('fileQueue');
    if (currentFiles.length === 0) {
        queue.innerHTML = '';
        return;
    }
    
    queue.innerHTML = currentFiles.map((file, index) => `
        <div class="file-item">
            <div class="file-info-left">
                <span class="file-name">${file.name}</span>
                <span class="file-size">${formatFileSize(file.size)}</span>
            </div>
            <button class="btn btn-danger btn-sm" onclick="removeFile(${index})">
                ❌ 削除
            </button>
        </div>
    `).join('');
    
    // 処理開始ボタンを表示
    if (!document.getElementById('processBtn')) {
        const processBtn = document.createElement('button');
        processBtn.id = 'processBtn';
        processBtn.className = 'btn btn-primary';
        processBtn.innerHTML = '🚀 処理開始';
        processBtn.onclick = processAllFiles;
        queue.appendChild(processBtn);
    }
}

// ファイル削除
function removeFile(index) {
    currentFiles.splice(index, 1);
    updateFileQueue();
}

// 全ファイル処理
async function processAllFiles() {
    if (currentFiles.length === 0) return;
    
    showLoading(true);
    processedFiles = [];
    let allText = '';
    
    for (let i = 0; i < currentFiles.length; i++) {
        const file = currentFiles[i];
        updateProgress((i + 1) / currentFiles.length * 100, `処理中: ${file.name}`);
        
        try {
            const result = await extractTextFromPDF(file);
            processedFiles.push({
                filename: file.name,
                text: result.text,
                pages: result.pages,
                timestamp: new Date()
            });
            
            // 設定に基づいてテキストを結合
            const settings = getSettings();
            let fileText = result.text;
            
            if (settings.outputFormat === 'markdown') {
                fileText = `# ${file.name}\n\n${result.text}`;
            } else if (settings.outputFormat === 'json') {
                fileText = JSON.stringify({
                    filename: file.name,
                    pages: result.pages,
                    text: result.text
                }, null, 2);
            }
            
            allText += fileText + '\n\n---\n\n';
            
        } catch (error) {
            console.error(`Error processing ${file.name}:`, error);
            showModal('エラー', `${file.name} の処理に失敗しました: ${error.message}`);
        }
    }
    
    extractedTextContent = allText;
    displayResults(allText);
    saveToHistory();
    currentFiles = [];
    updateFileQueue();
    showLoading(false);
}

// PDF テキスト抽出（改良版）
async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const settings = getSettings();
    const startPage = settings.startPage || 1;
    const endPage = settings.endPage || pdf.numPages;
    
    let fullText = '';
    const actualEndPage = Math.min(endPage, pdf.numPages);
    
    for (let i = startPage; i <= actualEndPage; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        let pageText = '';
        if (settings.preserveFormatting) {
            // フォーマット保持
            pageText = textContent.items
                .map(item => item.str)
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();
        } else {
            // シンプルなテキスト
            pageText = textContent.items
                .map(item => item.str)
                .join(' ');
        }
        
        if (settings.pageNumbers) {
            fullText += `--- ページ ${i} ---\n${pageText}\n\n`;
        } else {
            fullText += `${pageText}\n\n`;
        }
    }
    
    return {
        text: fullText,
        pages: actualEndPage - startPage + 1
    };
}

// 設定取得
function getSettings() {
    return {
        outputFormat: document.getElementById('outputFormat').value,
        preserveFormatting: document.getElementById('preserveFormatting').checked,
        pageNumbers: document.getElementById('pageNumbers').checked,
        startPage: parseInt(document.getElementById('startPage').value) || null,
        endPage: parseInt(document.getElementById('endPage').value) || null
    };
}

// 結果表示
function displayResults(text) {
    document.getElementById('extractedText').value = text;
    updateAnalysis(text);
    document.getElementById('output').style.display = 'block';
    
    // プレビュー生成
    generatePreview(text);
}

// 分析更新
function updateAnalysis(text) {
    const stats = analyzeText(text);
    
    document.getElementById('charCount').textContent = stats.characters.toLocaleString();
    document.getElementById('wordCount').textContent = stats.words.toLocaleString();
    document.getElementById('lineCount').textContent = stats.lines.toLocaleString();
    document.getElementById('pageCount').textContent = processedFiles.reduce((sum, file) => sum + file.pages, 0);
    
    // 単語頻度
    displayWordFrequency(stats.wordFrequency);
    
    // 言語検出
    displayLanguageInfo(stats.language);
}

// テキスト分析
function analyzeText(text) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const wordFreq = {};
    
    words.forEach(word => {
        if (word.length > 2) { // 3文字以上の単語のみ
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
    });
    
    const topWords = Object.entries(wordFreq)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);
    
    return {
        characters: text.length,
        words: words.length,
        lines: text.split('\n').length,
        wordFrequency: topWords,
        language: detectLanguage(text)
    };
}

// 単語頻度表示
function displayWordFrequency(wordFreq) {
    const container = document.getElementById('wordFrequency');
    container.innerHTML = wordFreq.map(([word, count]) => 
        `<span class="word-tag">${word} (${count})</span>`
    ).join('');
}

// 言語検出（簡易版）
function detectLanguage(text) {
    const japanesePattern = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
    const englishPattern = /[a-zA-Z]/;
    
    const japaneseCount = (text.match(japanesePattern) || []).length;
    const englishCount = (text.match(englishPattern) || []).length;
    
    if (japaneseCount > englishCount) {
        return { primary: '日本語', confidence: japaneseCount / (japaneseCount + englishCount) };
    } else {
        return { primary: '英語', confidence: englishCount / (japaneseCount + englishCount) };
    }
}

// 言語情報表示
function displayLanguageInfo(langInfo) {
    const container = document.getElementById('languageDetection');
    container.innerHTML = `
        <strong>主要言語:</strong> ${langInfo.primary}<br>
        <strong>信頼度:</strong> ${(langInfo.confidence * 100).toFixed(1)}%
    `;
}

// プレビュー生成
function generatePreview(text) {
    const preview = document.getElementById('previewContent');
    const formatted = text
        .replace(/---\s*ページ\s*\d+\s*---/g, '<h3>$&</h3>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
    
    preview.innerHTML = `<p>${formatted}</p>`;
}

// タブ切り替え
function switchTab(tabName) {
    // ボタンの状態更新
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
    
    // コンテンツの表示切り替え
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    currentTab = tabName;
}

// 検索機能
function searchText() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const textarea = document.getElementById('extractedText');
    
    if (!query) {
        textarea.value = extractedTextContent;
        return;
    }
    
    // ハイライト付きテキスト生成
    const highlighted = extractedTextContent.replace(
        new RegExp(query, 'gi'),
        match => `<<HIGHLIGHT>>${match}<<HIGHLIGHT>>`
    );
    
    textarea.value = highlighted.replace(/<<HIGHLIGHT>>/g, '');
    
    // 最初の一致箇所にスクロール
    const firstMatch = textarea.value.toLowerCase().indexOf(query);
    if (firstMatch !== -1) {
        textarea.focus();
        textarea.setSelectionRange(firstMatch, firstMatch + query.length);
    }
}

// テキストコピー
function copyText() {
    const textarea = document.getElementById('extractedText');
    textarea.select();
    document.execCommand('copy');
    
    showNotification('テキストがクリップボードにコピーされました');
}

// テキストダウンロード
function downloadText() {
    const settings = getSettings();
    let content = extractedTextContent;
    let extension = 'txt';
    let mimeType = 'text/plain';
    
    if (settings.outputFormat === 'markdown') {
        extension = 'md';
        mimeType = 'text/markdown';
    } else if (settings.outputFormat === 'json') {
        extension = 'json';
        mimeType = 'application/json';
    }
    
    const blob = new Blob([content], { type: `${mimeType}; charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted-text-${new Date().toISOString().slice(0,10)}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 結果クリア
function clearResults() {
    if (confirm('抽出結果をクリアしますか？')) {
        extractedTextContent = '';
        document.getElementById('extractedText').value = '';
        document.getElementById('output').style.display = 'none';
        document.getElementById('searchInput').value = '';
    }
}

// 履歴機能
function saveToHistory() {
    const history = JSON.parse(localStorage.getItem('pdfTextHistory') || '[]');
    const entry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        files: processedFiles.map(f => ({ name: f.filename, pages: f.pages })),
        textLength: extractedTextContent.length
    };
    
    history.unshift(entry);
    history.splice(10); // 最新10件のみ保持
    localStorage.setItem('pdfTextHistory', JSON.stringify(history));
    updateHistoryDisplay();
}

function loadHistory() {
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const history = JSON.parse(localStorage.getItem('pdfTextHistory') || '[]');
    const container = document.getElementById('historyList');
    
    if (history.length === 0) {
        container.innerHTML = '<p class="no-history">履歴がありません</p>';
        return;
    }
    
    container.innerHTML = history.map(entry => `
        <div class="history-item" onclick="showHistoryDetails(${entry.id})">
            <div class="history-date">${new Date(entry.timestamp).toLocaleDateString()}</div>
            <div class="history-files">${entry.files.length}ファイル - ${entry.textLength}文字</div>
        </div>
    `).join('');
}

function showHistoryDetails(id) {
    const history = JSON.parse(localStorage.getItem('pdfTextHistory') || '[]');
    const entry = history.find(h => h.id === id);
    
    if (entry) {
        const content = `
            <h3>処理履歴詳細</h3>
            <p><strong>日時:</strong> ${new Date(entry.timestamp).toLocaleString()}</p>
            <p><strong>ファイル数:</strong> ${entry.files.length}</p>
            <p><strong>総文字数:</strong> ${entry.textLength.toLocaleString()}</p>
            <h4>ファイル一覧:</h4>
            <ul>
                ${entry.files.map(f => `<li>${f.name} (${f.pages}ページ)</li>`).join('')}
            </ul>
        `;
        showModal('履歴詳細', content);
    }
}

// ユーティリティ関数
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

function updateProgress(percent, text) {
    document.getElementById('progressFill').style.width = percent + '%';
    document.getElementById('progressText').textContent = Math.round(percent) + '%';
    if (text) {
        document.querySelector('.loading-text').textContent = text;
    }
}

function showModal(title, content) {
    document.getElementById('modalBody').innerHTML = `<h3>${title}</h3><div>${content}</div>`;
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function showNotification(message) {
    // 簡易通知（実装を簡素化）
    alert(message);
}

// モーダルの外側クリックで閉じる
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}
