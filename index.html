<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PDF テキスト抽出ツール | Document Processor</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            color: #2c3e50;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            color: white;
        }

        .header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.02em;
        }

        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
            font-weight: 300;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0,0,0,0.15);
        }

        .content {
            padding: 40px;
        }

        .upload-section {
            background: #f8fafc;
            border: 2px dashed #cbd5e0;
            border-radius: 12px;
            padding: 60px 40px;
            text-align: center;
            margin-bottom: 30px;
            transition: all 0.3s ease;
            position: relative;
        }

        .upload-section:hover {
            border-color: #4f46e5;
            background: #f0f4ff;
        }

        .upload-section.dragover {
            border-color: #4f46e5;
            background: #eef2ff;
            transform: scale(1.02);
        }

        .upload-icon {
            width: 64px;
            height: 64px;
            margin: 0 auto 20px;
            background: #4f46e5;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 28px;
        }

        .upload-text {
            font-size: 1.1rem;
            color: #64748b;
            margin-bottom: 20px;
            line-height: 1.6;
        }

        .upload-text strong {
            color: #374151;
        }

        input[type="file"] {
            display: none;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
            font-family: inherit;
        }

        .btn-primary {
            background: #4f46e5;
            color: white;
        }

        .btn-primary:hover {
            background: #4338ca;
            transform: translateY(-1px);
            box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3);
        }

        .btn-success {
            background: #059669;
            color: white;
        }

        .btn-success:hover {
            background: #047857;
            transform: translateY(-1px);
            box-shadow: 0 10px 25px rgba(5, 150, 105, 0.3);
        }

        .btn-secondary {
            background: #6b7280;
            color: white;
        }

        .btn-secondary:hover {
            background: #4b5563;
            transform: translateY(-1px);
        }

        .btn:disabled {
            background: #d1d5db;
            color: #9ca3af;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .loading {
            text-align: center;
            padding: 40px;
            display: none;
        }

        .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #f3f4f6;
            border-top: 3px solid #4f46e5;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }

        .loading-text {
            color: #6b7280;
            font-weight: 500;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .output-section {
            display: none;
            margin-top: 30px;
        }

        .output-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding-bottom: 16px;
            border-bottom: 1px solid #e5e7eb;
        }

        .output-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #111827;
        }

        .action-buttons {
            display: flex;
            gap: 12px;
        }

        .text-output {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 24px;
            min-height: 300px;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
            font-size: 14px;
            line-height: 1.6;
            color: #374151;
            resize: vertical;
            width: 100%;
        }

        .text-output:focus {
            outline: none;
            border-color: #4f46e5;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .stats {
            display: flex;
            gap: 24px;
            margin-top: 16px;
            padding: 16px;
            background: #f8fafc;
            border-radius: 8px;
            font-size: 14px;
            color: #64748b;
        }

        .stat-item {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .stat-value {
            font-weight: 600;
            color: #374151;
        }

        @media (max-width: 768px) {
            .container {
                margin: 0 10px;
            }
            
            .content {
                padding: 24px;
            }
            
            .upload-section {
                padding: 40px 20px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .action-buttons {
                flex-direction: column;
            }
            
            .stats {
                flex-direction: column;
                gap: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Document Processor</h1>
        <p>プロフェッショナルなPDFテキスト抽出ツール</p>
    </div>

    <div class="container">
        <div class="content">
            <div class="upload-section" id="uploadArea">
                <div class="upload-icon">📄</div>
                <div class="upload-text">
                    <strong>PDFファイルをアップロード</strong><br>
                    ドラッグ＆ドロップまたはクリックしてファイルを選択
                </div>
                <input type="file" id="fileInput" accept=".pdf" />
                <button class="btn btn-primary" onclick="document.getElementById('fileInput').click()">
                    📁 ファイルを選択
                </button>
            </div>
            
            <div id="loading" class="loading">
                <div class="spinner"></div>
                <div class="loading-text">文書を処理中...</div>
            </div>
            
            <div id="output" class="output-section">
                <div class="output-header">
                    <div class="output-title">抽出されたテキスト</div>
                    <div class="action-buttons">
                        <button class="btn btn-secondary" onclick="copyText()">
                            📋 コピー
                        </button>
                        <button class="btn btn-success" onclick="downloadText()">
                            💾 ダウンロード
                        </button>
                    </div>
                </div>
                <textarea id="extractedText" class="text-output" readonly placeholder="抽出されたテキストがここに表示されます..."></textarea>
                <div class="stats" id="textStats">
                    <div class="stat-item">
                        <span>📊 文字数:</span>
                        <span class="stat-value" id="charCount">0</span>
                    </div>
                    <div class="stat-item">
                        <span>📄 ページ数:</span>
                        <span class="stat-value" id="pageCount">0</span>
                    </div>
                    <div class="stat-item">
                        <span>📝 単語数:</span>
                        <span class="stat-value" id="wordCount">0</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // PDF.jsのワーカー設定
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

        let extractedTextContent = '';
        let totalPages = 0;

        // ファイル入力の処理
        document.getElementById('fileInput').addEventListener('change', handleFile);

        // ドラッグ＆ドロップの処理
        const uploadArea = document.getElementById('uploadArea');
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type === 'application/pdf') {
                handleFileProcessing(files[0]);
            } else {
                alert('PDFファイルを選択してください。');
            }
        });

        function handleFile(event) {
            const file = event.target.files[0];
            if (file && file.type === 'application/pdf') {
                handleFileProcessing(file);
            } else {
                alert('PDFファイルを選択してください。');
            }
        }

        async function handleFileProcessing(file) {
            document.getElementById('loading').style.display = 'block';
            document.getElementById('output').style.display = 'none';

            try {
                const result = await extractTextFromPDF(file);
                extractedTextContent = result.text;
                totalPages = result.pages;
                
                document.getElementById('extractedText').value = result.text;
                updateStats(result.text, result.pages);
                document.getElementById('output').style.display = 'block';
            } catch (error) {
                alert('PDFの処理中にエラーが発生しました: ' + error.message);
            } finally {
                document.getElementById('loading').style.display = 'none';
            }
        }

        async function extractTextFromPDF(file) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            let fullText = '';
            const numPages = pdf.numPages;

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                
                const pageText = textContent.items
                    .map(item => item.str)
                    .join(' ');
                
                fullText += `--- ページ ${i} ---\n${pageText}\n\n`;
            }

            return {
                text: fullText,
                pages: numPages
            };
        }

        function updateStats(text, pages) {
            const charCount = text.length;
            const wordCount = text.trim().split(/\s+/).length;
            
            document.getElementById('charCount').textContent = charCount.toLocaleString();
            document.getElementById('pageCount').textContent = pages;
            document.getElementById('wordCount').textContent = wordCount.toLocaleString();
        }

        function copyText() {
            const textarea = document.getElementById('extractedText');
            textarea.select();
            document.execCommand('copy');
            
            // フィードバック表示
            const btn = event.target;
            const originalText = btn.innerHTML;
            btn.innerHTML = '✅ コピー完了';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        }

        function downloadText() {
            const blob = new Blob([extractedTextContent], { type: 'text/plain; charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `extracted-text-${new Date().toISOString().slice(0,10)}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    </script>
</body>
</html>
