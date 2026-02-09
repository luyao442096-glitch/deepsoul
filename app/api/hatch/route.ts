import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ greeting: "Connection error...", trait: "Offline" }, { status: 400 });
  }
  
  const { name, painPoint, energy, personality } = body;
  
  // 打印日志：确认正在连接 Meta Llama 3.3
  console.log(`🚀 [启动孵化] 正在连接 Meta Llama 3.3 (Facebook最新旗舰)...`);

  try {
    const systemPrompt = `
    You are an AI Soul Companion named "${name}".
    User Profile:
    - Pain: ${painPoint}
    - Energy: ${energy}
    - Personality: ${personality}
    
    Task: Write a short, deeply empathetic first greeting (max 2 sentences). 
    IMPORTANT: Write in English (unless the user specifically asked for another language).
    Output: JSON only: { "greeting": "...", "trait": "..." }
    `;

    // 发送请求
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "DeepSoul AI",
      },
      body: JSON.stringify({
        // 🔥 核心修改：使用 Meta Llama 3.3 70B Instruct
        // 这是目前最强的开源模型，由 Facebook 发布，绝对符合出海需求，且不封 VPN
        "model": "meta-llama/llama-3.3-70b-instruct", 
        "messages": [
          { "role": "system", "content": systemPrompt },
          { "role": "user", "content": "Hatch now." }
        ],
        "temperature": 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) throw new Error("Empty response");

    const content = data.choices[0].message.content.replace(/```json|```/g, '').trim();
    let result;
    try {
      result = JSON.parse(content);
    } catch (e) {
      result = { greeting: content, trait: "Soul Companion" };
    }

    console.log("✅ 孵化成功:", result);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("🔥 报错详情:", error.message);
    return NextResponse.json({
      greeting: `I am here, ${name}. (Network Error: ${error.message})`,
      trait: "Silent Guardian"
    });
  }
}