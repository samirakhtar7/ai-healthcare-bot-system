import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext.jsx";
import Chatbot from "../components/Chatbot";
import Sidebar from "../components/sidebar";
// Import each diagnostic component separately (or keep the tabs wrapper)
import SymptomChecker from "../components/CoreDiagnosticFeatures/SymptomChecker";
import RiskPredictor from "../components/CoreDiagnosticFeatures/RiskPredictor";
import ImageAnalyzer from "../components/CoreDiagnosticFeatures/ImageAnalyzer";
import LabInterpreter from "../components/CoreDiagnosticFeatures/LabInterpreter";
import MedicationChecker from "../components/CoreDiagnosticFeatures/MedicationChecker";
import RemoteMonitoring from "../components/PatientFeatures/RemoteMonitoring";
import MedicationTracker from "../components/PatientFeatures/MedicationTracker";
import HealthCoach from "../components/PatientFeatures/HealthCoach";
import SymptomJournal from "../components/PatientFeatures/SymptomJournal";
import {
  Activity,
  Heart,
  Calendar,
  FileText,
  TrendingUp,
  Smile,
  Droplet,
  Menu,
  Moon,
  X,
  LayoutDashboard,
  MessageSquare,
  Stethoscope,
  Scan,
  Microscope,
  Pill,
  MonitorSmartphone,
  Pill as PillIcon,
  Apple,
  BookOpen,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [healthStats, setHealthStats] = useState({
    steps: 7842,
    heartRate: 72,
    sleep: 7.5,
    water: 4,
    mood: "Good",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setHealthStats((prev) => ({
        ...prev,
        heartRate: 70 + Math.floor(Math.random() * 10),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Navigation items
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { id: "chatbot", label: "AI Chatbot", icon: <MessageSquare size={20} /> },
    {
      id: "symptoms",
      label: "Symptom Checker",
      icon: <Stethoscope size={20} />,
    },
    { id: "risk", label: "Risk Predictor", icon: <Activity size={20} /> },
    { id: "image", label: "Image Analyzer", icon: <Scan size={20} /> },
    { id: "lab", label: "Lab Interpreter", icon: <Microscope size={20} /> },
    { id: "meds", label: "Medication Checker", icon: <Pill size={20} /> },
    {
      id: "monitoring",
      label: "Remote Monitoring",
      icon: <MonitorSmartphone size={20} />,
    },
    {
      id: "medtracker",
      label: "Medication Tracker",
      icon: <PillIcon size={20} />,
    },
    { id: "coach", label: "Health Coach", icon: <Apple size={20} /> },
    { id: "journal", label: "Symptom Journal", icon: <BookOpen size={20} /> },
  ];

  // Render content based on activeView
  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <DashboardHome
            healthStats={healthStats}
            user={user}
            onNavigate={(view) => setActiveView(view)}
          />
        );
      case "chatbot":
        return <ChatbotFull />;
      case "symptoms":
        return (
          <FeatureWrapper
            title="Symptom Checker & Triage"
            onBack={() => setActiveView("dashboard")}
          >
            <SymptomChecker />


            
          </FeatureWrapper>
        );
      case "risk":
        return (
          <FeatureWrapper
            title="Chronic Disease Risk Predictor"
            onBack={() => setActiveView("dashboard")}
          >
            <RiskPredictor />
          </FeatureWrapper>
        );
      case "image":
        return (
          <FeatureWrapper
            title="Medical Image Analyzer"
            onBack={() => setActiveView("dashboard")}
          >
            <ImageAnalyzer />
          </FeatureWrapper>
        );
      case "lab":
        return (
          <FeatureWrapper
            title="Lab Result Interpreter"
            onBack={() => setActiveView("dashboard")}
          >
            <LabInterpreter />
          </FeatureWrapper>
        );
      case "meds":
        return (
          <FeatureWrapper
            title="Medication Interaction Checker"
            onBack={() => setActiveView("dashboard")}
          >
            <MedicationChecker />
          </FeatureWrapper>
        );
      case "monitoring":
        return (
          <FeatureWrapper title="Remote Patient Monitoring">
            <RemoteMonitoring />
          </FeatureWrapper>
        );
      case "medtracker":
        return (
          <FeatureWrapper title="Medication Adherence Tracker">
            <MedicationTracker />
          </FeatureWrapper>
        );
      case "coach":
        return (
          <FeatureWrapper title="Personalized Health Coach">
            <HealthCoach />
          </FeatureWrapper>
        );
      case "journal":
        return (
          <FeatureWrapper title="Symptom Journal with AI Analysis">
            <SymptomJournal />
          </FeatureWrapper>
        );
      default:
        return <DashboardHome healthStats={healthStats} user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        navItems={navItems}
        activeView={activeView}
        setActiveView={setActiveView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile header with menu button */}
        <div className="lg:hidden sticky top-0 bg-white shadow-sm p-4 flex items-center gap-3 z-10">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold">
            {navItems.find((i) => i.id === activeView)?.label || "Dashboard"}
          </h1>
        </div>
        <div className="p-4 md:p-6">{renderContent()}</div>
      </main>
    </div>
  );
};

// Dashboard Home Component (your original dashboard content)
const DashboardHome = ({ healthStats, user, onNavigate }) => {
  return (
    <div>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's your health overview for today
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Heart className="text-red-500" />}
          title="Heart Rate"
          value={`${healthStats.heartRate} bpm`}
          change="-2"
          trend="down"
        />
        <StatCard
          icon={<Activity className="text-green-500" />}
          title="Steps"
          value={healthStats.steps.toLocaleString()}
          change="+432"
          trend="up"
        />
        <StatCard
          icon={<Moon className="text-indigo-500" />}
          title="Sleep"
          value={`${healthStats.sleep} hrs`}
          change="+0.5"
          trend="up"
        />
        <StatCard
          icon={<Droplet className="text-blue-500" />}
          title="Water Intake"
          value={`${healthStats.water} cups`}
          change="+1"
          trend="up"
        />
      </div>

      {/* Quick Tools */}
      <div className="mt-6 mb-8">
        <h3 className="text-lg font-semibold mb-3">Quick Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <button
            onClick={() => onNavigate && onNavigate("symptoms")}
            className="p-4 bg-white rounded-lg shadow hover:shadow-lg text-left transition flex flex-col"
          >
            <span className="text-2xl">🩺</span>
            <span className="font-medium mt-2">Symptom Checker</span>
            <span className="text-xs text-gray-500 mt-1">
              Triage & recommendations
            </span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate("risk")}
            className="p-4 bg-white rounded-lg shadow hover:shadow-lg text-left transition flex flex-col"
          >
            <span className="text-2xl">📊</span>
            <span className="font-medium mt-2">Risk Predictor</span>
            <span className="text-xs text-gray-500 mt-1">
              Chronic disease risk
            </span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate("image")}
            className="p-4 bg-white rounded-lg shadow hover:shadow-lg text-left transition flex flex-col"
          >
            <span className="text-2xl">🖼️</span>
            <span className="font-medium mt-2">Image Analyzer</span>
            <span className="text-xs text-gray-500 mt-1">
              X-ray / MRI helper
            </span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate("lab")}
            className="p-4 bg-white rounded-lg shadow hover:shadow-lg text-left transition flex flex-col"
          >
            <span className="text-2xl">🔬</span>
            <span className="font-medium mt-2">Lab Interpreter</span>
            <span className="text-xs text-gray-500 mt-1">Explain results</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate("meds")}
            className="p-4 bg-white rounded-lg shadow hover:shadow-lg text-left transition flex flex-col"
          >
            <span className="text-2xl">💊</span>
            <span className="font-medium mt-2">Medication Checker</span>
            <span className="text-xs text-gray-500 mt-1">Interactions</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chatbot preview */}
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Smile className="h-5 w-5 mr-2 text-blue-600" />
              AI Health Assistant
            </h2>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Online 24/7
            </span>
          </div>
          <Chatbot />
        </div>

        {/* Health Insights & Reminders */}
        <div className="space-y-6 animate-slide-up">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
              Health Insights
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex justify-between items-center border-b pb-2">
                <span>Heart rate is within normal range</span>
                <span className="text-green-600 text-sm">✅ Normal</span>
              </li>
              <li className="flex justify-between items-center border-b pb-2">
                <span>Step count goal: 10,000 steps</span>
                <span className="text-blue-600 text-sm">78% completed</span>
              </li>
              <li className="flex justify-between items-center border-b pb-2">
                <span>Sleep consistency improving</span>
                <span className="text-green-600 text-sm">📈 +5%</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Mood tracker: Feeling {healthStats.mood}</span>
                <span className="text-yellow-600 text-sm">😊 Great</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Upcoming Reminders
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                <div>
                  <p className="font-medium">Take Medication</p>
                  <p className="text-xs text-gray-500">Vitamin D - 10:00 AM</p>
                </div>
                <button className="text-sm text-blue-600">Remind me</button>
              </div>
              <div className="flex items-center justify-between bg-purple-50 p-3 rounded-lg">
                <div>
                  <p className="font-medium">Doctor Appointment</p>
                  <p className="text-xs text-gray-500">
                    Dr. Smith - Tomorrow 2:30 PM
                  </p>
                </div>
                <button className="text-sm text-purple-600">
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-lg">Health Report</h4>
                <p className="text-sm opacity-90">
                  Download your weekly summary
                </p>
              </div>
              <FileText className="h-10 w-10 opacity-80" />
            </div>
            <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-md transition">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, change, trend }) => (
  <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md hover:shadow-lg transition-smooth">
    <div className="flex items-center justify-between mb-3">
      <div className="text-gray-500 text-sm font-medium">{title}</div>
      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
        {icon}
      </div>
    </div>
    <div className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
      {value}
    </div>
    <div
      className={`text-xs md:text-sm mt-2 ${trend === "up" ? "text-green-500" : "text-red-500"}`}
    >
      {change} from yesterday
    </div>
  </div>
);

// Wrapper for each diagnostic feature to give consistent title & spacing
const FeatureWrapper = ({ title, children, onBack }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            ← Back
          </button>
        )}
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>
    </div>
    <div className="bg-white rounded-xl shadow-sm p-6">{children}</div>
  </div>
);

// Full-page chatbot (so it's not inside a small preview card)
const ChatbotFull = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-4">
      AI Health Assistant
    </h2>
    <div className="bg-white rounded-xl shadow-sm h-[70vh]">
      <Chatbot />
    </div>
  </div>
);

export default Dashboard;
