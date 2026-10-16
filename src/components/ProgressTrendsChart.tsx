import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { WeightHistoryPoint } from '../types';

interface ProgressTrendsChartProps {
  history: WeightHistoryPoint[];
}

type ViewMode = 'both' | 'weight' | 'waist' | 'arm';

export const ProgressTrendsChart: React.FC<ProgressTrendsChartProps> = ({ history }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('both');

  // Format chart data with 30-day labels
  const chartData = history.map((item, index) => ({
    name: item.day || `Día ${index * 7 + 1}`,
    date: item.date || item.week,
    fullLabel: `${item.day || item.week} · ${item.date || ''}`,
    weight: item.weight,
    waist: item.waist,
    arm: item.arm,
  }));

  // Min and max domain bounds for smooth presentation
  const weights = chartData.map((d) => d.weight);
  const waists = chartData.map((d) => d.waist);
  const minWeight = Math.floor(Math.min(...weights, 75)) - 1;
  const maxWeight = Math.ceil(Math.max(...weights)) + 1;
  const minWaist = Math.floor(Math.min(...waists)) - 1;
  const maxWaist = Math.ceil(Math.max(...waists)) + 1;

  // Initial and latest deltas
  const firstPoint = chartData[0];
  const lastPoint = chartData[chartData.length - 1];
  const weightDelta = (lastPoint.weight - firstPoint.weight).toFixed(1);
  const waistDelta = (lastPoint.waist - firstPoint.waist).toFixed(1);

  // Custom Dark Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#171f33]/95 backdrop-blur-md border border-[#444933] rounded-xl p-3 shadow-2xl text-xs space-y-1.5 min-w-[170px] z-50">
          <div className="flex items-center justify-between border-b border-[#444933]/50 pb-1 text-[#8e9379] font-bold text-[10px] uppercase">
            <span>{data.name}</span>
            <span className="text-[#c4c9ac]">{data.date}</span>
          </div>

          <div className="space-y-1 pt-0.5">
            {(viewMode === 'both' || viewMode === 'weight') && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#dae2fd]">
                  <span className="w-2 h-2 rounded-full bg-[#c3f400]" />
                  <span>Peso:</span>
                </span>
                <span className="font-['Montserrat'] font-bold text-[#c3f400] text-sm tabular-nums">
                  {data.weight} kg
                </span>
              </div>
            )}

            {(viewMode === 'both' || viewMode === 'waist') && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#dae2fd]">
                  <span className="w-2 h-2 rounded-full bg-[#00daf3]" />
                  <span>Cintura:</span>
                </span>
                <span className="font-['Montserrat'] font-bold text-[#00daf3] text-sm tabular-nums">
                  {data.waist} cm
                </span>
              </div>
            )}

            {viewMode === 'arm' && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#dae2fd]">
                  <span className="w-2 h-2 rounded-full bg-[#ff5708]" />
                  <span>Brazo:</span>
                </span>
                <span className="font-['Montserrat'] font-bold text-[#ff5708] text-sm tabular-nums">
                  {data.arm} cm
                </span>
              </div>
            )}
          </div>

          <div className="text-[10px] text-[#8e9379] pt-1 border-t border-[#444933]/30 flex justify-between">
            <span>Δ vs inicio:</span>
            <span className="text-[#c3f400] font-semibold">
              {(data.weight - firstPoint.weight).toFixed(1)} kg | {(data.waist - firstPoint.waist).toFixed(1)} cm
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col justify-between h-full space-y-4">
      {/* Top Header & View Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-['Montserrat'] font-bold text-lg text-[#ffffff]">
              Evolución de Peso & Crecimiento Magro
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#c3f400]/15 text-[#c3f400] border border-[#c3f400]/30 uppercase">
              ÚLTIMOS 30 DÍAS
            </span>
          </div>
          <p className="text-xs text-[#c4c9ac] mt-0.5">
            Tendencia antropométrica comparada de peso corporal y reducción de cintura
          </p>
        </div>

        {/* View mode segmented toggles */}
        <div className="flex items-center gap-1 bg-[#171f33] p-1 rounded-lg border border-[#444933]/50 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('both')}
            className={`px-2.5 py-1 rounded text-xs font-['Inter'] font-bold transition-all cursor-pointer whitespace-nowrap ${
              viewMode === 'both'
                ? 'bg-[#c3f400] text-[#161e00] shadow-sm'
                : 'text-[#c4c9ac] hover:text-[#ffffff]'
            }`}
          >
            Peso & Cintura
          </button>
          <button
            onClick={() => setViewMode('weight')}
            className={`px-2 py-1 rounded text-xs font-['Inter'] font-bold transition-all cursor-pointer ${
              viewMode === 'weight'
                ? 'bg-[#c3f400] text-[#161e00] shadow-sm'
                : 'text-[#c4c9ac] hover:text-[#ffffff]'
            }`}
          >
            Peso (kg)
          </button>
          <button
            onClick={() => setViewMode('waist')}
            className={`px-2 py-1 rounded text-xs font-['Inter'] font-bold transition-all cursor-pointer ${
              viewMode === 'waist'
                ? 'bg-[#00daf3] text-[#001f24] shadow-sm'
                : 'text-[#c4c9ac] hover:text-[#ffffff]'
            }`}
          >
            Cintura (cm)
          </button>
          <button
            onClick={() => setViewMode('arm')}
            className={`px-2 py-1 rounded text-xs font-['Inter'] font-bold transition-all cursor-pointer ${
              viewMode === 'arm'
                ? 'bg-[#ff5708] text-[#ffffff] shadow-sm'
                : 'text-[#c4c9ac] hover:text-[#ffffff]'
            }`}
          >
            Brazo
          </button>
        </div>
      </div>

      {/* Target & Metric Legend Indicators */}
      <div className="flex flex-wrap items-center justify-between text-xs gap-2 pt-1 border-b border-[#444933]/30 pb-2">
        <div className="flex items-center gap-4">
          {(viewMode === 'both' || viewMode === 'weight') && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c3f400]" />
              <span className="text-[#ffffff] font-semibold">Peso:</span>
              <span className="text-[#c3f400] font-bold font-mono">{lastPoint.weight} kg</span>
              <span className="text-[10px] text-[#c3f400] font-mono">({weightDelta} kg)</span>
            </div>
          )}

          {(viewMode === 'both' || viewMode === 'waist') && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00daf3]" />
              <span className="text-[#ffffff] font-semibold">Cintura:</span>
              <span className="text-[#00daf3] font-bold font-mono">{lastPoint.waist} cm</span>
              <span className="text-[10px] text-[#00daf3] font-mono">({waistDelta} cm)</span>
            </div>
          )}

          {viewMode === 'arm' && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5708]" />
              <span className="text-[#ffffff] font-semibold">Bíceps / Brazo:</span>
              <span className="text-[#ff5708] font-bold font-mono">{lastPoint.arm} cm</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[#8e9379]">
          <span>Objetivo: <strong className="text-[#dae2fd]">75.0 kg</strong></span>
          <span className="text-[#c3f400] font-semibold">Hito 4: -2.1 kg Alcanzado</span>
        </div>
      </div>

      {/* Recharts Canvas */}
      <div className="w-full h-64 bg-[#171f33]/70 rounded-xl p-2 border border-[#444933]/30 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 12, right: 18, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="weightAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c3f400" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#c3f400" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="waistAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00daf3" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#00daf3" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#2d3449"
              strokeDasharray="3 3"
              vertical={false}
              opacity={0.4}
            />

            <XAxis
              dataKey="name"
              stroke="#8e9379"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#444933' }}
              dy={5}
            />

            {/* Left Y-Axis: Weight */}
            {(viewMode === 'both' || viewMode === 'weight') && (
              <YAxis
                yAxisId="weight"
                domain={[minWeight, maxWeight]}
                stroke="#c3f400"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                unit=" kg"
                orientation="left"
              />
            )}

            {/* Right Y-Axis: Waist */}
            {(viewMode === 'both' || viewMode === 'waist') && (
              <YAxis
                yAxisId="waist"
                domain={[minWaist, maxWaist]}
                stroke="#00daf3"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                unit=" cm"
                orientation={viewMode === 'both' ? 'right' : 'left'}
              />
            )}

            {/* Y-Axis: Arm */}
            {viewMode === 'arm' && (
              <YAxis
                yAxisId="arm"
                domain={[34, 38]}
                stroke="#ff5708"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                unit=" cm"
                orientation="left"
              />
            )}

            <Tooltip content={<CustomTooltip />} />

            {/* Reference Line for 75kg goal */}
            {(viewMode === 'both' || viewMode === 'weight') && (
              <ReferenceLine
                yAxisId="weight"
                y={75.0}
                stroke="#8e9379"
                strokeDasharray="4 4"
                label={{
                  value: 'Objetivo 75kg',
                  position: 'insideBottomRight',
                  fill: '#c3f400',
                  fontSize: 10,
                }}
              />
            )}

            {/* Weight Area & Line */}
            {(viewMode === 'both' || viewMode === 'weight') && (
              <Area
                yAxisId="weight"
                type="monotone"
                dataKey="weight"
                stroke="#c3f400"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#weightAreaGrad)"
                activeDot={{ r: 6, fill: '#c3f400', stroke: '#ffffff', strokeWidth: 2 }}
                dot={{ r: 4, fill: '#171f33', stroke: '#c3f400', strokeWidth: 2 }}
                isAnimationActive={true}
              />
            )}

            {/* Waist Line */}
            {(viewMode === 'both' || viewMode === 'waist') && (
              <Line
                yAxisId="waist"
                type="monotone"
                dataKey="waist"
                stroke="#00daf3"
                strokeWidth={2.5}
                strokeDasharray={viewMode === 'both' ? '4 4' : undefined}
                dot={{ r: 4, fill: '#171f33', stroke: '#00daf3', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#00daf3', stroke: '#ffffff', strokeWidth: 2 }}
                isAnimationActive={true}
              />
            )}

            {/* Arm Line */}
            {viewMode === 'arm' && (
              <Line
                yAxisId="arm"
                type="monotone"
                dataKey="arm"
                stroke="#ff5708"
                strokeWidth={3}
                dot={{ r: 5, fill: '#171f33', stroke: '#ff5708', strokeWidth: 2 }}
                isAnimationActive={true}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 30-Day Timeline Checkpoints */}
      <div className="grid grid-cols-5 text-center text-xs font-semibold text-[#8e9379] pt-1 border-t border-[#444933]/30">
        {chartData.map((d, i) => (
          <div key={d.name}>
            <div className="text-[10px] text-[#8e9379]">{d.name} ({d.date})</div>
            <div className={i === chartData.length - 1 ? 'text-[#c3f400] font-bold' : 'text-[#dae2fd]'}>
              {viewMode === 'waist'
                ? `${d.waist} cm`
                : viewMode === 'arm'
                ? `${d.arm} cm`
                : `${d.weight} kg`}
            </div>
            {viewMode === 'both' && (
              <div className="text-[10px] text-[#00daf3]">
                {d.waist} cm
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
