'use client';

import { motion } from 'framer-motion';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import { ModelVote } from '@/types/analysis';
import { getRiskColor, getRiskLevel } from '@/lib/utils';
import { useState } from 'react';

interface ModelBreakdownChartProps {
  modelVotes: ModelVote[];
}

export function ModelBreakdownChart({ modelVotes }: ModelBreakdownChartProps) {
  const [viewMode, setViewMode] = useState<'radar' | 'bar'>('radar');

  const chartData = modelVotes.map(vote => ({
    model: vote.modelName,
    score: vote.score * 100, // Convert to percentage
    weight: vote.weight,
    normalizedScore: (vote.score * vote.weight) * 100
  }));

  const totalWeight = modelVotes.reduce((sum, v) => sum + v.weight, 0);
  const compositeScore = modelVotes.reduce((sum, v) => sum + (v.score * v.weight), 0) / totalWeight;
  const riskLevel = getRiskLevel(compositeScore);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Multi-Model Voting Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Consensus from {modelVotes.length} AI detection models
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('radar')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              viewMode === 'radar' 
                ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' 
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-100'
            }`}
          >
            Radar
          </button>
          <button
            onClick={() => setViewMode('bar')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              viewMode === 'bar' 
                ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' 
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-100'
            }`}
          >
            Bar
          </button>
        </div>
      </div>

      {/* Composite Score Display */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-800"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Composite Fraud Score</p>
            <div className="flex items-baseline gap-3">
              <span className={`text-4xl font-bold ${getRiskColor(riskLevel.level)}`}>
                {(compositeScore * 100).toFixed(1)}%
              </span>
              <span className={`text-sm px-2 py-1 rounded-full border ${getRiskColor(riskLevel.level)} bg-opacity-10`}>
                {riskLevel.level.toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Weighted Average</p>
            <p className="text-xs text-zinc-500">
              Based on {modelVotes.length} models with specialized weighting
            </p>
          </div>
        </div>
      </motion.div>

      {/* Chart Display */}
      <div className="border rounded-lg p-6 bg-zinc-900/30">
        {viewMode === 'radar' ? (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={chartData}>
              <PolarGrid stroke="#3f3f46" />
              <PolarAngleAxis 
                dataKey="model" 
                tick={{ fill: '#a1a1aa', fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]}
                tick={{ fill: '#71717a', fontSize: 10 }}
              />
              <Radar
                name="Detection Score"
                dataKey="score"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
              />
              <Radar
                name="Weighted Score"
                dataKey="normalizedScore"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.2}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #3f3f46',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis 
                dataKey="model" 
                tick={{ fill: '#a1a1aa', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fill: '#71717a', fontSize: 10 }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #3f3f46',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => {
                  const level = getRiskLevel(entry.score / 100);
                  const color = level.level === 'critical' || level.level === 'high' ? '#ef4444' :
                                level.level === 'medium' ? '#f59e0b' : '#10b981';
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Model Details */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Model Scores & Weights</h4>
        <div className="space-y-2">
          {modelVotes.map((vote, idx) => {
            const level = getRiskLevel(vote.score);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    vote.weight > 1 ? 'bg-emerald-500' : 'bg-zinc-500'
                  }`} />
                  <div>
                    <p className="font-medium text-sm">{vote.modelName}</p>
                    <p className="text-xs text-muted-foreground">
                      Weight: {vote.weight}x {vote.weight > 1 && '(Specialized)'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getRiskColor(level.level)}`}>
                    {(vote.score * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Weighted: {(vote.score * vote.weight * 100).toFixed(1)}%
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
