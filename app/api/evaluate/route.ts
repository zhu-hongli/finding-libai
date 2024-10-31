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

    const prompt = `请阅读以下诗歌，并从各个维度进行详细评价，最后给出一个综合评分。请按照以下 JSON 格式提供评价：

{
  "主题与内容": {
    "评价": "请详细描述诗歌的主题、思想或情感",
    "得分": "1-10"
  },
  "语言与修辞": {
    "评价": "请描述修辞手法、语言风格等",
    "得分": "1-10"
  },
  "节奏与音韵": {
    "评价": "请描述诗歌的韵律、节奏感",
    "得分": "1-10"
  },
  "意象与想象": {
    "评价": "请描述意象的表现力、联想等",
    "得分": "1-10"
  },
  "结构与布局": {
    "评价": "请描述结构层次、布局合理性",
    "得分": "1-10"
  },
  "情感与感染力": {
    "评价": "请描述情感的真挚性、感染力",
    "得分": "1-10"
  },
  "独创性与风格": {
    "评价": "请描述创新性、风格独特性",
    "得分": "1-10"
  },
  "意境与氛围": {
    "评价": "请描述诗歌的意境、氛围感",
    "得分": "1-10"
  },
  "综合评分": {
    "得分": "1-10",
    "依据": "请总结综合评分的依据"
  }
}

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
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`AI 评估服务异常: ${response.status} - ${errorData.error || response.statusText}`);
    }

    const aiResponse = await response.json();
    // 从响应中提取出实际的评价内容
    const evaluationContent = aiResponse.choices[0].message.content;
    return NextResponse.json({ evaluation: evaluationContent });   
  } catch (error: any) {
    console.error('评估失败:', error);
    return NextResponse.json(
      { error: error.message || '评估失败' },
      { status: 500 }
    );
  }
} 