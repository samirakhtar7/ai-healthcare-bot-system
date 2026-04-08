import React from "react";
import {
  CheckCircle,
  MessageCircle,
  BarChart,
  Lock,
  Bell,
  FileText,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <MessageCircle />,
      title: "Intelligent Chatbot",
      desc: "Get instant answers to health queries with our AI-powered conversational agent.",
    },
    {
      icon: <BarChart />,
      title: "Health Tracking",
      desc: "Log symptoms, medications, and vitals to see patterns over time.",
    },
    {
      icon: <Lock />,
      title: "Secure & Private",
      desc: "End-to-end encryption ensures your health data remains confidential.",
    },
    {
      icon: <Bell />,
      title: "Reminders",
      desc: "Set medication reminders and appointment alerts.",
    },
    {
      icon: <FileText />,
      title: "Health Reports",
      desc: "Generate summaries of your health history for doctor visits.",
    },
    {
      icon: <CheckCircle />,
      title: "Verified Information",
      desc: "AI responses based on trusted medical sources.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Powerful Features
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Everything you need to manage your health effectively
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-slide-up"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="bg-linear-to-r from-blue-600 to-purple-600 w-14 h-14 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Ready to get started?</h2>
        <p className="mb-4">
          Join thousands of users who trust AI HealthBot for their health
          queries.
        </p>
        <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:shadow-lg transition">
          Try It Free
        </button>
      </div>
    </div>
  );
};

export default Features;
