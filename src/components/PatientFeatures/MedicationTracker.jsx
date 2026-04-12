import React, { useState, useEffect } from "react";
import {
  Pill,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";
import {
  getMedications,
  saveMedications,
  markTaken,
} from "../../utils/patientUtils";

export default function MedicationTracker() {
  const [meds, setMeds] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newMed, setNewMed] = useState({
    name: "",
    dosage: "",
    frequency: "daily",
    time: "08:00",
  });

  useEffect(() => {
    setMeds(getMedications());
  }, []);

  const handleToggle = (id) => {
    const updated = markTaken(id, true);
    setMeds(updated);
    setTimeout(() => {
      const reset = updated.map((m) =>
        m.id === id ? { ...m, taken: false } : m,
      );
      saveMedications(reset);
      setMeds(reset);
    }, 86400000); // reset next day (demo: 24h)
  };

  const addMedication = () => {
    const newId = Date.now();
    const updated = [
      ...meds,
      { ...newMed, id: newId, taken: false, streak: 0 },
    ];
    saveMedications(updated);
    setMeds(updated);
    setShowAdd(false);
    setNewMed({ name: "", dosage: "", frequency: "daily", time: "08:00" });
  };

  const deleteMed = (id) => {
    const updated = meds.filter((m) => m.id !== id);
    saveMedications(updated);
    setMeds(updated);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Medication Schedule</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1 text-blue-600 text-sm"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      <div className="space-y-3">
        {meds.map((med) => (
          <div
            key={med.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex flex-wrap justify-between items-center gap-3"
          >
            <div className="flex-1">
              <div className="font-semibold flex items-center gap-2">
                <Pill size={16} className="text-blue-500" /> {med.name}{" "}
                {med.dosage}
              </div>
              <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                <Clock size={14} /> {med.time} · {med.frequency}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                Streak: {med.streak} days
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!med.taken ? (
                <button
                  onClick={() => handleToggle(med.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
                >
                  Take now
                </button>
              ) : (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle size={16} /> Taken
                </span>
              )}
              <button
                onClick={() => deleteMed(med.id)}
                className="text-red-500 p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {meds.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No medications added. Click + Add to start tracking.
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Add Medication</h3>
            <input
              type="text"
              placeholder="Name (e.g., Lisinopril)"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              className="w-full p-2 border rounded mb-2 dark:bg-gray-700"
            />
            <input
              type="text"
              placeholder="Dosage (e.g., 10mg)"
              value={newMed.dosage}
              onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
              className="w-full p-2 border rounded mb-2 dark:bg-gray-700"
            />
            <select
              value={newMed.frequency}
              onChange={(e) =>
                setNewMed({ ...newMed, frequency: e.target.value })
              }
              className="w-full p-2 border rounded mb-2 dark:bg-gray-700"
            >
              <option value="daily">Daily</option>
              <option value="twice daily">Twice daily</option>
              <option value="weekly">Weekly</option>
            </select>
            <input
              type="time"
              value={newMed.time}
              onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
              className="w-full p-2 border rounded mb-4 dark:bg-gray-700"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={addMedication}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
