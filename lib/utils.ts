import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { RiskLevel } from "@/types/analysis"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRiskLevel(score: number): RiskLevel {
  if (score < 0.2) return { level: 'safe', score };
  if (score < 0.4) return { level: 'low', score };
  if (score < 0.6) return { level: 'medium', score };
  if (score < 0.8) return { level: 'high', score };
  return { level: 'critical', score };
}

export function getRiskColor(level: RiskLevel['level']): string {
  const colors = {
    safe: 'text-emerald-500',
    low: 'text-green-500',
    medium: 'text-yellow-500',
    high: 'text-orange-500',
    critical: 'text-red-500'
  };
  return colors[level];
}

export function getRiskBgColor(level: RiskLevel['level']): string {
  const colors = {
    safe: 'bg-emerald-500/10 border-emerald-500/20',
    low: 'bg-green-500/10 border-green-500/20',
    medium: 'bg-yellow-500/10 border-yellow-500/20',
    high: 'bg-orange-500/10 border-orange-500/20',
    critical: 'bg-red-500/10 border-red-500/20'
  };
  return colors[level];
}

export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function calculateCompositeScore(votes: Array<{ score: number; weight: number }>): number {
  const totalWeight = votes.reduce((sum, v) => sum + v.weight, 0);
  const weightedSum = votes.reduce((sum, v) => sum + (v.score * v.weight), 0);
  return weightedSum / totalWeight;
}
