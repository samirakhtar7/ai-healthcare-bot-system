import React, { useState, useEffect } from "react";
import { BookOpen, Send, TrendingUp, Clock } from "lucide-react";
import {
  analyzeJournalEntry,
  saveJournalEntry,
  getJournalHistory,
} from "../../utils/patientUtils";

export default function SymptomJournal() {
  const [entry, setEntry] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getJournalHistory());
  }, []);

  const handleSubmit = async () => {
    if (!entry.trim()) return;
    setLoading(true);
    const result = await analyzeJournalEntry(entry);
    setAnalysis(result);
    const newEntry = {
      text: entry,
      analysis: result,
      date: new Date().toISOString(),
    };
    const updated = saveJournalEntry(newEntry);
    setHistory(updated);
    setEntry("");
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
        <label className="block font-medium mb-2">
          How are you feeling today? (Describe symptoms, mood, triggers)
        </label>
        <textarea
          rows={4}
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="e.g., Woke up with a dull headache, felt dizzy after lunch, stress at work..."
          className="w-full p-3 border rounded-xl dark:bg-gray-700"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-3 px-5 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2"
        >
          <Send size={16} /> {loading ? "Analyzing..." : "Analyze Entry"}
        </button>
      </div>

      {analysis && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border-l-4 border-green-500">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp size={18} /> AI Analysis
          </h3>
          <p>
            <strong>Symptoms detected:</strong> {analysis.symptoms.join(", ")}
          </p>
          <p>
            <strong>Severity:</strong> {analysis.severity}
          </p>
          {analysis.possibleTriggers.length > 0 && (
            <p>
              <strong>Possible triggers:</strong>{" "}
              {analysis.possibleTriggers.join(", ")}
            </p>
          )}
          <p className="mt-2 text-sm">{analysis.recommendation}</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock size={18} /> Recent Journal History
          </h3>
          <div className="space-y-3 mt-3 max-h-64 overflow-y-auto">
            {history.slice(0, 5).map((h, i) => (
              <div key={i} className="border-b pb-2 text-sm">
                <div className="text-gray-500 text-xs">
                  {new Date(h.date).toLocaleDateString()}
                </div>
                <div>{h.text.substring(0, 100)}...</div>
                <div className="text-xs text-gray-400 mt-1">
                  Symptoms: {h.analysis.symptoms.join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
