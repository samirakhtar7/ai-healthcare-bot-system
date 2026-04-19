import React, { useState } from "react";
import { analyzeImage } from "../../utils/mockAi";

export default function ImageAnalyzer() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    // Ask user to describe the image
    const description = prompt(
      "Please describe what this medical image shows (e.g., 'chest X-ray with white shadow in left lung'):",
    );
    if (!description) {
      setLoading(false);
      return;
    }
    const analysis = await analyzeImage(file, description);
    setResult(analysis);
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Medical Image Analysis (X-ray/MRI/CT)
      </h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-3"
      />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="max-h-64 rounded mb-3 border"
        />
      )}
      <button
        onClick={handleAnalyze}
        disabled={!file || loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
      >
        Analyze Image
      </button>

      {result && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <p>
            <strong>Findings:</strong> {result.findings}
          </p>
          <p>
            <strong>Confidence:</strong> {(result.confidence * 100).toFixed(0)}%
          </p>
          <p>
            <strong>Recommendation:</strong> {result.recommendations}
          </p>
          {result.flags.length > 0 && (
            <p className="text-red-600">⚠️ Flags: {result.flags.join(", ")}</p>
          )}
        </div>
      )}
    </div>
  );
}
