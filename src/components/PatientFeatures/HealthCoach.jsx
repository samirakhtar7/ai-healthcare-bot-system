import React, { useState, useEffect } from "react";
import { Sparkles, Apple, Activity, Sun } from "lucide-react";
import {
  getDailyTip,
  generateMealPlan,
  fetchWearableData,
} from "../../utils/patientUtils";

export default function HealthCoach() {
  const [tip, setTip] = useState("");
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTip = async () => {
      const data = await fetchWearableData();
      const newTip = await getDailyTip({
        steps: data.steps.today,
        sleep: data.sleep.hours,
        heartRate: data.heartRate.current,
      });
      setTip(newTip);
    };
    loadTip();
  }, []);

  const handleMealPlan = async () => {
    setLoading(true);
    const plan = await generateMealPlan("prefers low-carb, no seafood");
    setMealPlan(plan);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-5 border border-green-100 dark:border-green-800">
        <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
          <Sparkles size={20} /> Daily Wellness Tip
        </div>
        <p className="text-gray-800 dark:text-gray-200 mt-2 text-lg font-medium">
          {tip || "Loading your personalized tip..."}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold flex items-center gap-2">
          <Apple size={18} /> AI Meal Plan Generator
        </h3>
        <button
          onClick={handleMealPlan}
          disabled={loading}
          className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate 1-Day Healthy Meal Plan"}
        </button>
        {mealPlan && (
          <div className="mt-4 space-y-2 text-sm">
            <p>
              <strong>Breakfast:</strong> {mealPlan.breakfast}
            </p>
            <p>
              <strong>Lunch:</strong> {mealPlan.lunch}
            </p>
            <p>
              <strong>Dinner:</strong> {mealPlan.dinner}
            </p>
            <p>
              <strong>Snack:</strong> {mealPlan.snack}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SuggestionCard
          icon={<Activity />}
          title="Movement"
          text="Try 5 minutes of stretching every hour"
        />
        <SuggestionCard
          icon={<Sun />}
          title="Hydration"
          text="Drink a glass of water right after waking up"
        />
      </div>
    </div>
  );
}

const SuggestionCard = ({ icon, title, text }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex items-start gap-3">
    <div className="text-blue-500">{icon}</div>
    <div>
      <div className="font-medium">{title}</div>
      <div className="text-sm text-gray-500">{text}</div>
    </div>
  </div>
);
