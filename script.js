// Roblox Studio AI Assistant - 優化增強版
class RobloxAIAssistant {
    constructor() {
        this.courseData = [];
        this.chatHistory = [];
        this.settings = {
            googleSheetUrl: '',
            apiEndpoint: '/api/chat'
        };
        this.loadSettings();
        
        // 防抖動的發送函數
        this.debouncedSendQuestion = this.debounce(this.sendQuestion.bind(this), 300);
        
        this.init();
    }

    debounce(func, wait) {
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

    async init() {
        try {
            this.setupEventListeners();
            this.updateStats();
            await this.loadCourseData();
            this.loadChatHistory();
            
            console.log('🤖 Roblox AI Assistant with Gemini API initialized');
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    setupEventListeners() {
        // 發送按鈕事件
        document.getElementById('sendButton').addEventListener('click', () => this.sendQuestion());
        
        // 輸入框事件
        const input = document.getElementById('questionInput');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendQuestion();
            }
        });

        // 設定相關事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSettings();
            }
        });
    }

    loadSettings() {
        const saved = localStorage.getItem('robloxAI_settings');
        if (saved) {
            const savedSettings = JSON.parse(saved);
            // 保持預設的 API 端點，但允許覆蓋其他設定
            this.settings = { 
                ...this.settings, 
                ...savedSettings,
                apiEndpoint: savedSettings.apiEndpoint || '/api/chat'
            };
        }
    }

    saveSettings() {
        const googleSheetUrl = document.getElementById('googleSheetUrl').value.trim();
        const apiEndpoint = document.getElementById('apiEndpoint').value.trim() || '/api/chat';
        
        if (!googleSheetUrl) {
            alert('請輸入Google Sheet URL');
            return;
        }

        this.settings.googleSheetUrl = googleSheetUrl;
        this.settings.apiEndpoint = apiEndpoint;
        
        localStorage.setItem('robloxAI_settings', JSON.stringify(this.settings));
        this.closeSettings();
        this.loadCourseData();
        
        this.showNotification('設定已儲存，正在重新載入課程資料...', 'success');
    }

    openSettings() {
        document.getElementById('settingsPanel').style.display = 'flex';
        document.getElementById('googleSheetUrl').value = this.settings.googleSheetUrl;
        document.getElementById('apiEndpoint').value = this.settings.apiEndpoint || '/api/chat';
    }

    closeSettings() {
        document.getElementById('settingsPanel').style.display = 'none';
    }

    async loadCourseData() {
        if (!this.settings.googleSheetUrl) {
            console.warn('Google Sheet URL not configured, using default data');
            this.courseData = this.getDefaultCourseData();
            return;
        }

        try {
            this.showLoading(true);
            console.log('📊 Loading course data from Google Sheets...');
            
            // 嘗試從Google Sheets載入資料
            const response = await fetch(this.settings.googleSheetUrl);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: 無法載入課程資料`);
            }
            
            const csvData = await response.text();
            this.courseData = this.parseCSV(csvData);
            
            console.log(`✅ 已載入 ${this.courseData.length} 筆課程資料`);
            this.showNotification(`成功載入 ${this.courseData.length} 筆課程資料`, 'success');
            
        } catch (error) {
            console.error('❌ 載入課程資料失敗:', error);
            
            // 如果無法從Google Sheets載入，使用預設資料
            this.courseData = this.getDefaultCourseData();
            this.showNotification('無法載入Google Sheets，使用預設課程資料', 'warning');
        } finally {
            this.showLoading(false);
        }
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim());
        if (lines.length === 0) return [];
        
        // 自動偵測分隔符（逗號、Tab、分號）
        const firstLine = lines[0];
        let delimiter = ',';
        if (firstLine.includes('\t')) delimiter = '\t';
        else if (firstLine.includes(';')) delimiter = ';';
        
        const headers = lines[0].split(delimiter).map(h => h.trim().replace(/"/g, ''));
        console.log('📋 CSV Headers detected:', headers);
        
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = lines[i].split(delimiter).map(v => v.trim().replace(/"/g, ''));
                const item = {};
                
                headers.forEach((header, index) => {
                    const value = values[index] || '';
                    // 正規化欄位名稱，支援中英文
                    if (header.toLowerCase().includes('keyword') || header.includes('關鍵字')) {
                        item.keyword = value;
                    } else if (header.toLowerCase().includes('summary') || header.includes('摘要') || header.includes('說明')) {
                        item.summary = value;
                    } else if (header.toLowerCase().includes('page') || header.includes('頁碼')) {
                        item.page = value;
                    } else if (header.toLowerCase().includes('chapter') || header.includes('章節')) {
                        item.chapter = value;
                    } else {
                        item[header] = value;
                    }
                });
                
                // 只有當關鍵字不為空時才加入
                if (item.keyword && item.keyword.trim()) {
                    data.push(item);
                }
            }
        }
        
        console.log(`✅ 解析完成：${data.length} 條有效資料`);
        return data;
    }

    getDefaultCourseData() {
        // 基於提供的教材資料創建預設資料庫
        return [
            {
                keyword: "Roblox Studio",
                summary: "Roblox的免費3D遊戲開發工具，支援Windows和Mac，提供完整的IDE環境讓創作者建造夢想中的遊戲世界",
                page: "P.02-03",
                chapter: "Roblox Studio安裝與操作"
            },
            {
                keyword: "Luau",
                summary: "Roblox使用的程式語言，衍生自Lua 5.1，具有漸進式型別系統和效能優化，專為Roblox平台設計",
                page: "P.34-35",
                chapter: "Roblox遊戲設計程式語言"
            },
            {
                keyword: "工具箱",
                summary: "Roblox內建模型庫，包含數千種預製物件、材質和音效，可直接拖拽使用加速開發",
                page: "P.28",
                chapter: "Roblox工具箱"
            },
            {
                keyword: "Baseplate",
                summary: "底板範本地圖，作為遊戲世界的基礎平台，所有物件的起始建構基礎",
                page: "P.04-05",
                chapter: "Roblox Studio安裝與操作"
            },
            {
                keyword: "Script",
                summary: "伺服器端程式腳本，處理遊戲邏輯和玩家間互動，在ServerScriptService中執行",
                page: "P.34-35",
                chapter: "Roblox遊戲設計程式語言"
            },
            {
                keyword: "LocalScript",
                summary: "客戶端程式腳本，處理玩家個人互動和UI控制，在StarterPlayerScripts中執行",
                page: "P.36-37",
                chapter: "Roblox遊戲設計程式語言"
            },
            {
                keyword: "Block",
                summary: "基礎方塊部件，用於建構遊戲場景的基本幾何圖形，最常用的建築元素",
                page: "P.10-11",
                chapter: "Roblox Studio 3D建模與屬性"
            },
            {
                keyword: "Obby",
                summary: "Roblox中最流行的障礙跑酷遊戲類型，包含Classic、Story-based、Tower等子類型",
                page: "P.34",
                chapter: "基礎操作體驗"
            },
            {
                keyword: "EventBlocks",
                summary: "官方認證的視覺化程式編輯器，類似Scratch，提供拖拽式積木程式設計",
                page: "P.20-21",
                chapter: "Scratch程式編輯器"
            },
            {
                keyword: "Code Assistant",
                summary: "Roblox官方AI程式助理，提供自動程式碼生成、即時調試和智慧語法建議",
                page: "P.42-43",
                chapter: "Roblox遊戲設計AI應用"
            },
            {
                keyword: "Workspace",
                summary: "工作區，遊戲世界中所有可見物件的容器，包含所有3D模型和地形",
                page: "P.06-07",
                chapter: "Roblox Studio安裝與操作"
            },
            {
                keyword: "Explorer",
                summary: "檔案總管視窗，顯示遊戲中所有物件的樹狀結構，用於管理和組織物件",
                page: "P.08-09",
                chapter: "Roblox Studio安裝與操作"
            }
        ];
    }

    async sendQuestion() {
        const input = document.getElementById('questionInput');
        const question = input.value.trim();
        
        if (!question) return;
        
        // 檢查API端點是否可用
        if (!this.settings.apiEndpoint) {
            this.showNotification('請先設定API端點', 'error');
            this.openSettings();
            return;
        }

        // 清空輸入框並禁用按鈕
        input.value = '';
        this.setInputEnabled(false);
        
        // 顯示用戶訊息
        this.addMessage(question, 'user');
        
        // 顯示載入狀態
        this.showLoading(true);
        
        try {
            // 搜尋相關課程內容
            const relevantContent = this.searchRelevantContent(question);
            
            // 呼叫Gemini API
            const response = await this.callGeminiAPI(question, relevantContent);
            
            // 顯示AI回應
            this.addMessage(response, 'bot');
            
            // 更新統計
            this.updateStats();
            
        } catch (error) {
            console.error('❌ Gemini AI回應錯誤:', error);
            
            // 提供更友善的錯誤訊息
            let errorMessage = '抱歉，我現在無法回答您的問題。';
            if (error.message.includes('API')) {
                errorMessage += '請檢查API設定是否正確。';
            } else if (error.message.includes('網路')) {
                errorMessage += '請檢查網路連線。';
            }
            errorMessage += '請稍後再試。';
            
            this.addMessage(errorMessage, 'bot');
        } finally {
            this.showLoading(false);
            this.setInputEnabled(true);
            input.focus();
        }
    }

    searchRelevantContent(question) {
        if (!this.courseData || this.courseData.length === 0) {
            console.warn('⚠️ 沒有課程資料可供搜尋');
            return [];
        }
        
        const questionLower = question.toLowerCase();
        const relevantItems = [];
        
        for (const item of this.courseData) {
            let score = 0;
            const keyword = (item.keyword || '').toLowerCase();
            const summary = (item.summary || '').toLowerCase();
            const chapter = (item.chapter || '').toLowerCase();
            
            // 直接關鍵字匹配（最高權重）
            if (questionLower.includes(keyword) && keyword.length > 0) {
                score += keyword.length * 3;
            }
            
            // 摘要內容匹配
            if (summary.includes(questionLower.substring(0, Math.min(questionLower.length, 10))) ||
                questionLower.includes(summary.substring(0, Math.min(summary.length, 10)))) {
                score += 2;
            }
            
            // 章節匹配
            if (questionLower.includes(chapter) && chapter.length > 0) {
                score += 1;
            }
            
            // 分割關鍵字匹配
            const questionWords = questionLower.split(/[\s，、。？！]+/).filter(w => w.length > 1);
            const itemWords = (keyword + ' ' + summary).split(/[\s，、。？！]+/).filter(w => w.length > 1);
            
            for (const qWord of questionWords) {
                for (const iWord of itemWords) {
                    if (qWord.includes(iWord) || iWord.includes(qWord)) {
                        score += 0.5;
                    }
                }
            }
            
            if (score > 0) {
                relevantItems.push({ ...item, score: Math.round(score * 10) / 10 });
            }
        }
        
        // 按分數排序並取前6名項目
        const sortedItems = relevantItems
            .sort((a, b) => b.score - a.score)
            .slice(0, 6);
            
        console.log(`🔍 找到 ${sortedItems.length} 個相關項目：`);
        sortedItems.forEach(item => {
            console.log(`  - ${item.keyword} (分數: ${item.score})`);
        });
        
        return sortedItems;
    }

    async callGeminiAPI(question, relevantContent) {
        console.log('🤖 呼叫 Gemini API...');
        
        // 使用安全的後端 Gemini API端點
        const response = await fetch(this.settings.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: question,
                relevantContent: relevantContent
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: '未知錯誤' }));
            throw new Error(errorData.error || `Gemini API請求失敗: ${response.status}`);
        }

        const data = await response.json();
        
        // 記錄API使用統計
        if (data.usage) {
            console.log('📊 Gemini API使用統計:', data.usage);
        }
        
        if (data.relevantContentCount !== undefined) {
            console.log(`📚 使用了 ${data.relevantContentCount} 條相關教材`);
        }
        
        // 顯示使用的模型
        if (data.model) {
            console.log(`🤖 使用模型: ${data.model}`);
            this.showNotification(`使用 ${data.model === 'gemini-2.0-flash-exp' ? 'Gemini 2.0 Flash' : 'Gemini 1.5 Flash-8B'} 回答`, 'info');
        }
        
        return data.response;
    }

    addMessage(content, type) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const avatar = type === 'user' ? 
            '<i class="fas fa-user"></i>' : 
            '<i class="fas fa-robot"></i>';
            
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="avatar ${type}-avatar">
                    ${avatar}
                </div>
                <div class="text">
                    ${this.formatMessage(content)}
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // 添加到聊天歷史
        this.chatHistory.push({ type, content, timestamp: new Date() });
        
        // 自動儲存聊天記錄
        this.saveChatHistory();
    }

    formatMessage(content) {
        // 改進的Markdown格式化和內容處理
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^(.*)$/, '<p>$1</p>');
    }

    setInputEnabled(enabled) {
        const input = document.getElementById('questionInput');
        const button = document.getElementById('sendButton');
        
        input.disabled = !enabled;
        button.disabled = !enabled;
        
        if (enabled) {
            input.placeholder = '請輸入您的問題...';
        } else {
            input.placeholder = 'AI助教思考中...';
        }
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.display = show ? 'flex' : 'none';
    }

    showNotification(message, type = 'info') {
        // 創建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            padding: 15px 20px;
            color: var(--text-primary);
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
            font-size: 0.9rem;
        `;
        
        // 設定不同類型的顏色
        const colors = {
            success: '#4ade80',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        if (colors[type]) {
            notification.style.borderColor = colors[type];
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // 3秒後自動移除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);
    }

    updateStats() {
        const today = new Date().toDateString();
        const todayMessages = this.chatHistory.filter(msg => 
            msg.type === 'user' && msg.timestamp.toDateString() === today
        ).length;
        
        const totalMessages = this.chatHistory.filter(msg => msg.type === 'user').length;
        
        document.getElementById('todayCount').textContent = todayMessages;
        document.getElementById('totalCount').textContent = totalMessages;
    }

    saveChatHistory() {
        // 只保存最近100條記錄以節省空間
        const recentHistory = this.chatHistory.slice(-100);
        localStorage.setItem('robloxAI_chatHistory', JSON.stringify(recentHistory));
    }

    loadChatHistory() {
        const saved = localStorage.getItem('robloxAI_chatHistory');
        if (saved) {
            this.chatHistory = JSON.parse(saved).map(msg => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
            }));
        }
    }

    filterByChapter(chapter) {
        const question = `請詳細介紹「${chapter}」這個章節的重點內容和學習要點`;
        document.getElementById('questionInput').value = question;
        this.sendQuestion();
    }

    // 新增清除聊天記錄功能
    clearChatHistory() {
        if (confirm('確定要清除所有聊天記錄嗎？')) {
            this.chatHistory = [];
            document.getElementById('chatMessages').innerHTML = `
                <div class="message bot-message">
                    <div class="message-content">
                        <div class="avatar bot-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="text">
                            <h3>歡迎回到Roblox Studio AI助教！</h3>
                            <p>聊天記錄已清除，我準備好回答您的新問題了。</p>
                        </div>
                    </div>
                </div>
            `;
            this.updateStats();
            localStorage.removeItem('robloxAI_chatHistory');
            this.showNotification('聊天記錄已清除', 'success');
        }
    }
}

// 全域函數
function askQuestion(question) {
    document.getElementById('questionInput').value = question;
    window.aiAssistant.sendQuestion();
}

function filterByChapter(chapter) {
    window.aiAssistant.filterByChapter(chapter);
}

function openSettings() {
    window.aiAssistant.openSettings();
}

function closeSettings() {
    window.aiAssistant.closeSettings();
}

function saveSettings() {
    window.aiAssistant.saveSettings();
}

function clearChatHistory() {
    window.aiAssistant.clearChatHistory();
}

// 添加CSS動畫和樣式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: 500;
        line-height: 1.4;
    }
    
    .message .text p {
        margin: 0.5em 0;
        line-height: 1.6;
    }
    
    .message .text p:first-child {
        margin-top: 0;
    }
    
    .message .text p:last-child {
        margin-bottom: 0;
    }
`;
document.head.appendChild(style);

// 初始化應用
document.addEventListener('DOMContentLoaded', () => {
    window.aiAssistant = new RobloxAIAssistant();
    
    // 載入聊天記錄
    window.aiAssistant.loadChatHistory();
    
    console.log('🚀 Roblox Studio AI Assistant with Gemini API 已啟動');
});
