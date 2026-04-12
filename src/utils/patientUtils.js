// Mock AI functions for patient features
import { getHealthAIResponse } from "../services/gemini";

// Simulate fetching wearable data (replace with real API later)
export const fetchWearableData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    steps: {
      today: 7842,
      goal: 10000,
      history: [7200, 8100, 7650, 7842, 8020, 7900, 8150],
    },
    heartRate: {
      current: 72,
      resting: 68,
      history: [70, 72, 71, 73, 72, 74, 72],
    },
    sleep: {
      hours: 7.5,
      deep: 2.1,
      rem: 1.8,
      history: [7.2, 7.8, 7.5, 7.3, 7.6, 7.4, 7.5],
    },
    calories: { burned: 2100, consumed: 1950 },
  };
};

// Medication adherence (stored in localStorage for demo)
export const getMedications = () => {
  const stored = localStorage.getItem("medications");
  return stored
    ? JSON.parse(stored)
    : [
        {
          id: 1,
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "daily",
          time: "08:00",
          taken: false,
          streak: 5,
        },
        {
          id: 2,
          name: "Metformin",
          dosage: "500mg",
          frequency: "twice daily",
          time: "08:00,20:00",
          taken: false,
          streak: 3,
        },
      ];
};

export const saveMedications = (meds) =>
  localStorage.setItem("medications", JSON.stringify(meds));

export const markTaken = (id, taken) => {
  const meds = getMedications();
  const updated = meds.map((m) =>
    m.id === id ? { ...m, taken, streak: taken ? m.streak + 1 : 0 } : m,
  );
  saveMedications(updated);
  return updated;
};

// AI Health Coach
export const getDailyTip = async (userData) => {
  const prompt = `You are a health coach. Based on user data: steps ${userData.steps}, sleep ${userData.sleep}h, heart rate ${userData.heartRate}. Give a short, personalized health tip (1 sentence).`;
  const response = await getHealthAIResponse(prompt);
  return response || "Take a 10-minute walk after lunch to boost energy.";
};

export const generateMealPlan = async (preferences) => {
  const prompt = `Suggest a simple 1-day meal plan for someone who ${preferences}. Return as JSON: { breakfast, lunch, dinner, snack }`;
  const response = await getHealthAIResponse(prompt);
  try {
    return JSON.parse(response);
  } catch {
    return {
      breakfast: "Oatmeal with berries",
      lunch: "Grilled chicken salad",
      dinner: "Salmon with quinoa",
      snack: "Greek yogurt",
    };
  }
};

// Symptom Journal
export const analyzeJournalEntry = async (entryText) => {
  const prompt = `Extract symptoms from this text: "${entryText}". Return JSON: { symptoms: ["symptom1","symptom2"], severity: "mild/moderate/severe", possibleTriggers: ["trigger1"], recommendation: "short advice" }`;
  const response = await getHealthAIResponse(prompt);
  try {
    return JSON.parse(response);
  } catch {
    return {
      symptoms: ["unknown"],
      severity: "moderate",
      possibleTriggers: [],
      recommendation: "Monitor symptoms and consult a doctor if persistent.",
    };
  }
};

export const saveJournalEntry = (entry) => {
  const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
  entries.unshift({ ...entry, timestamp: new Date().toISOString() });
  localStorage.setItem("journalEntries", JSON.stringify(entries.slice(0, 30))); // keep last 30
  return entries;
};

export const getJournalHistory = () =>
  JSON.parse(localStorage.getItem("journalEntries") || "[]");
