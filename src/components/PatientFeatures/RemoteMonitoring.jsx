import React, { useState, useEffect } from "react";
import {
  Activity,
  Heart,
  Moon,
  Flame,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { fetchWearableData } from "../../utils/patientUtils";

export default function RemoteMonitoring() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const d = await fetchWearableData();
      setData(d);
      setLoading(false);
    };
    load();
    const interval = setInterval(load, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded-xl"></div>
        <div className="h-32 bg-gray-200 rounded-xl"></div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Activity className="text-green-500" />}
          title="Steps"
          value={data.steps.today.toLocaleString()}
          target={data.steps.goal}
          unit="steps"
          progress={(data.steps.today / data.steps.goal) * 100}
        />
        <MetricCard
          icon={<Heart className="text-red-500" />}
          title="Heart Rate"
          value={data.heartRate.current}
          unit="bpm"
          subtitle={`Resting: ${data.heartRate.resting}`}
        />
        <MetricCard
          icon={<Moon className="text-indigo-500" />}
          title="Sleep"
          value={data.sleep.hours}
          unit="hrs"
          subtitle={`Deep: ${data.sleep.deep}h · REM: ${data.sleep.rem}h`}
        />
        <MetricCard
          icon={<Flame className="text-orange-500" />}
          title="Calories"
          value={data.calories.burned}
          unit="burned"
          subtitle={`Consumed: ${data.calories.consumed}`}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold mb-3">Weekly Trend</h3>
        <div className="flex justify-between items-end h-32 gap-2">
          {data.steps.history.map((step, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-t-lg"
                style={{ height: `${(step / 10000) * 100}%` }}
              ></div>
              <span className="text-xs mt-1">
                {["M", "T", "W", "T", "F", "S", "S"][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const MetricCard = ({
  icon,
  title,
  value,
  target,
  unit,
  subtitle,
  progress,
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">
          {value} <span className="text-sm font-normal">{unit}</span>
        </p>
      </div>
      <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
        {icon}
      </div>
    </div>
    {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
    {progress && (
      <div className="mt-2 h-1.5 bg-gray-200 rounded-full">
        <div
          className="h-1.5 bg-green-500 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    )}
    {target && (
      <p className="text-xs text-gray-400 mt-1">
        Goal: {target.toLocaleString()} steps
      </p>
    )}
  </div>
);
