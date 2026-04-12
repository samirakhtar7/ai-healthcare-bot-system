import React, { useState } from "react";
import { predictRisk } from "../../utils/mockAI";
import { Loader2, Heart, Brain, Droplet } from "lucide-react";

export default function RiskPredictor() {
  const [patientData, setPatientData] = useState({
    bmi: "",
    bpSystolic: "",
    age: "",
    smoker: false,
  });
  const [loading, setLoading] = useState(false);
  const [risks, setRisks] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!patientData.bmi || patientData.bmi < 10 || patientData.bmi > 50)
      newErrors.bmi = "BMI must be 10–50";
    if (
      !patientData.bpSystolic ||
      patientData.bpSystolic < 70 ||
      patientData.bpSystolic > 250
    )
      newErrors.bpSystolic = "BP must be 70–250 mmHg";
    if (!patientData.age || patientData.age < 0 || patientData.age > 120)
      newErrors.age = "Age must be 0–120";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const result = await predictRisk(patientData);
    setRisks(result);
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPatientData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            BMI
          </label>
          <input
            type="number"
            name="bmi"
            value={patientData.bmi}
            onChange={handleChange}
            placeholder="e.g., 24.5"
            className={`mt-1 w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.bmi ? "border-red-500" : "border-gray-300"} dark:bg-gray-800`}
          />
          {errors.bmi && (
            <p className="text-xs text-red-500 mt-1">{errors.bmi}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Systolic BP (mmHg)
          </label>
          <input
            type="number"
            name="bpSystolic"
            value={patientData.bpSystolic}
            onChange={handleChange}
            placeholder="e.g., 120"
            className={`mt-1 w-full p-3 border rounded-xl ${errors.bpSystolic ? "border-red-500" : "border-gray-300"} dark:bg-gray-800`}
          />
          {errors.bpSystolic && (
            <p className="text-xs text-red-500 mt-1">{errors.bpSystolic}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Age
          </label>
          <input
            type="number"
            name="age"
            value={patientData.age}
            onChange={handleChange}
            placeholder="e.g., 45"
            className={`mt-1 w-full p-3 border rounded-xl ${errors.age ? "border-red-500" : "border-gray-300"} dark:bg-gray-800`}
          />
          {errors.age && (
            <p className="text-xs text-red-500 mt-1">{errors.age}</p>
          )}
        </div>
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            name="smoker"
            checked={patientData.smoker}
            onChange={handleChange}
            className="rounded"
          />
          Smoker
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Predicting...
            </>
          ) : (
            "📊 Predict Risk"
          )}
        </button>
      </form>

      {loading && (
        <div className="space-y-3 animate-pulse">
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>
      )}

      {risks && !loading && (
        <div className="mt-6 space-y-4 animate-fade-in">
          {Object.entries(risks).map(([disease, data]) => (
            <div
              key={disease}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex justify-between items-center">
                <span className="capitalize font-bold text-lg flex items-center gap-2">
                  {disease === "heartDisease" && (
                    <Heart size={20} className="text-red-500" />
                  )}
                  {disease === "diabetes" && (
                    <Droplet size={20} className="text-blue-500" />
                  )}
                  {disease === "stroke" && (
                    <Brain size={20} className="text-purple-500" />
                  )}
                  {disease.replace(/([A-Z])/g, " $1")}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    data.risk === "High"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                      : data.risk === "Moderate"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                        : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                  }`}
                >
                  {data.risk} ({data.percentage}%)
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Factors: {data.factors.join(", ")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
