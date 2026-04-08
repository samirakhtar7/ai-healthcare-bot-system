import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext.jsx";
import Chatbot from "../components/Chatbot";
import {
  Activity,
  Heart,
  Calendar,
  FileText,
  TrendingUp,
  Smile,
  Droplet,
  Moon,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [healthStats, setHealthStats] = useState({
    steps: 7842,
    heartRate: 72,
    sleep: 7.5,
    water: 4,
    mood: "Good",
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHealthStats((prev) => ({
        ...prev,
        heartRate: 70 + Math.floor(Math.random() * 10),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chatbot Section */}
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

        {/* Health Insights & Recent Activity */}
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

          <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
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

const StatCard = ({ icon, title, value, change, trend }) => {
  return (
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
};

export default Dashboard;
