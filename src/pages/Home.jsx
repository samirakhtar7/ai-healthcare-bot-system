import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Shield,
  Clock,
  Users,
  ArrowRight,
  Bot,
  Activity,
} from "lucide-react";

const Home = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <div className="animate-fade-in">
            <div className="inline-flex items-center bg-blue-100 rounded-full px-4 py-1 mb-6">
              <Heart className="h-4 w-4 text-blue-600 mr-2 animate-pulse" />
              <span className="text-sm text-blue-600 font-medium">
                AI-Powered Healthcare
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Health, Our AI Intelligence
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Get instant medical insights, symptom analysis, and health
              recommendations powered by advanced artificial intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-smooth flex items-center justify-center group"
              >
                Start Free Consultation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition" />
              </Link>
              <Link
                to="/features"
                className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-full font-semibold hover:border-blue-600 hover:text-blue-600 transition-smooth"
              >
                Explore Features
              </Link>
            </div>
          </div>

          {/* Floating elements */}
          <div className="absolute top-20 left-10 animate-float">
            <Bot className="h-12 w-12 text-blue-400 opacity-40" />
          </div>
          <div className="absolute bottom-20 right-10 animate-float delay-1000">
            <Activity className="h-16 w-16 text-purple-400 opacity-40" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose AI HealthBot?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Advanced features designed to provide accurate and timely health
              assistance.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Bot className="h-10 w-10" />,
                title: "24/7 AI Assistant",
                desc: "Round-the-clock health support and guidance.",
              },
              {
                icon: <Shield className="h-10 w-10" />,
                title: "Privacy First",
                desc: "Your data is encrypted and never shared.",
              },
              {
                icon: <Clock className="h-10 w-10" />,
                title: "Instant Response",
                desc: "Get answers to your health queries in seconds.",
              },
              {
                icon: <Users className="h-10 w-10" />,
                title: "Trusted by Thousands",
                desc: "Join our community of satisfied users.",
              },
              {
                icon: <Heart className="h-10 w-10" />,
                title: "Holistic Care",
                desc: "Physical and mental wellness support.",
              },
              {
                icon: <Activity className="h-10 w-10" />,
                title: "Symptom Tracking",
                desc: "Monitor your health over time.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group p-6 bg-linear-to-br from-gray-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-center"
              >
                <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
