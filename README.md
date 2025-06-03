# 台灣資訊教育發展協會 195 梯 Roblox 師訓 AI 助教

專為 Roblox Studio 課程設計的 AI 助教系統，使用 Google Gemini 2.0 Flash API 提供智能問答服務。

## ✨ 主要特色

- 🤖 **智能 AI 助教**: 使用 Google Gemini 2.0 Flash（免費額度最高：每日 1,500 次請求）
- 📚 **課程專精**: 專門針對 Roblox Studio 課程內容優化
- 🔄 **自動回退**: 主模型失敗時自動切換到 Gemini 1.5 Flash-8B
- 🌐 **多平台部署**: 支援 Vercel 和 Netlify 部署
- 🔒 **安全防護**: 完整的輸入驗證和安全標頭
- 📱 **響應式設計**: 支援桌面和移動設備

## 🚀 快速部署

### Vercel 部署（推薦）

1. Fork 此專案到您的 GitHub
2. 在 [Vercel](https://vercel.com) 導入專案
3. 設定環境變數：
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. 部署完成！

### Netlify 部署

1. Fork 此專案到您的 GitHub
2. 在 [Netlify](https://netlify.com) 導入專案
3. 設定環境變數：
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. 部署完成！

## 🔧 本地開發

```bash
# 安裝依賴
npm install

# 設定環境變數
echo "GEMINI_API_KEY=your_api_key" > .env.local

# 啟動開發伺服器
npm run dev
```

## 📋 環境變數

| 變數名稱         | 說明                   | 必需 |
| ---------------- | ---------------------- | ---- |
| `GEMINI_API_KEY` | Google Gemini API 金鑰 | ✅   |
| `FRONTEND_URL`   | 前端網址（用於 CORS）  | ❌   |

## 🎯 API 端點

### POST /api/chat

處理 AI 問答請求

**請求格式:**

```json
{
  "question": "使用者問題",
  "relevantContent": [
    {
      "keyword": "關鍵字",
      "summary": "摘要",
      "page": "頁碼",
      "chapter": "章節"
    }
  ]
}
```

**回應格式:**

```json
{
  "response": "AI回答",
  "usage": "使用統計",
  "relevantContentCount": 3,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "model": "gemini-2.0-flash-exp"
}
```

## 🔄 模型回退機制

系統優先使用 **Gemini 2.0 Flash**（免費額度最高），如果失敗會自動回退到 **Gemini 1.5 Flash-8B**（成本最低）。

## 📊 免費額度比較

| 模型                | 每日請求限制 | 每分鐘請求限制 | 成本優勢     |
| ------------------- | ------------ | -------------- | ------------ |
| Gemini 2.0 Flash    | 1,500        | 15             | 免費額度最高 |
| Gemini 1.5 Flash-8B | 500          | 15             | 成本最低     |

## 🛡️ 安全特性

- ✅ 輸入驗證和清理
- ✅ CORS 安全設定
- ✅ 安全標頭配置
- ✅ API 重試機制
- ✅ 錯誤處理和日誌

## 📱 功能特色

- 🎯 **智能問答**: 基於課程內容的精準回答
- 📚 **章節導航**: 快速瀏覽課程章節
- 💾 **聊天記錄**: 自動保存對話歷史
- 📊 **使用統計**: 追蹤學習進度
- ⚙️ **設定管理**: 自訂 API 端點和資料來源

## 🔧 技術架構

- **前端**: 純 HTML/CSS/JavaScript
- **後端**: Vercel Serverless Functions
- **AI 模型**: Google Gemini 2.0 Flash / 1.5 Flash-8B
- **部署**: Vercel / Netlify
- **安全**: CORS、輸入驗證、安全標頭

## 📄 授權

MIT License - 詳見 [LICENSE](LICENSE) 文件

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

---

**台灣資訊教育發展協會** | 專業程式教育推廣
