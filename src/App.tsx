import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Plus,
  Trash2,
  ChevronUp,
  Sparkles,
  Target,
  Zap,
  Rocket,
  Settings2,
} from "lucide-react";
import type { Id } from "../convex/_generated/dataModel";

type FinancialRecord = {
  _id: Id<"financialRecords">;
  year: number;
  age: number;
  netWorth: number;
  growthPercentage?: number;
  growthAmount?: number;
};

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    const millions = value / 1000000;
    // Remove trailing zeros: 13.50 -> 13.5, 13.00 -> 13
    const formatted = millions.toFixed(2).replace(/\.?0+$/, '');
    return `$${formatted}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toLocaleString()}`;
}

function formatFullCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string; payload?: { isProjected?: boolean } }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    const isProjected = payload[0]?.payload?.isProjected;
    return (
      <div className={`backdrop-blur-sm border rounded-xl p-4 shadow-2xl ${
        isProjected
          ? "bg-emerald-900/95 border-emerald-500/30"
          : "bg-navy-900/95 border-gold-500/30"
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <p className={`font-display text-lg ${isProjected ? "text-emerald-400" : "text-gold-400"}`}>
            {label}
          </p>
          {isProjected && (
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
              Projected
            </span>
          )}
        </div>
        {payload.map((entry, index) => (
          <p key={index} className="text-white/90 text-sm">
            {entry.dataKey === "netWorth" && "Net Worth: "}
            {entry.dataKey === "projectedNetWorth" && "Projected Net Worth: "}
            {entry.dataKey === "growthPercentage" && "Growth: "}
            {entry.dataKey === "growthAmount" && "Growth Amount: "}
            {entry.dataKey === "combinedGrowthAmount" && (isProjected ? "Projected Growth: " : "Growth Amount: ")}
            <span className={`font-semibold ${isProjected ? "text-emerald-300" : "text-gold-300"}`}>
              {entry.dataKey === "growthPercentage"
                ? `${entry.value}%`
                : formatFullCurrency(entry.value)}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue?: string;
  delay: number;
}) {
  return (
    <div
      className="relative group opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-gold-600/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
      <div className="relative bg-navy-900/60 backdrop-blur-sm border border-gold-500/20 rounded-2xl p-6 hover:border-gold-500/40 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-gold-500/20 to-gold-600/10 rounded-xl">
            <Icon className="w-6 h-6 text-gold-400" />
          </div>
          <ChevronUp className="w-5 h-5 text-emerald-400" />
        </div>
        <p className="text-navy-300 text-sm uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-display font-bold text-white">{value}</p>
        {subValue && <p className="text-gold-400/80 text-sm mt-1">{subValue}</p>}
      </div>
    </div>
  );
}

function DataInputForm({
  onAdd,
  records,
}: {
  onAdd: (data: {
    year: number;
    age: number;
    netWorth: number;
    growthPercentage?: number;
    growthAmount?: number;
  }) => void;
  records: FinancialRecord[];
}) {
  const [year, setYear] = useState(new Date().getFullYear() + 1);
  const [age, setAge] = useState(37);
  const [netWorth, setNetWorth] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (records.length > 0) {
      const lastRecord = records[records.length - 1];
      setYear(lastRecord.year + 1);
      setAge(lastRecord.age + 1);
    }
  }, [records]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const netWorthNum = parseFloat(netWorth.replace(/,/g, ""));
    if (isNaN(netWorthNum)) return;

    let growthPercentage: number | undefined;
    let growthAmount: number | undefined;

    if (records.length > 0) {
      const lastRecord = records[records.length - 1];
      growthAmount = netWorthNum - lastRecord.netWorth;
      growthPercentage = Math.round((growthAmount / lastRecord.netWorth) * 100);
    }

    onAdd({
      year,
      age,
      netWorth: netWorthNum,
      growthPercentage,
      growthAmount,
    });

    setNetWorth("");
    setYear(year + 1);
    setAge(age + 1);
    setIsOpen(false);
  };

  return (
    <div className="mb-8">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40"
        >
          <Plus className="w-5 h-5" />
          Add Year
          <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-navy-900/60 backdrop-blur-sm border border-gold-500/20 rounded-2xl p-6 animate-fade-in-up"
        >
          <h3 className="text-xl font-display font-semibold text-white mb-4">
            Add Financial Record
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-navy-300 text-sm mb-2">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full bg-navy-800/50 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-navy-300 text-sm mb-2">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                className="w-full bg-navy-800/50 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-navy-300 text-sm mb-2">Net Worth ($)</label>
              <input
                type="text"
                value={netWorth}
                onChange={(e) => setNetWorth(e.target.value)}
                placeholder="3,900,000"
                className="w-full bg-navy-800/50 border border-navy-600 rounded-xl px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-semibold rounded-xl hover:from-gold-400 hover:to-gold-500 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Record
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-6 py-3 bg-navy-700/50 text-navy-300 font-medium rounded-xl hover:bg-navy-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function DataTable({
  records,
  onDelete,
}: {
  records: FinancialRecord[];
  onDelete: (id: Id<"financialRecords">) => void;
}) {
  return (
    <div className="bg-navy-900/60 backdrop-blur-sm border border-gold-500/20 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-gold-500/10">
        <h3 className="text-xl font-display font-semibold text-white">Financial History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-navy-800/50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gold-400 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gold-400 uppercase tracking-wider">
                Age
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gold-400 uppercase tracking-wider">
                Net Worth
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gold-400 uppercase tracking-wider">
                Growth %
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gold-400 uppercase tracking-wider">
                Growth $
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gold-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-700/50">
            {records.map((record, index) => (
              <tr
                key={record._id}
                className="hover:bg-navy-800/30 transition-colors group"
              >
                <td className="px-6 py-4 text-white font-medium">{record.year}</td>
                <td className="px-6 py-4 text-navy-300">{record.age}</td>
                <td className="px-6 py-4 text-right text-white font-semibold">
                  {formatFullCurrency(record.netWorth)}
                </td>
                <td className="px-6 py-4 text-right">
                  {record.growthPercentage !== undefined ? (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${
                        record.growthPercentage >= 50
                          ? "bg-emerald-500/20 text-emerald-400"
                          : record.growthPercentage >= 20
                          ? "bg-gold-500/20 text-gold-400"
                          : "bg-navy-600/50 text-navy-300"
                      }`}
                    >
                      <TrendingUp className="w-3 h-3" />
                      {record.growthPercentage}%
                    </span>
                  ) : (
                    <span className="text-navy-500">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right text-emerald-400">
                  {record.growthAmount !== undefined
                    ? `+${formatFullCurrency(record.growthAmount)}`
                    : "—"}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onDelete(record._id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-navy-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function App() {
  const records = useQuery(api.financialRecords.list) ?? [];
  const addRecord = useMutation(api.financialRecords.add);
  const removeRecord = useMutation(api.financialRecords.remove);
  const seedData = useMutation(api.financialRecords.seedData);
  const settings = useQuery(api.financialRecords.getSettings);
  const updateSettings = useMutation(api.financialRecords.updateSettings);

  const [projectionYears, setProjectionYears] = useState(10);
  const [customGrowthPercentage, setCustomGrowthPercentage] = useState<number | null>(null);
  const [annualContribution, setAnnualContribution] = useState<number | null>(null);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // Load settings from database
  useEffect(() => {
    if (settings && !settingsLoaded) {
      setProjectionYears(settings.projectionYears);
      setCustomGrowthPercentage(settings.customGrowthPercentage ?? null);
      setAnnualContribution(settings.annualContribution ?? null);
      setSettingsLoaded(true);
    }
  }, [settings, settingsLoaded]);

  // Save settings to database when they change
  const handleProjectionYearsChange = (years: number) => {
    setProjectionYears(years);
    updateSettings({
      projectionYears: years,
      customGrowthPercentage: customGrowthPercentage ?? undefined,
      annualContribution: annualContribution ?? undefined,
    });
  };

  const handleGrowthPercentageChange = (percentage: number | null) => {
    setCustomGrowthPercentage(percentage);
    updateSettings({
      projectionYears,
      customGrowthPercentage: percentage ?? undefined,
      annualContribution: annualContribution ?? undefined,
    });
  };

  const handleAnnualContributionChange = (contribution: number | null) => {
    setAnnualContribution(contribution);
    updateSettings({
      projectionYears,
      customGrowthPercentage: customGrowthPercentage ?? undefined,
      annualContribution: contribution ?? undefined,
    });
  };

  const chartData = records.map((r) => ({
    year: r.year.toString(),
    netWorth: r.netWorth,
    growthPercentage: r.growthPercentage ?? 0,
    growthAmount: r.growthAmount ?? 0,
    isProjected: false,
  }));

  const latestRecord = records[records.length - 1];
  const firstRecord = records[0];
  const totalGrowth =
    latestRecord && firstRecord
      ? ((latestRecord.netWorth - firstRecord.netWorth) / firstRecord.netWorth) * 100
      : 0;
  const avgGrowthPercentage =
    records.length > 1
      ? records.slice(1).reduce((sum, r) => sum + (r.growthPercentage ?? 0), 0) /
        (records.length - 1)
      : 0;

  // Get last year's growth amount
  const lastYearGrowthAmount = latestRecord?.growthAmount ?? 0;

  // Use custom growth percentage or average
  const effectiveGrowthPercentage = customGrowthPercentage ?? avgGrowthPercentage;

  // Effective annual contribution (default to 0 if not set)
  const effectiveAnnualContribution = annualContribution ?? 0;

  // Generate projection data with unified growth amount field
  // Only show last 2 historical records + projections
  const projectionData = (() => {
    if (!latestRecord || records.length === 0) return [];

    // Take only the last 2 historical records
    const recentHistoricalData = chartData.slice(-2).map(d => ({
      ...d,
      projectedNetWorth: undefined as number | undefined,
      combinedGrowthAmount: d.growthAmount, // Use combined field for bars
    }));

    let currentNetWorth = latestRecord.netWorth;
    let currentYear = latestRecord.year;
    let currentAge = latestRecord.age;

    const projectedPoints = [];

    for (let i = 1; i <= projectionYears; i++) {
      currentYear++;
      currentAge++;
      // Calculate growth amount based on percentage of current net worth + annual contribution
      const investmentGrowth = currentNetWorth * (effectiveGrowthPercentage / 100);
      const totalGrowth = investmentGrowth + effectiveAnnualContribution;
      currentNetWorth += totalGrowth;

      projectedPoints.push({
        year: currentYear.toString(),
        netWorth: undefined as number | undefined,
        projectedNetWorth: Math.round(currentNetWorth),
        growthPercentage: effectiveGrowthPercentage,
        growthAmount: undefined as number | undefined,
        combinedGrowthAmount: Math.round(totalGrowth), // Use combined field for bars
        age: currentAge,
        isProjected: true,
      });
    }

    // Add projected value to last historical point ONLY to connect the lines visually
    const lastHistorical = recentHistoricalData[recentHistoricalData.length - 1];
    if (lastHistorical) {
      lastHistorical.projectedNetWorth = lastHistorical.netWorth;
    }

    return [...recentHistoricalData, ...projectedPoints];
  })();

  // Calculate projected milestones using growth percentage + annual contribution
  const projectedMilestones = (() => {
    if (!latestRecord) return { fiveMillion: null, tenMillion: null };

    let currentNetWorth = latestRecord.netWorth;
    let yearsTo5M = null;
    let yearsTo10M = null;

    for (let i = 1; i <= 50; i++) {
      const investmentGrowth = currentNetWorth * (effectiveGrowthPercentage / 100);
      currentNetWorth += investmentGrowth + effectiveAnnualContribution;
      if (currentNetWorth >= 5000000 && yearsTo5M === null) {
        yearsTo5M = { years: i, year: latestRecord.year + i, age: latestRecord.age + i };
      }
      if (currentNetWorth >= 10000000 && yearsTo10M === null) {
        yearsTo10M = { years: i, year: latestRecord.year + i, age: latestRecord.age + i };
        break;
      }
    }

    return { fiveMillion: yearsTo5M, tenMillion: yearsTo10M };
  })();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12 opacity-0 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl shadow-lg shadow-gold-500/30">
              <DollarSign className="w-8 h-8 text-navy-950" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                Wealth <span className="text-gold-400">Tracker</span>
              </h1>
              <p className="text-navy-400">Financial History & Projection</p>
            </div>
          </div>
        </header>

        {/* Seed Data Button (only show if no data) */}
        {records.length === 0 && (
          <div className="mb-8 p-6 bg-navy-900/60 backdrop-blur-sm border border-gold-500/20 rounded-2xl animate-fade-in-up">
            <p className="text-navy-300 mb-4">
              No financial records yet. Would you like to load sample data?
            </p>
            <button
              onClick={() => seedData()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-semibold rounded-xl hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/25"
            >
              <Zap className="w-5 h-5" />
              Load Sample Data
            </button>
          </div>
        )}

        {/* Stats Cards */}
        {records.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard
              icon={DollarSign}
              label="Current Net Worth"
              value={formatCurrency(latestRecord?.netWorth ?? 0)}
              subValue={`Age ${latestRecord?.age ?? 0}`}
              delay={0.1}
            />
            <StatCard
              icon={TrendingUp}
              label="Latest Growth"
              value={`${latestRecord?.growthPercentage ?? 0}%`}
              subValue={`+${formatCurrency(latestRecord?.growthAmount ?? 0)}`}
              delay={0.2}
            />
            <StatCard
              icon={Target}
              label="Total Growth"
              value={`${totalGrowth.toFixed(0)}%`}
              subValue={`Since ${firstRecord?.year ?? ""}`}
              delay={0.3}
            />
            <StatCard
              icon={Calendar}
              label="Avg Annual Growth"
              value={`${avgGrowthPercentage.toFixed(0)}%`}
              subValue={`${records.length} years tracked`}
              delay={0.4}
            />
          </div>
        )}

        {/* Input Form */}
        <DataInputForm
          onAdd={addRecord}
          records={records}
        />

        {/* Charts */}
        {records.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Net Worth Over Time */}
            <div className="bg-navy-900/60 backdrop-blur-sm border border-gold-500/20 rounded-2xl p-6 opacity-0 animate-fade-in-up stagger-2">
              <h3 className="text-xl font-display font-semibold text-white mb-6">
                Net Worth Over Time
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#eab308" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#eab308" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                      dataKey="year"
                      stroke="#829ab1"
                      tick={{ fill: "#829ab1" }}
                      axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    />
                    <YAxis
                      stroke="#829ab1"
                      tick={{ fill: "#829ab1" }}
                      axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="netWorth"
                      stroke="#eab308"
                      strokeWidth={3}
                      fill="url(#netWorthGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Growth Rate */}
            <div className="bg-navy-900/60 backdrop-blur-sm border border-gold-500/20 rounded-2xl p-6 opacity-0 animate-fade-in-up stagger-3">
              <h3 className="text-xl font-display font-semibold text-white mb-6">
                Annual Growth Rate
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.slice(1)}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#047857" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                      dataKey="year"
                      stroke="#829ab1"
                      tick={{ fill: "#829ab1" }}
                      axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    />
                    <YAxis
                      stroke="#829ab1"
                      tick={{ fill: "#829ab1" }}
                      axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="growthPercentage"
                      fill="url(#barGradient)"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Combined Chart */}
            <div className="lg:col-span-2 bg-navy-900/60 backdrop-blur-sm border border-gold-500/20 rounded-2xl p-6 opacity-0 animate-fade-in-up stagger-4">
              <h3 className="text-xl font-display font-semibold text-white mb-6">
                Net Worth vs Growth Amount
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <defs>
                      <linearGradient id="growthAmountGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                      dataKey="year"
                      stroke="#829ab1"
                      tick={{ fill: "#829ab1" }}
                      axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="#829ab1"
                      tick={{ fill: "#829ab1" }}
                      axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#829ab1"
                      tick={{ fill: "#829ab1" }}
                      axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      yAxisId="right"
                      dataKey="growthAmount"
                      fill="url(#growthAmountGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="netWorth"
                      stroke="#eab308"
                      strokeWidth={3}
                      dot={{ fill: "#eab308", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: "#fde047" }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-8 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gold-500 rounded-full" />
                  <span className="text-navy-300 text-sm">Net Worth</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded" />
                  <span className="text-navy-300 text-sm">Growth Amount</span>
                </div>
              </div>
            </div>

            {/* Projection Chart */}
            <div className="lg:col-span-2 bg-gradient-to-br from-navy-900/80 to-emerald-900/20 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-6 opacity-0 animate-fade-in-up stagger-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Rocket className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-semibold text-white">
                      Net Worth & Growth Projection
                    </h3>
                    <p className="text-emerald-400/70 text-sm">
                      Based on {effectiveGrowthPercentage.toFixed(1)}% annual growth
                      {effectiveAnnualContribution > 0 && ` + ${formatCurrency(effectiveAnnualContribution)}/year`}
                    </p>
                  </div>
                </div>

                {/* Projection Controls */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-navy-400" />
                    <label className="text-navy-300 text-sm">Years:</label>
                    <select
                      value={projectionYears}
                      onChange={(e) => handleProjectionYearsChange(parseInt(e.target.value))}
                      className="bg-navy-800/50 border border-navy-600 rounded-lg px-3 py-1.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                    >
                      {[5, 10, 15, 20, 25, 30].map(y => (
                        <option key={y} value={y}>{y} years</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-navy-300 text-sm">Growth %:</label>
                    <input
                      type="number"
                      value={customGrowthPercentage ?? ""}
                      onChange={(e) => {
                        handleGrowthPercentageChange(e.target.value ? parseFloat(e.target.value) : null);
                      }}
                      placeholder={avgGrowthPercentage.toFixed(1)}
                      className="w-20 bg-navy-800/50 border border-navy-600 rounded-lg px-3 py-1.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                    />
                    {customGrowthPercentage !== null && (
                      <button
                        onClick={() => handleGrowthPercentageChange(null)}
                        className="text-navy-400 hover:text-white text-xs"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-navy-300 text-sm">Annual +$:</label>
                    <input
                      type="number"
                      value={annualContribution ?? ""}
                      onChange={(e) => {
                        handleAnnualContributionChange(e.target.value ? parseFloat(e.target.value) : null);
                      }}
                      placeholder="0"
                      className="w-24 bg-navy-800/50 border border-navy-600 rounded-lg px-3 py-1.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                    />
                    {annualContribution !== null && (
                      <button
                        onClick={() => handleAnnualContributionChange(null)}
                        className="text-navy-400 hover:text-white text-xs"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-navy-800/30 rounded-lg">
                    <span className="text-navy-400 text-sm">Last Year Growth:</span>
                    <span className="text-gold-400 font-semibold text-sm">{formatCurrency(lastYearGrowthAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Milestone Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-navy-800/40 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-navy-400 text-sm mb-1">Reach $5 Million</p>
                  {projectedMilestones.fiveMillion ? (
                    latestRecord && latestRecord.netWorth >= 5000000 ? (
                      <p className="text-emerald-400 font-display text-xl">✓ Already achieved!</p>
                    ) : (
                      <>
                        <p className="text-white font-display text-2xl">
                          {projectedMilestones.fiveMillion.year}
                        </p>
                        <p className="text-emerald-400 text-sm">
                          In {projectedMilestones.fiveMillion.years} years (age {projectedMilestones.fiveMillion.age})
                        </p>
                      </>
                    )
                  ) : (
                    <p className="text-navy-500">Not within projection period</p>
                  )}
                </div>
                <div className="bg-navy-800/40 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-navy-400 text-sm mb-1">Reach $10 Million</p>
                  {projectedMilestones.tenMillion ? (
                    latestRecord && latestRecord.netWorth >= 10000000 ? (
                      <p className="text-emerald-400 font-display text-xl">✓ Already achieved!</p>
                    ) : (
                      <>
                        <p className="text-white font-display text-2xl">
                          {projectedMilestones.tenMillion.year}
                        </p>
                        <p className="text-emerald-400 text-sm">
                          In {projectedMilestones.tenMillion.years} years (age {projectedMilestones.tenMillion.age})
                        </p>
                      </>
                    )
                  ) : (
                    <p className="text-navy-500">Not within projection period</p>
                  )}
                </div>
              </div>

              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={projectionData}>
                    <defs>
                      <linearGradient id="historicalBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      </linearGradient>
                      <linearGradient id="projectedBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                      dataKey="year"
                      stroke="#829ab1"
                      tick={{ fill: "#829ab1" }}
                      axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    />
                    <YAxis
                      stroke="#829ab1"
                      tick={{ fill: "#829ab1" }}
                      axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {/* Single unified bar with conditional coloring - same scale as net worth */}
                    <Bar
                      dataKey="combinedGrowthAmount"
                      radius={[4, 4, 0, 0]}
                      shape={(props: { x?: number; y?: number; width?: number; height?: number; payload?: { isProjected?: boolean } }) => {
                        const { x = 0, y = 0, width = 0, height = 0, payload } = props;
                        const isProjected = payload?.isProjected;
                        return (
                          <rect
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            fill={isProjected ? "url(#projectedBarGradient)" : "url(#historicalBarGradient)"}
                            rx={4}
                            ry={4}
                          />
                        );
                      }}
                    />
                    {/* Historical Net Worth Line */}
                    <Line
                      type="monotone"
                      dataKey="netWorth"
                      stroke="#eab308"
                      strokeWidth={3}
                      dot={{ fill: "#eab308", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: "#fde047" }}
                      connectNulls={false}
                    />
                    {/* Projected Net Worth Line */}
                    <Line
                      type="monotone"
                      dataKey="projectedNetWorth"
                      stroke="#10b981"
                      strokeWidth={3}
                      strokeDasharray="8 4"
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: "#34d399" }}
                      connectNulls
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-gold-500 rounded-full" />
                  <span className="text-navy-300 text-sm">Historical Net Worth</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-emerald-500 rounded-full" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #10b981 0, #10b981 4px, transparent 4px, transparent 6px)' }} />
                  <span className="text-navy-300 text-sm">Projected Net Worth</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded" />
                  <span className="text-navy-300 text-sm">Historical Growth</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-500 rounded" />
                  <span className="text-navy-300 text-sm">Projected Growth</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        {records.length > 0 && (
          <div className="opacity-0 animate-fade-in-up stagger-5">
            <DataTable records={records} onDelete={(id) => removeRecord({ id })} />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-navy-500 text-sm">
          <p>Built with Convex • Track your financial journey</p>
        </footer>
      </div>
    </div>
  );
}
