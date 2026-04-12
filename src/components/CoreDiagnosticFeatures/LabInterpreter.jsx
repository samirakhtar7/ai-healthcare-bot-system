import React, { useState } from "react";
import { interpretLab } from "../../utils/mockAI";
import { Loader2, Plus, Trash2 } from "lucide-react";

export default function LabInterpreter() {
  const [labInputs, setLabInputs] = useState([
    {
      name: "WBC",
      value: "",
      unit: "K/uL",
      referenceRange: { min: 4, max: 11 },
    },
  ]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const addTest = () =>
    setLabInputs([
      ...labInputs,
      { name: "", value: "", unit: "", referenceRange: { min: 0, max: 0 } },
    ]);
  const removeTest = (idx) =>
    setLabInputs(labInputs.filter((_, i) => i !== idx));

  const handleChange = (idx, field, val) => {
    const updated = [...labInputs];
    if (field === "min" || field === "max")
      updated[idx].referenceRange[field] = parseFloat(val);
    else updated[idx][field] = val;
    setLabInputs(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const parsed = labInputs.map((t) => ({ ...t, value: parseFloat(t.value) }));
    const interpreted = await interpretLab(parsed);
    setResults(interpreted);
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="p-2 text-left">Test</th>
              <th>Value</th>
              <th>Unit</th>
              <th>Ref Min</th>
              <th>Ref Max</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {labInputs.map((test, idx) => (
              <tr key={idx} className="border-b dark:border-gray-700">
                <td>
                  <input
                    value={test.name}
                    onChange={(e) => handleChange(idx, "name", e.target.value)}
                    className="w-24 p-1 border rounded dark:bg-gray-800"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={test.value}
                    onChange={(e) => handleChange(idx, "value", e.target.value)}
                    className="w-20 p-1 border rounded dark:bg-gray-800"
                  />
                </td>
                <td>
                  <input
                    value={test.unit}
                    onChange={(e) => handleChange(idx, "unit", e.target.value)}
                    className="w-20 p-1 border rounded dark:bg-gray-800"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={test.referenceRange.min}
                    onChange={(e) => handleChange(idx, "min", e.target.value)}
                    className="w-16 p-1 border rounded dark:bg-gray-800"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={test.referenceRange.max}
                    onChange={(e) => handleChange(idx, "max", e.target.value)}
                    className="w-16 p-1 border rounded dark:bg-gray-800"
                  />
                </td>
                <td>
                  <button
                    onClick={() => removeTest(idx)}
                    className="text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-3">
        <button
          onClick={addTest}
          className="flex items-center gap-1 text-blue-600 text-sm"
        >
          <Plus size={16} /> Add test
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-5 py-2 bg-blue-600 text-white rounded-xl shadow disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            "Interpret Labs"
          )}
        </button>
      </div>

      {loading && (
        <div className="space-y-2 animate-pulse">
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      )}

      {results && !loading && (
        <div className="mt-5 space-y-3">
          {results.map((r, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border-l-4 ${r.flag === "High" ? "border-red-500 bg-red-50 dark:bg-red-900/20" : r.flag === "Low" ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20" : "border-green-500 bg-green-50 dark:bg-green-900/20"}`}
            >
              <div className="font-bold">{r.name}</div>
              <div>
                {r.value} {r.unit} (ref: {r.referenceRange.min}-
                {r.referenceRange.max}) –{" "}
                <span className="font-medium">{r.flag}</span>
              </div>
              <p className="text-sm mt-1">{r.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
