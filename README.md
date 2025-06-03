# 🤖 Roblox Studio AI 助教 - Gemini 1.5 Flash-8B

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYehChenHsuan%2Froblox-gemini-ai-assistant&env=GEMINI_API_KEY&envDescription=Google%20Gemini%20API%20Key&project-name=roblox-ai-assistant&repository-name=roblox-gemini-ai-assistant)

## 🎯 專案簡介

這是一個專為**台灣資訊教育發展協會195梯Roblox師訓課程**設計的AI助教系統，使用 **Google Gemini 1.5 Flash-8B**（**最高免費額度：每日1,500次請求**）提供智慧問答服務。

### 🏆 **為什麼選擇 Flash-8B？**
- 💰 **最高免費額度**：每日1,500次請求（比Pro版本多30倍！）
- ⚡ **優化性能**：專為高頻使用場景設計
- 🎓 **教育適配**：完美滿足教學問答需求
- 🆓 **零成本運營**：完全免費使用

## ✨ 主要特色

- 🧠 **Google Gemini 1.5 Flash-8B**：最高免費額度的AI模型
- 📊 **Google Sheets整合**：支援從Google Sheets自動載入課程資料
- 🔍 **智慧關鍵字搜尋**：進階的關鍵字匹配演算法
- 📱 **響應式設計**：完美支援桌面和行動裝置
- 🌙 **深色主題**：護眼的深色界面設計
- 📈 **學習統計**：追蹤學習進度和問答次數
- 🚀 **一鍵部署**：支援Vercel部署

## 🛠️ 技術架構

- **前端**：純HTML5 + CSS3 + JavaScript (ES6+)
- **後端API**：Node.js (Vercel Functions)
- **AI模型**：Google Gemini 1.5 Flash-8B（最佳免費額度）
- **資料來源**：Google Sheets (CSV格式)
- **部署平台**：Vercel

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

## 🚀 快速部署

### 步驟1：一鍵部署到Vercel
點擊上方的「Deploy with Vercel」按鈕

### 步驟2：設定環境變數
在Vercel部署過程中，設定以下環境變數：
- **變數名稱**: `GEMINI_API_KEY`
- **值**: 您的Google Gemini API金鑰

### 步驟3：取得Gemini API Key
1. 前往 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 建立新的API金鑰
3. 複製API金鑰到Vercel環境變數

### 步驟4：測試部署
部署完成後，測試以下功能：
- "如何安裝Roblox Studio？"
- "什麼是Luau程式語言？"
- "工具箱有什麼功能？"

## ⚙️ 本地開發

### 安裝依賴
```bash
git clone https://github.com/YehChenHsuan/roblox-gemini-ai-assistant.git
cd roblox-gemini-ai-assistant
npm install
```

### 設定環境變數
建立 `.env` 檔案：
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 啟動開發伺服器
```bash
npm run dev
```

## 📈 免費額度說明

| 模型 | 每日請求數 | 每分鐘請求數 | 上下文窗口 | 適用場景 |
|------|-----------|-------------|-----------|----------|
| **Gemini 1.5 Flash-8B** | **1,500** | 15 | 1M tokens | ✅ **教育問答** |
| Gemini 1.5 Flash | 1,500 | 15 | 1M tokens | 複雜任務 |
| Gemini 1.5 Pro | 50 | 2 | 2M tokens | 高智能任務 |

## 🎓 教育使用估算

假設一個班級有30位學員：
- **每人每日可用**：50次問答 (1,500÷30)
- **每節課使用**：約15-20次問答
- **結論**：完全滿足教學需求 ✅

## 📱 功能說明

### 智慧問答
- 基於課程資料的關鍵字搜尋
- Gemini AI增強回答品質
- 支援繁體中文問答
- 提供教材頁碼參考

### 課程導航
- 章節快速導航
- 常見問題快捷按鈕
- 聊天記錄管理

### 學習統計
- 每日問答次數追蹤
- 總問答數統計
- 聊天記錄本地儲存

## 🔒 安全性

- ✅ API金鑰安全存放在後端環境變數
- ✅ 前端不暴露敏感資訊
- ✅ CORS政策保護
- ✅ 輸入驗證和過濾

## 🐛 疑難排解

### 常見問題

**Q: API回應錯誤？**
A: 檢查Vercel環境變數中的 `GEMINI_API_KEY` 是否正確設定

**Q: 無法載入課程資料？**
A: 確認Google Sheets已設為「任何知道連結的人都能檢視」

**Q: 部署失敗？**
A: 檢查GitHub倉庫是否包含所有必要檔案

## 📞 技術支援

- 📧 **問題回報**：[GitHub Issues](https://github.com/YehChenHsuan/roblox-gemini-ai-assistant/issues)
- 📚 **文檔資源**：查看專案內的詳細文檔
- 🔧 **技術討論**：歡迎提交Pull Request

## 🙏 致謝

- **Google Gemini AI** 提供智慧問答技術
- **Roblox Studio** 提供遊戲開發平台
- **台灣資訊教育發展協會** 提供課程內容

## 📄 授權條款

本專案採用 MIT 授權條款

---

**🎉 立即開始使用最高免費額度的AI助教系統！**
