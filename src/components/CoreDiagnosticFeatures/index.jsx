import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SymptomChecker from "./SymptomChecker";
import RiskPredictor from "./RiskPredictor";
import ImageAnalyzer from "./ImageAnalyzer";
import LabInterpreter from "./LabInterpreter";
import MedicationChecker from "./MedicationChecker";

const tabs = [
  { id: "symptoms", label: "🩺 Symptom Checker", component: SymptomChecker },
  { id: "risk", label: "📊 Risk Predictor", component: RiskPredictor },
  { id: "image", label: "🖼️ Image Analyzer", component: ImageAnalyzer },
  { id: "lab", label: "🔬 Lab Interpreter", component: LabInterpreter },
  { id: "meds", label: "💊 Medication Checker", component: MedicationChecker },
];

export default function CoreDiagnosticFeatures() {
  const [activeTab, setActiveTab] = useState("symptoms");
  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Core Diagnostic & Predictive Features
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          AI‑powered clinical decision support tools
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-all ${
              activeTab === tab.id
                ? "bg-white dark:bg-gray-800 text-blue-600 border-b-2 border-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 md:p-6"
        >
          {ActiveComponent && <ActiveComponent />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
