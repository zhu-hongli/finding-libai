import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type EvaluationItem = {
  评价: string
  得分: number
}

type SummaryItem = {
  得分: number
  依据: string
}

type EvaluationData = {
  综合评分: SummaryItem
  [key: string]: EvaluationItem | SummaryItem
}

const getScoreColor = (score: number) => {
  if (score >= 8) return "text-green-500"
  if (score >= 6) return "text-yellow-500"
  return "text-red-500"
}

export default function Component({ jsonInput = '' }: { jsonInput?: string }) {
  const [data, setData] = useState<Partial<EvaluationData>>({})
  
  useEffect(() => {
    if (!jsonInput || jsonInput.length < 10) return;

    try {
      const parseTextFormat = (text: string) => {
        const lines = text.split('\n').filter(line => line.trim());
        const result: Partial<EvaluationData> = {...data}; // 保留现有数据
        let currentCategory = '';
        
        lines.forEach(line => {
          if (line.match(/^\d+\./)) {
            currentCategory = line.replace(/^\d+\.\s+/, '').trim();
          } else if (currentCategory) {
            if (!result[currentCategory]) {
              result[currentCategory] = {} as EvaluationItem;
            }
            
            if (line.includes('评价：')) {
              (result[currentCategory] as EvaluationItem).评价 = line.split('评价：')[1].trim();
            } else if (line.includes('得分：')) {
              const scoreStr = line.split('得分：')[1].trim();
              const score = parseFloat(scoreStr);
              if (!isNaN(score)) {
                if (currentCategory === '综合评分') {
                  (result[currentCategory] as SummaryItem).得分 = score;
                } else {
                  (result[currentCategory] as EvaluationItem).得分 = score;
                }
              }
            } else if (line.includes('依据：') && currentCategory === '综合评分') {
              (result[currentCategory] as SummaryItem).依据 = line.split('依据：')[1].trim();
            }
          }
        });
        
        return result;
      };

      const parsedData = parseTextFormat(jsonInput);
      setData(parsedData);
    } catch (error) {
      console.error("Failed to parse text:", error);
    }
  }, [jsonInput]);

  return (
    <div className="p-4 space-y-4">
      {/* 只在有综合评分时显示总结卡片 */}
      {data['综合评分'] && (
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle>诗歌评价总结</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              综合评分: <span className={getScoreColor(data['综合评分'].得分)}>{data['综合评分'].得分}</span>/10
            </div>
            <p className="mt-2">{data['综合评分'].依据}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(data).map(([key, value]) => {
          if (key === '综合评分') return null;
          const item = value as EvaluationItem;
          // 只渲染有评价或得分的项目
          if (!item.评价 && !item.得分) return null;
          return (
            <Card key={key}>
              <CardHeader>
                <CardTitle>{key}</CardTitle>
              </CardHeader>
              <CardContent>
                {item.得分 !== undefined && !isNaN(item.得分) && (
                  <div className="text-2xl font-bold">
                    得分: <span className={getScoreColor(item.得分)}>{item.得分}</span>/10
                  </div>
                )}
                {item.评价 && <p className="mt-2">{item.评价}</p>}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}