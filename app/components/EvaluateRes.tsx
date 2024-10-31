import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type EvaluationItem = {
  评价: string
  得分: number
}

type EvaluationData = {
  [key: string]: EvaluationItem | { 得分: number, 依据: string }
}

export default function Component({ jsonInput = '' }: { jsonInput?: string }) {
  const [data, setData] = useState<EvaluationData | null>(null)
  useEffect(() => {
    try {
      const outerData = JSON.parse(jsonInput)
      const innerJsonString = outerData.evaluation.replace('```json\n', '').replace('\n```', '')
      const parsedData = JSON.parse(innerJsonString) as EvaluationData
      setData(parsedData)
    } catch (error) {
      console.error("Failed to parse JSON:", error)
    }
  }, [jsonInput])

  console.log(data);

  if (!data) {
    return <div>No data available or invalid JSON input.</div>
  }

  const getScoreColor = (score: number) => {
    if (score <= 4) return "text-red-500"
    if (score <= 6) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <div className="p-4 space-y-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(data).map(([key, value]) => {
          if (key === '综合评分') return null
          const item = value as EvaluationItem
          return (
            <Card key={key}>
              <CardHeader>
                <CardTitle>{key}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  得分: <span className={getScoreColor(item.得分)}>{item.得分}</span>/10
                </div>
                <p className="mt-2">{item.评价}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}