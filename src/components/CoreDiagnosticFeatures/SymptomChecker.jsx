import React, { useState } from "react";
import { analyzeSymptoms } from "../../utils/mockAi";
import { AlertCircle, Loader2, Activity } from "lucide-react";

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!symptoms.trim()) newErrors.symptoms = "Symptoms are required";
    if (age && (age < 0 || age > 120)) newErrors.age = "Age must be 0–120";
    if (
      duration &&
      !/^\d+\s*(day|days|week|weeks|month|months)$/i.test(duration) &&
      !/^\d+$/.test(duration)
    ) {
      newErrors.duration = "Use format: 2 days, 1 week, etc.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const conditions = await analyzeSymptoms(symptoms, duration, age);
      setResults(conditions);
    } catch (err) {
      setErrors({ api: "AI service error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Symptoms <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g., cough, fever, headache (comma separated)"
            className={`mt-1 w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition dark:bg-gray-800 dark:border-gray-600 ${
              errors.symptoms ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.symptoms && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.symptoms}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Duration (optional)
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 3 days"
              className="mt-1 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
            />
            {errors.duration && (
              <p className="mt-1 text-xs text-red-500">{errors.duration}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Age (years)
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g., 35"
              className="mt-1 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
            />
            {errors.age && (
              <p className="mt-1 text-xs text-red-500">{errors.age}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Analyzing...
            </>
          ) : (
            "🔍 Check Symptoms"
          )}
        </button>
      </form>

      {/* Skeleton loading */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-28 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          <div className="h-28 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>
      )}

      {/* Results */}
      {results && !loading && (
        <div className="mt-6 space-y-4 animate-fade-in">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            📋 Possible Conditions
          </h3>
          {results.map((cond, idx) => (
            <div
              key={idx}
              className="border-l-4 border-blue-500 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-wrap justify-between items-start gap-2">
                <span className="font-bold text-lg">{cond.name}</span>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  Confidence: {(cond.probability * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                🚨 Urgency: {cond.urgency}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-200 mt-2">
                {cond.recommendation}
              </p>
            </div>
          ))}
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg text-xs text-yellow-800 dark:text-yellow-200">
            ⚠️ AI is not a doctor. This information is for educational purposes
            only. For serious symptoms, consult a healthcare professional
            immediately.
          </div>
        </div>
      )}
      {errors.api && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
          {errors.api}
        </div>
      )}
    </div>
  );
}
