@echo off
echo 🚀 Roblox AI Assistant - 使用 Gemini 1.5 Flash-8B（最高免費額度）
echo ====================================================================
echo 🏆 模型優勢：每日 1,500 次免費請求（最高等級）
echo 💰 成本：完全免費使用
echo ⚡ 性能：專為教育場景優化
echo.

echo 📁 檢查目前目錄...
cd /d "D:\Roblox ai gimine"
echo 目前位置: %cd%
echo.

echo 🔍 檢查Git狀態...
git status
echo.

echo 📝 添加所有變更...
git add .
echo ✅ 檔案已添加
echo.

echo 💾 提交變更...
set /p commit_msg="請輸入提交訊息 (預設: Update to Gemini Flash-8B): "
if "%commit_msg%"=="" set commit_msg=Update to Gemini 1.5 Flash-8B with highest free tier (1500 requests/day)

git commit -m "%commit_msg%"
echo ✅ 變更已提交
echo.

echo 🌐 推送到GitHub...
echo 注意：請確認已設定正確的GitHub遠端倉庫
echo.

echo 如果是第一次推送，請執行：
echo git remote add origin https://github.com/yourusername/roblox-ai-assistant-gemini.git
echo.

set /p push_confirm="確定要推送到GitHub嗎？ (y/n): "
if /i "%push_confirm%"=="y" (
    git push origin main
    echo ✅ 已成功推送到GitHub
) else (
    echo ❌ 已取消推送
)

echo.
echo 🎉 完成！
echo.
echo 接下來請：
echo 1. 前往 GitHub 確認檔案已上傳
echo 2. 點擊 Vercel 部署按鈕進行部署
echo 3. 設定 GEMINI_API_KEY 環境變數
echo 4. 測試系統功能（每日可使用 1,500 次）
echo.
echo 📈 免費額度提醒：
echo - 每日：1,500 次請求（最高等級）
echo - 每分鐘：15 次請求
echo - 上下文：1M tokens
echo.

pause
