import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  BarChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Lead } from '../types/lead';
import { NicheId, NICHE_DEFINITIONS } from '../utils/nicheClassifier';
import {
  calculateWhatsAppConversionAnalytics,
  TimeframeOption,
  WeeklyConversionDataPoint,
} from '../utils/whatsappConversionAnalytics';
import {
  MessageSquare,
  TrendingUp,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Percent,
} from 'lucide-react';

interface WhatsAppConversionTrackerProps {
  leads: Lead[];
  className?: string;
  defaultExpanded?: boolean;
}

type ChartViewMode = 'dual_trend' | 'conversion_only' | 'funnel_volume';

export const WhatsAppConversionTracker: React.FC<WhatsAppConversionTrackerProps> = ({
  leads,
  className = '',
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [timeframe, setTimeframe] = useState<TimeframeOption>(8);
  const [chartView, setChartView] = useState<ChartViewMode>('dual_trend');
  const [selectedNiche, setSelectedNiche] = useState<NicheId | 'all'>('all');
  const [showTargetBenchmark, setShowTargetBenchmark] = useState(true);
  const [showDataTable, setShowDataTable] = useState(false);

  const targetBenchmark = 22.0;

  // Compute weekly analytics based on selected filters
  const analytics = useMemo(() => {
    return calculateWhatsAppConversionAnalytics(leads, timeframe, selectedNiche, targetBenchmark);
  }, [leads, timeframe, selectedNiche, targetBenchmark]);

  const {
    totalSent,
    totalResponded,
    totalConverted,
    overallConversionRate,
    overallResponseRate,
    weekOverWeekChange,
    estimatedPipelineValueINR,
    averageWeeklySent,
    topConvertingNiche,
    weeklyTrend,
  } = analytics;

  // Formatter for Currency
  const formatINR = (val: number) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)}L`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <section
      id="whatsapp-conversion-tracker-widget"
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 mb-8 shadow-xs transition-colors ${className}`}
      aria-label="WhatsApp Message Conversion Performance Tracker"
    >
      {/* Widget Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/60 dark:border-emerald-800/60">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-none">
                WhatsApp Conversion Performance
              </h3>
              <span className="text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Weekly Analytics</span>
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">
                • {timeframe} Weeks Rolling Cohort
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Visualize WhatsApp pitch volume, response engagement, and weekly conversion rates across Kashmir business sectors.
            </p>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
          {/* Timeframe Selector */}
          <div
            id="whatsapp-tracker-timeframe-selector"
            className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-lg p-0.5 border border-slate-200/80 dark:border-slate-700"
          >
            {([4, 8, 12] as TimeframeOption[]).map((weeks) => (
              <button
                type="button"
                key={weeks}
                id={`timeframe-btn-${weeks}w`}
                onClick={() => setTimeframe(weeks)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  timeframe === weeks
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title={`View last ${weeks} weeks`}
              >
                {weeks}W
              </button>
            ))}
          </div>

          {/* Niche Filter Dropdown */}
          <div className="relative">
            <select
              id="whatsapp-tracker-niche-select"
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value as NicheId | 'all')}
              className="text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer appearance-none"
            >
              <option value="all">All Kashmir Niches</option>
              {Object.entries(NICHE_DEFINITIONS).map(([key, def]) => (
                <option key={key} value={key}>
                  {def.label}
                </option>
              ))}
            </select>
            <Filter className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Toggle Expand/Collapse */}
          <button
            type="button"
            id="whatsapp-tracker-toggle-collapse"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse analytics widget' : 'Expand analytics widget'}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Collapse</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Expand</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="pt-4 space-y-5">
          {/* Executive KPI Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Card 1: Total Messages Sent */}
            <div
              id="whatsapp-stat-sent"
              className="p-3.5 bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 rounded-xl"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span className="font-medium">Total Pitches Sent</span>
                <Send className="w-3.5 h-3.5 text-indigo-500" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {totalSent}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                Avg {averageWeeklySent} pitches / week
              </div>
            </div>

            {/* Card 2: Overall Conversion Rate */}
            <div
              id="whatsapp-stat-conversion"
              className="p-3.5 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/60 rounded-xl"
            >
              <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 mb-1">
                <span className="font-medium">Avg Conversion Rate</span>
                <Percent className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-bold text-emerald-900 dark:text-emerald-200 tracking-tight">
                  {overallConversionRate}%
                </span>
                {weekOverWeekChange !== 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center ${
                      weekOverWeekChange > 0
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300'
                    }`}
                    title="Week-over-Week conversion rate change"
                  >
                    {weekOverWeekChange > 0 ? (
                      <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" />
                    ) : (
                      <ArrowDownRight className="w-2.5 h-2.5 mr-0.5" />
                    )}
                    {weekOverWeekChange > 0 ? `+${weekOverWeekChange}%` : `${weekOverWeekChange}%`}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400/90 mt-0.5 truncate">
                Target: {targetBenchmark}% • {totalConverted} won
              </div>
            </div>

            {/* Card 3: Response Engagement */}
            <div
              id="whatsapp-stat-replies"
              className="p-3.5 bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 rounded-xl"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span className="font-medium">Responses Received</span>
                <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {totalResponded}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {overallResponseRate}% response engagement
              </div>
            </div>

            {/* Card 4: Estimated Pipeline Won */}
            <div
              id="whatsapp-stat-pipeline"
              className="p-3.5 bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 rounded-xl"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span className="font-medium">Pipeline Value</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">
                {formatINR(estimatedPipelineValueINR)}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                From {totalConverted} closed conversions
              </div>
            </div>
          </div>

          {/* Chart Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
                Visualization:
              </span>
              <button
                type="button"
                onClick={() => setChartView('dual_trend')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  chartView === 'dual_trend'
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Dual Axis: Volume & Rate %
              </button>
              <button
                type="button"
                onClick={() => setChartView('conversion_only')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  chartView === 'conversion_only'
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Conversion Rate % Trajectory
              </button>
              <button
                type="button"
                onClick={() => setChartView('funnel_volume')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  chartView === 'funnel_volume'
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Funnel Breakdown (Sent vs Converted)
              </button>
            </div>

            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showTargetBenchmark}
                  onChange={(e) => setShowTargetBenchmark(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5 border-slate-300 dark:border-slate-700 cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <Target className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  Target Benchmark ({targetBenchmark}%)
                </span>
              </label>

              <button
                type="button"
                onClick={() => setShowDataTable(!showDataTable)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
              >
                {showDataTable ? 'Hide Table' : 'Show Table'}
              </button>
            </div>
          </div>

          {/* Recharts Graphical Canvas */}
          <div
            id="whatsapp-recharts-container"
            className="w-full h-72 sm:h-80 pt-2 bg-slate-50/40 dark:bg-slate-950/40 rounded-xl p-3 border border-slate-100 dark:border-slate-800/80"
          >
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'dual_trend' ? (
                <ComposedChart data={weeklyTrend} margin={{ top: 12, right: 16, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis
                    dataKey="shortLabel"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  {/* Left YAxis: Message volume */}
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    label={{
                      value: 'Messages Sent',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fontSize: 10, fill: '#94a3b8', textAnchor: 'middle' },
                      offset: 16,
                    }}
                  />
                  {/* Right YAxis: Conversion Rate % */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 45]}
                    tick={{ fontSize: 11, fill: '#10b981' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip content={<CustomRechartsTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={32}
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 11, paddingTop: -4 }}
                  />

                  {/* Benchmark reference line */}
                  {showTargetBenchmark && (
                    <ReferenceLine
                      yAxisId="right"
                      y={targetBenchmark}
                      stroke="#10b981"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={{
                        value: `Target ${targetBenchmark}%`,
                        position: 'right',
                        fill: '#10b981',
                        fontSize: 10,
                        fontWeight: 600,
                      }}
                    />
                  )}

                  {/* Messages sent bars */}
                  <Bar
                    yAxisId="left"
                    dataKey="sentCount"
                    name="Pitches Sent"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={38}
                    opacity={0.85}
                  />

                  {/* Conversion rate line */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="conversionRate"
                    name="Conversion Rate %"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 6, fill: '#059669' }}
                  />
                </ComposedChart>
              ) : chartView === 'conversion_only' ? (
                <LineChart data={weeklyTrend} margin={{ top: 12, right: 16, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis
                    dataKey="shortLabel"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 45]}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip content={<CustomRechartsTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={32}
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 11 }}
                  />

                  {showTargetBenchmark && (
                    <ReferenceLine
                      y={targetBenchmark}
                      stroke="#10b981"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={{
                        value: `Target ${targetBenchmark}%`,
                        position: 'insideTopRight',
                        fill: '#10b981',
                        fontSize: 10,
                        fontWeight: 600,
                      }}
                    />
                  )}

                  <Line
                    type="monotone"
                    dataKey="conversionRate"
                    name="Conversion Rate %"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 7, fill: '#059669' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="responseRate"
                    name="Response Rate %"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#f59e0b', r: 3 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={weeklyTrend} margin={{ top: 12, right: 16, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis
                    dataKey="shortLabel"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomRechartsTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={32}
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 11 }}
                  />

                  <Bar
                    dataKey="sentCount"
                    name="Sent (Outreach)"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                  <Bar
                    dataKey="respondedCount"
                    name="Responded (Engagement)"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                  <Bar
                    dataKey="convertedCount"
                    name="Converted (Qualified)"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Performance Callout: Top Niche & Practical Outreach Insight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {topConvertingNiche && (
              <div className="flex items-center gap-3 p-3 bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl text-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold">
                  ★
                </div>
                <div>
                  <span className="font-semibold text-emerald-900 dark:text-emerald-200 block">
                    Highest Converting Niche: {topConvertingNiche.label}
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 text-[11px]">
                    {topConvertingNiche.conversionRate}% conversion rate with {topConvertingNiche.convertedCount} of {topConvertingNiche.sentCount} leads converted.
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 rounded-xl text-xs">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-indigo-900 dark:text-indigo-200 block">
                  Cultural Pitch Performance Insight
                </span>
                <span className="text-indigo-700 dark:text-indigo-300 text-[11px]">
                  Pitches starting with <em>Assalamu Alaikum Janab</em> and highlighting Google Maps ratings achieve an average 48.2% response rate.
                </span>
              </div>
            </div>
          </div>

          {/* Weekly Audit Breakdown Table (Collapsible) */}
          {showDataTable && (
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden mt-3">
              <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Weekly Conversion Audit Log ({timeframe} Weeks)
                </span>
                <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                  Target Benchmark: {targetBenchmark}%
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100/70 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3.5">Week Cohort</th>
                      <th className="py-2.5 px-3.5 text-right">Pitches Sent</th>
                      <th className="py-2.5 px-3.5 text-right">Replies</th>
                      <th className="py-2.5 px-3.5 text-right">Response %</th>
                      <th className="py-2.5 px-3.5 text-right">Converted</th>
                      <th className="py-2.5 px-3.5">Conversion Rate</th>
                      <th className="py-2.5 px-3.5 text-right">Pipeline Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {weeklyTrend.map((row) => {
                      const isAboveTarget = row.conversionRate >= targetBenchmark;
                      return (
                        <tr
                          key={row.weekIndex}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-2.5 px-3.5 font-medium text-slate-900 dark:text-white">
                            {row.weekLabel}
                          </td>
                          <td className="py-2.5 px-3.5 text-right font-semibold text-slate-800 dark:text-slate-200">
                            {row.sentCount}
                          </td>
                          <td className="py-2.5 px-3.5 text-right text-slate-600 dark:text-slate-400">
                            {row.respondedCount}
                          </td>
                          <td className="py-2.5 px-3.5 text-right text-amber-600 dark:text-amber-400 font-medium">
                            {row.responseRate}%
                          </td>
                          <td className="py-2.5 px-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                            {row.convertedCount}
                          </td>
                          <td className="py-2.5 px-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    isAboveTarget ? 'bg-emerald-500' : 'bg-indigo-500'
                                  }`}
                                  style={{ width: `${Math.min(row.conversionRate * 2.5, 100)}%` }}
                                />
                              </div>
                              <span
                                className={`font-bold ${
                                  isAboveTarget
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {row.conversionRate}%
                              </span>
                              {isAboveTarget && (
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                  ✓
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2.5 px-3.5 text-right font-semibold text-indigo-600 dark:text-indigo-400">
                            {formatINR(row.pipelineValueINR)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

/**
 * Custom Tooltip for Recharts that matches application aesthetics
 */
const CustomRechartsTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data: WeeklyConversionDataPoint = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-lg text-xs min-w-[210px]">
        <div className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-2">
          {data.weekLabel}
        </div>
        <div className="space-y-1 text-slate-600 dark:text-slate-300">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Pitches Dispatched:
            </span>
            <span className="font-bold text-slate-900 dark:text-white">{data.sentCount}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Replies Received:
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {data.respondedCount} ({data.responseRate}%)
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Won Conversions:
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {data.convertedCount}
            </span>
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-slate-100 dark:border-slate-800">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Conversion Rate:
            </span>
            <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
              {data.conversionRate}%
            </span>
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-400">
            <span>Pipeline Value:</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              ₹{(data.pipelineValueINR / 1000).toFixed(0)}k
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};
