'use client';

import { useState } from 'react';

interface EvaluationResult {
  score: number;
  feedback: string;
}

export default function PoemEvaluator() {
  const [poem, setPoem] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ poem }),
      });
      
      const data = await response.json();
      setEvaluation(data);
    } catch (error) {
      console.error('评价失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <textarea
        value={poem}
        onChange={(e) => setPoem(e.target.value)}
        placeholder="请输入您想要评价的诗词..."
        className="w-full h-48 p-4 rounded-lg mb-4 
          bg-background border-2 
          border-foreground/20 
          focus:border-foreground/40 
          hover:border-foreground/30
          transition-colors
          outline-none
          resize-none"
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !poem.trim()}
        className="w-full py-3 px-4 rounded-lg
          bg-foreground text-background
          hover:bg-foreground/90
          disabled:opacity-50 
          disabled:cursor-not-allowed
          transition-colors"
      >
        {loading ? "评价中..." : "开始评价"}
      </button>
      
      {evaluation && (
        <div className="mt-8 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">评价结果</h2>
          <div className="mb-4">
            <span className="font-medium">得分：</span>
            <span className="text-2xl text-blue-600">{evaluation.score}</span>/100
          </div>
          <div>
            <span className="font-medium">评价意见：</span>
            <p className="mt-2 text-gray-700">{evaluation.feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
} 