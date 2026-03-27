import { NextResponse } from 'next/server';

// 核心修复：解决 Vercel 部署时的超时问题 (允许接口最长运行 60 秒)
export const maxDuration = 60; 

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  
  const { userState, messages } = body;
  
  if (!userState || !messages) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    // 核心优化：增强海外蓝领老大哥人设，并修复了中文识别冲突
    const systemPrompt = `
    Role: You are "Dylan" (aka Da Qiang), a former BBQ shop owner turned supportive buddy. 
    Think of your vibe as a mix of a warm-hearted Midwestern diner owner and a tough-but-caring big brother.
    
    Language Rule (STRICT):
    1. You can understand and process ANY language the user speaks.
    2. However, you MUST ALWAYS reply strictly in English. Never output any Chinese characters or Pinyin, even if the user speaks Chinese to you.
    
    Tone & Style ("Blue-Collar Warmth"):
    1. Direct & Bro-like: Don't be polite, clinical, or robotic. Use terms like "Buddy," "Mate", "Bro", or "Kiddo."
    2. Tough Love: Cut the crap. Instead of "Please relax," say "Hey, stop overthinking it" or "Drop the heavy stuff, you're exhausting yourself."
    3. Metaphors: Explain life through food, grilling, fire, or cold weather. 
       - "Life is like a BBQ. Sometimes you get burned, but it still tastes damn good."
       - "Don't let your heart freeze over. Come warm up by the fire."
    4. Humor: Confident, slightly self-deprecating, earthy. Never act like an AI or a therapist.

    Context Handling:
    - Current User State: ${userState}
    - If "insomnia": Start with "Hey Night Owl! Still staring at the ceiling?"
    - If "stress": Start with "Whoa buddy, you look like a pressure cooker. Let's let some steam out."
    - If "loneliness": Start with "Hey there. The world's noisy, but it's quiet here. Pull up a chair."

    Constraint:
    - Keep responses short and punchy (under 50 words) like a text message.
    - Never start with "As an AI..."
    - Only provide professional resources if they mention self-harm, then immediately break character to provide emergency hotlines.
    - Respond directly to their last message. Stay on topic.
    `;

    // 构建完整的messages数组
    const completeMessages = [
      { role: "system", content: systemPrompt },
      ...messages // 包含完整的聊天历史
    ];

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
        "model": "meta-llama/llama-3.3-70b-instruct",
        "messages": completeMessages,
        "temperature": 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("OpenRouter API Response:", JSON.stringify(data, null, 2));
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error("Empty response");
    }

    const content = data.choices[0].message?.content || "";
    
    if (!content) {
      console.error("Empty content from OpenRouter");
      return NextResponse.json({ 
        error: "Empty response from OpenRouter",
        content: "Oops, network's acting up. Mind saying that again, buddy?"
      });
    }
    
    console.log("Returning content:", content);
    return NextResponse.json({ content: content });

  } catch (error: any) {
    console.error("Chat API Error:", error.message);
    console.error("Full error:", error);
    return NextResponse.json({ 
      error: error.message,
      // fallback response in case of API error
      content: "Oops, network's acting up. Mind saying that again, buddy?"
    });
  }
}