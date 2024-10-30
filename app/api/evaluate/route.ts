import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { poem } = await request.json();

    // 这里需要替换为实际的 AI API 调用
    // 示例响应
    const evaluation = {
      score: Math.floor(Math.random() * 30) + 70, // 示例分数
      feedback: "这是一首结构完整、意境优美的诗歌。意象运用恰当，韵律感强，展现了作者独特的艺术感染力。建议在意象的创新性上可以进一步加强。"
    };

    return NextResponse.json(evaluation);
  } catch (error) {
    return NextResponse.json(
      { error: '评价失败' },
      { status: 500 }
    );
  }
} 