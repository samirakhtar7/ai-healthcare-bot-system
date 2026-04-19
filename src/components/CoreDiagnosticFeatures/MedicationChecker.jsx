import React, { useState } from "react";
import { checkInteractions } from "../../utils/mockAi";
import { Loader2, AlertTriangle, Info } from "lucide-react";

export default function MedicationChecker() {
  const [medications, setMedications] = useState([]);
  const [currentMed, setCurrentMed] = useState("");
  const [interactions, setInteractions] = useState(null);
  const [loading, setLoading] = useState(false);

  const addMedication = () => {
    if (currentMed.trim() && !medications.includes(currentMed.trim())) {
      setMedications([...medications, currentMed.trim()]);
      setCurrentMed("");
    }
  };

  const removeMed = (med) =>
    setMedications(medications.filter((m) => m !== med));

  const handleCheck = async () => {
    if (medications.length < 2) return;
    setLoading(true);
    const result = await checkInteractions(medications);
    setInteractions(result);
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <input
          value={currentMed}
          onChange={(e) => setCurrentMed(e.target.value)}
          placeholder="e.g., Warfarin, Lisinopril"
          className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
          onKeyPress={(e) => e.key === "Enter" && addMedication()}
        />
        <button
          onClick={addMedication}
          className="px-5 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {medications.map((med) => (
          <span
            key={med}
            className="bg-blue-100 dark:bg-blue-900/50 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
          >
            {med}
            <button
              onClick={() => removeMed(med)}
              className="text-red-500 font-bold"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <button
        onClick={handleCheck}
        disabled={medications.length < 2 || loading}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={18} /> Checking...
          </>
        ) : (
          "💊 Check Interactions"
        )}
      </button>

      {loading && (
        <div className="animate-pulse h-24 bg-gray-200 rounded-xl"></div>
      )}

      {interactions && !loading && (
        <div className="mt-5 space-y-3">
          {interactions.length === 0 ? (
            <div className="p-4 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-xl flex items-center gap-2">
              <Info size={20} /> No known interactions between these
              medications.
            </div>
          ) : (
            interactions.map((int, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border-l-4 ${int.severity === "Major" ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"}`}
              >
                <div className="font-bold flex items-center gap-2">
                  <AlertTriangle size={16} /> {int.severity} interaction
                </div>
                <p className="text-sm mt-1">{int.description}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
