import { getHealthAIResponse } from "../services/gemini"; // corrected path to gemini service

// Helper to clean JSON from AI response
function extractJSON(text) {
  try {
    // Find JSON block between ```json ... ``` or just first { ... }
    const jsonMatch =
      text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/(\{[\s\S]*\})/);
    if (jsonMatch) return JSON.parse(jsonMatch[1]);
  } catch (e) {}
  return null;
}

// 1. Symptom Checker
export async function analyzeSymptoms(symptoms, duration, age) {
  const prompt = `You are a medical AI. Given symptoms: "${symptoms}", duration: "${duration}", age: ${age}. 
Return a JSON array of possible conditions, each with: name (string), probability (float 0-1), urgency (string), recommendation (string). 
Example: [{"name":"Common Cold","probability":0.65,"urgency":"Self-care","recommendation":"Rest, fluids."}]
Only return valid JSON, no extra text.`;

  const response = await getHealthAIResponse(prompt);
  const parsed = extractJSON(response);
  if (parsed && Array.isArray(parsed)) return parsed;
  // Fallback if parsing fails
  return [
    {
      name: "Unable to analyze",
      probability: 0,
      urgency: "Consult a doctor",
      recommendation:
        "AI could not process this query. Please try again or see a healthcare provider.",
    },
  ];
}

// 2. Risk Predictor
export async function predictRisk(patientData) {
  const { bmi, bpSystolic, age, smoker } = patientData;
  const prompt = `You are a clinical risk calculator. Patient: BMI=${bmi}, Systolic BP=${bpSystolic}, Age=${age}, Smoker=${smoker}.
Return JSON only: {"diabetes":{"risk":"Low/Moderate/High","percentage":integer,"factors":["string"]},"heartDisease":{...},"stroke":{...}}
Use realistic percentages. Do not add extra text.`;

  const response = await getHealthAIResponse(prompt);
  const parsed = extractJSON(response);
  if (parsed && parsed.diabetes && parsed.heartDisease && parsed.stroke)
    return parsed;
  // Fallback
  return {
    diabetes: {
      risk: "Moderate",
      percentage: 25,
      factors: ["Unable to compute"],
    },
    heartDisease: {
      risk: "Moderate",
      percentage: 20,
      factors: ["Unable to compute"],
    },
    stroke: { risk: "Low", percentage: 10, factors: ["Unable to compute"] },
  };
}

// 3. Image Analyzer (Gemini 1.5 Pro can handle images, but your getHealthAIResponse is text-only)
// We'll simulate by asking the user to describe the image (or you can upgrade to multimodal)
export async function analyzeImage(imageFile, imageDescription = "") {
  if (!imageDescription) {
    return {
      findings:
        "Image analysis requires a description. Please describe what the X-ray/MRI shows.",
      confidence: 0,
      recommendations: "Upload a clear image and provide a brief description.",
      flags: [],
    };
  }
  const prompt = `You are a radiologist AI. The user describes a medical image: "${imageDescription}".
Return JSON: {"findings":"string","confidence":float 0-1,"recommendations":"string","flags":["string"]}
Only valid JSON.`;

  const response = await getHealthAIResponse(prompt);
  const parsed = extractJSON(response);
  if (parsed && parsed.findings) return parsed;
  return {
    findings: "Could not interpret image.",
    confidence: 0,
    recommendations: "Consult a radiologist.",
    flags: [],
  };
}

// 4. Lab Interpreter
export async function interpretLab(labData) {
  const labText = labData
    .map(
      (t) =>
        `${t.name}: ${t.value} ${t.unit} (ref ${t.referenceRange.min}-${t.referenceRange.max})`,
    )
    .join("\n");
  const prompt = `You are a lab result interpreter. Given these results:
${labText}
Return a JSON array where each object has: name, value, unit, referenceRange (object with min,max), flag ("High"/"Low"/"Normal"), explanation (string).
Example: [{"name":"WBC","value":12.5,"unit":"K/uL","referenceRange":{"min":4,"max":11},"flag":"High","explanation":"Possible infection."}]
Only valid JSON.`;

  const response = await getHealthAIResponse(prompt);
  const parsed = extractJSON(response);
  if (parsed && Array.isArray(parsed)) return parsed;
  return labData.map((t) => ({
    ...t,
    flag: "Unknown",
    explanation: "AI could not interpret. Please consult a doctor.",
  }));
}

// 5. Medication Interaction Checker
export async function checkInteractions(medications) {
  const medList = medications.join(", ");
  const prompt = `You are a pharmacology AI. Check interactions for: ${medList}.
Return a JSON array of interactions. Each object: {"severity":"Major/Moderate/Minor","description":"string"}
If none, return empty array []. Only valid JSON.`;

  const response = await getHealthAIResponse(prompt);
  const parsed = extractJSON(response);
  if (parsed && Array.isArray(parsed)) return parsed;
  return [
    {
      severity: "Unknown",
      description: "Unable to check interactions. Please consult a pharmacist.",
    },
  ];
}
