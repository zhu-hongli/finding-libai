import { NextResponse } from 'next/server';

//DEEPSEEK_API_KEY改为从.env.local中取
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

export async function POST(request: Request) {

  console.log('hello,in evaluate');
  try {
    const { poem } = await request.json();
    if (!poem) {
      return NextResponse.json(
        { error: '诗歌内容不能为空' },
        { status: 400 }
      );
    }

    const prompt = `请阅读以下诗歌，并从各个维度进行详细评价。请根据以下维度逐一描述你的评价，并在每个部分后给出一个得分（1-10）。

1. 主题与内容
   - 评价：
   - 得分：

2. 语言与修辞
   - 评价：
   - 得分：

3. 节奏与音韵
   - 评价：
   - 得分：

4. 意象与想象
   - 评价：
   - 得分：

5. 结构与布局
   - 评价：
   - 得分：

6. 情感与感染力
   - 评价：
   - 得分：

7. 独创性与风格
   - 评价：
   - 得分：

8. 意境与氛围
   - 评价：
   - 得分：

9. 综合评分
   - 得分：
   - 依据：


诗歌内容：${poem}`;

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are a helpful poetry critic.' },
          { role: 'user', content: prompt }
        ],
        stream: true
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`AI 评估服务异常: ${response.status} - ${errorData.error || response.statusText}`);
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) return;

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              break;
            }

            const text = new TextDecoder().decode(value);
            const lines = text.split('\n').filter(line => line.trim() !== '');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;
                
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices[0]?.delta?.content || '';
                  if (content) {
                    controller.enqueue(encoder.encode(content));
                  }
                } catch (e) {
                  console.error('解析响应数据失败:', e);
                }
              }
            }
          }
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('评估失败:', error);
    return NextResponse.json(
      { error: error.message || '评估失败' },
      { status: 500 }
    );
  }
} 