// Vercel Functions - 使用Google Gemini 1.5 Flash-8B API的後端函數
export default async function handler(req, res) {
    // 設定CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { question, relevantContent } = req.body;
        
        if (!question || !question.trim()) {
            return res.status(400).json({ error: '問題不能為空' });
        }
        
        // API Key從環境變數取得（不會暴露在前端）
        const API_KEY = process.env.GEMINI_API_KEY;
        
        console.log('Environment check:', {
            hasApiKey: !!API_KEY,
            apiKeyLength: API_KEY ? API_KEY.length : 0,
            model: 'gemini-1.5-flash-8b'
        });
        
        if (!API_KEY) {
            console.error('GEMINI_API_KEY environment variable not found');
            return res.status(500).json({ 
                error: 'API配置錯誤：環境變數未設定',
                debug: 'GEMINI_API_KEY not found'
            });
        }
        
        // 建構教材內容資訊
        const courseInfo = relevantContent && relevantContent.length > 0 ? 
            relevantContent.map(item => 
                `【${item.keyword}】\n摘要：${item.summary}\n頁碼：${item.page}\n章節：${item.chapter}`
            ).join('\n\n') : '沒有找到相關的課程資料';
        
        // 優化的系統指令
        const systemInstruction = `你是台灣資訊教育發展協會195梯Roblox師訓的專業AI助教，專門回答關於Roblox Studio課程的問題。

**你的職責和特色：**
1. 根據提供的教材內容給出準確、詳細的回答
2. 使用繁體中文進行所有回覆
3. 提供步驟式的操作指導
4. 結合教材頁碼和章節資訊
5. 鼓勵學員實作和探索
6. 回答要具體實用，避免過於抽象

**當前相關教材內容：**
${courseInfo}

**回答原則：**
- 優先使用教材內容回答
- 如果教材資訊不足，基於Roblox專業知識補充
- 回答要包含具體的操作步驟
- 適當引用教材頁碼和章節
- 保持友善和鼓勵的語調
- 回答長度控制在200-500字`;
        
        console.log('Making request to Gemini 1.5 Flash-8B API...');
        
        // 使用Google Gemini 1.5 Flash-8B（最高免費額度：1500次/日）
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b-latest:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${systemInstruction}\n\n學員問題：${question}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1000,
                    candidateCount: 1
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            })
        });

        console.log('Gemini API response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error:', {
                status: response.status,
                statusText: response.statusText,
                errorText: errorText
            });
            
            return res.status(response.status).json({ 
                error: `Gemini API請求失敗: ${response.status} ${response.statusText}`,
                details: errorText
            });
        }

        const data = await response.json();
        
        // 檢查回應格式
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            console.error('Unexpected Gemini API response format:', data);
            return res.status(500).json({
                error: '回應格式錯誤',
                details: 'Unexpected API response format'
            });
        }
        
        const responseText = data.candidates[0].content.parts[0].text;
        console.log('Gemini 1.5 Flash-8B success, response length:', responseText.length);
        
        return res.status(200).json({
            response: responseText,
            model: 'gemini-1.5-flash-8b',
            usage: data.usageMetadata || null,
            relevantContentCount: relevantContent ? relevantContent.length : 0,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Chat API Error:', error);
        return res.status(500).json({ 
            error: '服務暫時無法使用，請稍後再試',
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
}