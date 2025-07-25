'use client';

import { Casestudy5 } from "./ui/casestudy-5";

export default function HeroContent() {
  const featuredFeature = {
    company: "PoT",
    tags: "HUMAN THINKING / AI COLLABORATION",
    title: "Ritual Animation for Thought Proofs",
    subtitle: "Elevate your thinking with cinematic animations.",
    image: "https://framerusercontent.com/images/97D9LMP4XZ7GcnNMEB1wIek.png",
  };

  const features = [
    {
      company: "Process",
      tags: "THINKING PROCESS / DOCUMENTATION",
      title: "Capture Your Thought Journey",
      subtitle: "Document every step of your creative thinking.",
    },
    {
      company: "Share",
      tags: "ELEGANT SHARING / SOCIAL MEDIA",
      title: "Share Your Thinking Beautifully",
      subtitle: "Generate elegant shareable content instantly.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4">
      <Casestudy5 featuredCasestudy={featuredFeature} casestudies={features} />
      <div className="text-center mt-12">
        <h2 className="text-3xl font-bold mb-6 text-white">
          Redefine the Value of<br></br>Human Thinking in the AI Era
        </h2>
        <p className="text-sm text-gray-200 mb-8 leading-relaxed">
          When AI can generate perfect answers, human thinking is more valuable than ever.
          Proof of Thought is not about proving the limitations of AI, but about showcasing the unique value of human thinking.
          Every share is a deep interpretation of "what it means to be human".
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg">
            Get Started
          </button>
        </div>
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-300 text-xs">
          "The value of humanity lies in bringing warmth to a cold universe, using our mortal flesh to write eternal stories."
        </p>
        <p className="text-gray-400 text-xs mt-2">— PoT Team</p>
      </div>
    </div>
  );
}
