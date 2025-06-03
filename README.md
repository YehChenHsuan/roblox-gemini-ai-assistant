# Roblox Studio AI 助教 - Gemini API 版本

## 🤖 專案簡介

這是一個專為台灣資訊教育發展協會195梯Roblox師訓課程設計的AI助教系統，使用Google Gemini 1.5 Flash-8B API（最高免費額度：每日1,500次請求）提供智慧問答服務。系統能夠根據Google Sheets中的課程資料，透過關鍵字搜尋為學員提供準確的課程指導。

### ✨ 主要特色

- 🧠 **Google Gemini 1.5 Flash-8B**：最高免費額度的AI模型（每日1,500次請求）
- 📊 **Google Sheets整合**：支援從Google Sheets自動載入課程資料
- 🔍 **智慧關鍵字搜尋**：進階的關鍵字匹配演算法
- 📱 **響應式設計**：完美支援桌面和行動裝置
- 🌙 **深色主題**：護眼的深色界面設計
- 📈 **學習統計**：追蹤學習進度和問答次數
- 🚀 **一鍵部署**：支援Vercel和Netlify部署

## 🛠️ 技術架構

- **前端**：純HTML5 + CSS3 + JavaScript (ES6+)
- **後端API**：Node.js (Vercel/Netlify Functions)
- **AI模型**：Google Gemini 1.5 Flash-8B（最佳免費額度）
- **資料來源**：Google Sheets (CSV格式)
- **部署平台**：Vercel / Netlify / GitHub Pages

## 📋 課程資料格式

Google Sheets需要包含以下欄位：
- **Keyword** (關鍵字)：搜尋的主要關鍵詞
- **Summary** (摘要)：詳細的說明內容
- **Page** (頁碼)：教材頁碼參考
- **Chapter** (章節)：所屬章節

### 範例資料
```csv
Keyword,Summary,Page,Chapter
Roblox Studio,Roblox的免費3D遊戲開發工具，支援Windows和Mac,P.02-03,Roblox Studio安裝與操作
Luau,Roblox使用的程式語言，衍生自Lua 5.1,P.34-35,Roblox遊戲設計程式語言
工具箱,Roblox內建模型庫，包含數千種預製物件、材質和音效,P.28,Roblox工具箱
```

## 🚀 快速開始

### 1. 取得專案
```bash
git clone https://github.com/yourusername/roblox-ai-assistant-gemini.git
cd roblox-ai-assistant-gemini
```

### 2. 設定Google Sheets
1. 建立Google Sheets並填入課程資料
2. 將Sheets設為「任何人都能檢視」
3. 取得CSV匯出連結：`https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv&gid=0`

### 3. 取得Gemini API Key
1. 前往 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 建立新的API金鑰
3. 複製API金鑰備用

## 📦 部署方式

### 選項1：Vercel部署 (推薦)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Froblox-ai-assistant-gemini)

1. 點擊上方按鈕或前往 [Vercel](https://vercel.com)
2. 導入GitHub專案
3. 設定環境變數：
   - `GEMINI_API_KEY`: 您的Gemini API金鑰
4. 點擊「Deploy」

### 選項2：Netlify部署

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/roblox-ai-assistant-gemini)

1. 點擊上方按鈕或前往 [Netlify](https://netlify.com)
2. 連接GitHub專案
3. 在「Environment variables」設定：
   - `GEMINI_API_KEY`: 您的Gemini API金鑰
4. 點擊「Deploy site」

### 選項3：GitHub Pages + 外部API

1. Fork這個專案到您的GitHub
2. 在Repository Settings中開啟GitHub Pages
3. 設定外部API服務（如Vercel Functions）處理API請求
4. 在網站設定中輸入API端點URL

## ⚙️ 設定說明

### 環境變數
- `GEMINI_API_KEY`: Google Gemini API金鑰 (必需)

### 前端設定
在瀏覽器中開啟網站後：
1. 點擊右下角設定按鈕
2. 輸入Google Sheets CSV URL
3. 確認API端點設定
4. 儲存設定

## 🔧 本地開發

### 安裝依賴
```bash
npm install
```

### 設定環境變數
建立 `.env` 檔案：
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 啟動開發伺服器
```bash
# 使用Vercel CLI
vercel dev

# 或使用Netlify CLI
netlify dev
```

訪問 `http://localhost:3000` 開始開發

## 📱 功能說明

### 智慧問答
- 基於課程資料的關鍵字搜尋
- Gemini AI增強回答品質
- 支援繁體中文問答
- 提供教材頁碼參考

### 課程導航
- 章節快速導航
- 常見問題快捷按鈕
- 歷史記錄管理

### 學習統計
- 每日問答次數追蹤
- 總問答數統計
- 聊天記錄本地儲存

## 🎨 自訂設定

### 修改主題色彩
編輯 `styles.css` 中的CSS變數：
```css
:root {
    --primary-color: #00A2FF;
    --secondary-color: #FF6B35;
    --accent-color: #4ECDC4;
    /* 更多顏色設定... */
}
```

### 新增課程章節
在 `script.js` 中的 `getDefaultCourseData()` 函數添加新資料：
```javascript
{
    keyword: "新關鍵字",
    summary: "詳細說明",
    page: "P.XX",
    chapter: "章節名稱"
}
```

## 🔒 安全性

- API金鑰安全存放在後端環境變數
- 前端不暴露敏感資訊
- CORS政策保護
- 輸入驗證和過濾

## 🐛 疑難排解

### 常見問題

**Q: API回應錯誤？**
A: 檢查Gemini API金鑰是否正確設定在環境變數中

**Q: 無法載入課程資料？**
A: 確認Google Sheets已設為公開，且CSV URL正確

**Q: 部署後功能異常？**
A: 檢查平台的Functions設定和環境變數

### 除錯方式
1. 開啟瀏覽器開發者工具
2. 查看Console錯誤訊息
3. 檢查Network請求狀態
4. 確認API回應格式

## 📈 效能優化

- 課程資料本地快取
- API請求節流控制
- 圖片和資源壓縮
- CDN加速

## 🤝 貢獻指南

歡迎提交Issue和Pull Request！

1. Fork專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟Pull Request

## 📄 授權條款

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

## 📞 聯絡方式

台灣資訊教育發展協會195梯Roblox師訓
- 專案：[GitHub Repository](https://github.com/yourusername/roblox-ai-assistant-gemini)
- 問題回報：[Issues](https://github.com/yourusername/roblox-ai-assistant-gemini/issues)

## 🙏 致謝

- Google Gemini AI提供智慧問答技術
- Roblox Studio提供遊戲開發平台
- 台灣資訊教育發展協會提供課程內容

---

**立即體驗** → [線上展示](https://your-deployment-url.vercel.app)
