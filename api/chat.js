// Vercel Serverless Functions - 優化版 Google Gemini API
export default async function handler(req, res) {
    // 嚴格的 CORS 設定
    const allowedOrigins = [
        'https://roblox-ai-assistant-gemini.vercel.app',
        'https://roblox-ai-assistant-gemini.netlify.app',
        process.env.FRONTEND_URL,
        ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000', 'http://127.0.0.1:3000'] : [])
    ].filter(Boolean);
    
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    // 安全標頭
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { question, relevantContent } = req.body;
        
        // 輸入驗證和清理
        const validatedQuestion = validateAndSanitizeInput(question);
        if (!validatedQuestion) {
            return res.status(400).json({ error: '輸入格式不正確或過長' });
        }
        
        // API Key 檢查
        const API_KEY = process.env.GEMINI_API_KEY;
        if (!API_KEY) {
            console.error('GEMINI_API_KEY environment variable not found');
            return res.status(500).json({ 
                error: '系統暫時無法使用，請稍後再試'
            });
        }
        
        // 驗證和清理相關內容
        const validatedContent = validateRelevantContent(relevantContent);
        
        // 建構教材內容資訊
        const courseInfo = validatedContent && validatedContent.length > 0 ? 
            validatedContent.map(item => 
                `【${sanitizeText(item.keyword)}】\n摘要：${sanitizeText(item.summary)}\n頁碼：${sanitizeText(item.page)}\n章節：${sanitizeText(item.chapter)}`
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
- 回答長度控制在200-500字
- 避免提供可能有害或不當的內容`;
        
        console.log('Making request to Gemini 2.0 Flash API...');
        
        // 使用 Gemini 2.0 Flash (免費額度最高：每日1,500次請求)
        const response = await retryApiCall(() => 
            fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'RobloxAI-Assistant/2.0'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${systemInstruction}\n\n學員問題：${validatedQuestion}`
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
                        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
                    ]
                })
            })
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText
            });
            
            // 如果 2.0 Flash 失敗，回退到 1.5 Flash-8B
            console.log('Falling back to Gemini 1.5 Flash-8B...');
            const fallbackResponse = await retryApiCall(() => 
                fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${API_KEY}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'RobloxAI-Assistant/2.0'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `${systemInstruction}\n\n學員問題：${validatedQuestion}`
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
                            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
                        ]
                    })
                })
            );
            
            if (!fallbackResponse.ok) {
                const errorMessage = getErrorMessage(fallbackResponse.status);
                return res.status(fallbackResponse.status >= 500 ? 500 : 400).json({ 
                    error: errorMessage
                });
            }
            
            const fallbackData = await fallbackResponse.json();
            if (!fallbackData.candidates || !fallbackData.candidates[0] || !fallbackData.candidates[0].content) {
                return res.status(500).json({
                    error: '回應格式錯誤，請稍後再試'
                });
            }
            
            const responseText = sanitizeApiResponse(fallbackData.candidates[0].content.parts[0].text);
            return res.status(200).json({
                response: responseText,
                usage: fallbackData.usageMetadata || null,
                relevantContentCount: validatedContent ? validatedContent.length : 0,
                timestamp: new Date().toISOString(),
                model: 'gemini-1.5-flash-8b'
            });
        }

        const data = await response.json();
        
        // 檢查回應格式
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            console.error('Unexpected Gemini API response format');
            return res.status(500).json({
                error: '回應格式錯誤，請稍後再試'
            });
        }
        
        const responseText = sanitizeApiResponse(data.candidates[0].content.parts[0].text);
        console.log('Gemini 2.0 Flash API success, response length:', responseText.length);
        
        return res.status(200).json({
            response: responseText,
            usage: data.usageMetadata || null,
            relevantContentCount: validatedContent ? validatedContent.length : 0,
            timestamp: new Date().toISOString(),
            model: 'gemini-2.0-flash-exp'
        });
        
    } catch (error) {
        console.error('Chat API Error:', error.message);
        return res.status(500).json({ 
            error: '服務暫時無法使用，請稍後再試'
        });
    }
}

// 輸入驗證和清理函數
function validateAndSanitizeInput(input) {
    if (!input || typeof input !== 'string') {
        return null;
    }
    
    // 長度限制
    if (input.length > 500) {
        return null;
    }
    
    // 移除 HTML 標籤和潛在危險內容
    const sanitized = input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .replace(/javascript:/gi, '')
        .replace(/data:text\/html/gi, '')
        .trim();
    
    return sanitized || null;
}

function sanitizeText(text) {
    if (!text || typeof text !== 'string') return '';
    return text.replace(/[<>\"'&]/g, char => {
        const map = {
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '&': '&amp;'
        };
        return map[char] || char;
    }).trim();
}

function validateRelevantContent(content) {
    if (!Array.isArray(content)) return [];
    
    return content
        .filter(item => item && typeof item === 'object')
        .slice(0, 10) // 限制數量
        .map(item => ({
            keyword: sanitizeText(item.keyword || ''),
            summary: sanitizeText(item.summary || ''),
            page: sanitizeText(item.page || ''),
            chapter: sanitizeText(item.chapter || '')
        }))
        .filter(item => item.keyword);
}

function sanitizeApiResponse(response) {
    if (!response || typeof response !== 'string') return '';
    
    // 移除潛在的惡意內容但保留格式
    return response
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/data:text\/html/gi, '')
        .trim();
}

async function retryApiCall(apiCall, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await apiCall();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
    }
}

function getErrorMessage(statusCode) {
    const errorMessages = {
        400: '請求格式錯誤，請檢查輸入內容',
        401: 'API金鑰無效，請聯繫管理員',
        403: 'API額度已用完，請稍後再試',
        429: '請求過於頻繁，請稍後再試',
        500: '伺服器內部錯誤，請稍後再試',
        503: '服務暫時無法使用，請稍後再試'
    };
    
    return errorMessages[statusCode] || '未知錯誤，請稍後再試';
}
