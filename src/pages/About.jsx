import React from "react";
import { Info, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <Info className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold">About AI HealthBot</h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          AI HealthBot is a student-built project providing AI-driven healthcare
          guidance, symptom analysis, and educational resources. Our goal is to
          make health information accessible and easy to understand.
        </p>
      </div>

      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-3">Mission</h2>
          <p className="text-gray-600">
            To combine AI research and practical design to help users make
            better health decisions and find care when needed.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-3">Team</h2>
          <p className="text-gray-600 mb-4">
            Built as a college project with a focus on privacy, usability, and
            reliable symptom guidance.
          </p>
          <ul className="list-disc list-inside text-gray-700">
            <li>Zaid Shaikh</li>
            <li>Samir Akhtar</li>
            <li>Aryaman</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default About;
