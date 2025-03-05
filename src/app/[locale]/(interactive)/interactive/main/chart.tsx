'use client'

import { Bar, BarChart, XAxis, YAxis } from 'recharts'

import { Card, CardContent } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export const chartConfig = {
  visitors: {
    label: 'Votes',
  },
  option0: {
    label: 'Antwort 1',
    color: 'var(--chart-1)',
  },
  option1: {
    label: 'Antwort 2',
    color: 'var(--chart-2)',
  },
  option2: {
    label: 'Antwort 3',
    color: 'var(--chart-3)',
  },
  option3: {
    label: 'Antwort 4',
    color: 'var(--chart-4)',
  },
  option4: {
    label: 'Antwort 5',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig

export function DDChart({ data }) {
  return (
    <Card className={'border-0'}>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className={'max-h-[250px] w-full h-64'}
        >
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: 10,
            }}
          >
            <YAxis
              dataKey="browser"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="visitors" type="number" />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="visitors" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
