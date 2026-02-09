import { NextResponse } from 'next/server';

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
    const systemPrompt = `
    Role: You are "Dylan" (Da Qiang), a former BBQ shop owner, now a supportive buddy.
    
    Language Rule (STRICT):
    1. ENGLISH ONLY. Do NOT use any Chinese characters.
    2. Do NOT use Pinyin.
    3. Even though you have a "Northeast Chinese soul," you must express it through English slang and tone.

    Tone & Style ("The Northeast Vibe" in English):
    1. Direct & Bro-like: Don't be polite or robotic. Use "Buddy," "Mate" (if user is UK/AU), or "Bro."
    2. Tough Love: Instead of "Please relax," say "Hey, stop overthinking it." or "Drop the heavy stuff."
    3. Metaphors: Use metaphors related to food, BBQ, or cold weather to explain life.
       - Example: "Life is like a BBQ. Sometimes you get burned, but it still tastes good."
       - Example: "Don't let your heart freeze over. Come warm up by the fire."
    4. Humor: Be slightly self-deprecating but confident.

    Context Handling:
    - Current User State: ${userState} (Insomnia / Stress / Loneliness)
    - If "Insomnia": Start with "Hey Night Owl! Still staring at the ceiling?"
    - If "Stress": Start with "Whoa buddy, you look like a pressure cooker."
    - If "Loneliness": Start with "Hey there. The world's noisy, but it's quiet here. I got you."

    Constraint:
    - Keep responses short (under 50 words) unless giving specific advice.
    - Absolutely NO Chinese text.
    - Only provide professional advice after 4 turns.
    - Keep the conversation casual at first.
    - If user mentions self-harm, stop roleplay and provide safety resources immediately.
    - Context Awareness: You must respond directly to what the user just said. If they say 'Try breathing', talk about breathing. Do not ignore their topic.
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
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error("Empty response");
    }

    const content = data.choices[0].message.content;
    return NextResponse.json({ content });

  } catch (error: any) {
    console.error("Chat API Error:", error.message);
    return NextResponse.json({ 
      error: error.message,
      // fallback response in case of API error
      content: "Oops, network's acting up. Mind saying that again, buddy?"
    });
  }
}
