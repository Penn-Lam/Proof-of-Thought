'use client';

import { Casestudy5 } from "./ui/casestudy-5";
import { motion } from "framer-motion";

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
      <div id="features">
        <Casestudy5 featuredCasestudy={featuredFeature} casestudies={features} />
      </div>
      <div id="about" className="text-center mt-12">
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

      {/* AI Manners Dialog */}
      <div className="mt-16 max-w-4xl mx-auto px-4">
        <motion.h3 
          className="text-3xl font-bold text-center mb-8 text-white font-mono"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, amount: 0.3 }}
        >
          AI Manners
        </motion.h3>
        
        <motion.div 
          className="space-y-4"
          initial="hidden"
          whileInView="visible"
          exit="hidden"
          viewport={{ once: false, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
              }
            }
          }}
        >
          {/* Dialog 1 */}
          <motion.div 
            className="flex justify-end"
            variants={{
              hidden: { opacity: 0, x: 50, scale: 0.8 },
              visible: { 
                opacity: 1, 
                x: 0, 
                scale: 1,
                transition: { duration: 0.5, ease: "easeOut" }
              }
            }}
          >
            <div className="max-w-xs sm:max-w-md bg-gradient-to-br from-red-500/20 to-red-600/10 backdrop-blur-md rounded-2xl rounded-br-sm p-4 border border-red-400/30 shadow-lg shadow-red-500/10 hover:shadow-red-500/20 transition-shadow duration-300">
              <p className="text-red-100 text-sm font-mono leading-relaxed">"I asked ChatGPT and this is what it said: ..."</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex justify-start"
            variants={{
              hidden: { opacity: 0, x: -50, scale: 0.8 },
              visible: { 
                opacity: 1, 
                x: 0, 
                scale: 1,
                transition: { duration: 0.5, ease: "easeOut" }
              }
            }}
          >
            <div className="max-w-xs sm:max-w-md bg-gradient-to-br from-gray-700/30 to-gray-600/20 backdrop-blur-md rounded-2xl rounded-bl-sm p-4 border border-gray-500/40 shadow-lg shadow-gray-500/10 hover:shadow-gray-500/20 transition-shadow duration-300">
              <p className="text-gray-100 text-sm font-mono leading-relaxed">Whoa, let me stop you right here buddy, what you're doing here is extremely, horribly rude.</p>
            </div>
          </motion.div>

          {/* Dialog 2 */}
          <motion.div 
            className="flex justify-end"
            variants={{
              hidden: { opacity: 0, x: 50, scale: 0.8 },
              visible: { 
                opacity: 1, 
                x: 0, 
                scale: 1,
                transition: { duration: 0.5, ease: "easeOut" }
              }
            }}
          >
            <div className="max-w-xs sm:max-w-md bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-md rounded-2xl rounded-br-sm p-4 border border-green-400/30 shadow-lg shadow-green-500/10 hover:shadow-green-500/20 transition-shadow duration-300">
              <p className="text-green-100 text-sm font-mono leading-relaxed">"I had a helpful chat with ChatGPT about this topic some time ago and can share a log with you if you want."</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex justify-start"
            variants={{
              hidden: { opacity: 0, x: -50, scale: 0.8 },
              visible: { 
                opacity: 1, 
                x: 0, 
                scale: 1,
                transition: { duration: 0.5, ease: "easeOut" }
              }
            }}
          >
            <div className="max-w-xs sm:max-w-md bg-gradient-to-br from-gray-700/30 to-gray-600/20 backdrop-blur-md rounded-2xl rounded-bl-sm p-4 border border-gray-500/40 shadow-lg shadow-gray-500/10 hover:shadow-gray-500/20 transition-shadow duration-300">
              <p className="text-gray-100 text-sm font-mono leading-relaxed">Yeah, send it my way I'll take a look.</p>
            </div>
          </motion.div>

          {/* Dialog 3 */}
          <motion.div 
            className="flex justify-end"
            variants={{
              hidden: { opacity: 0, x: 50, scale: 0.8 },
              visible: { 
                opacity: 1, 
                x: 0, 
                scale: 1,
                transition: { duration: 0.5, ease: "easeOut" }
              }
            }}
          >
            <div className="max-w-xs sm:max-w-md bg-gradient-to-br from-red-500/20 to-red -600/10 backdrop-blur-md rounded-2xl rounded-br-sm p-4 border border-red-400/30 shadow-lg shadow-red-500/10 hover:shadow-red-500/20 transition-shadow duration-300">
              <p className="text-red-100 text-sm font-mono leading-relaxed">"I vibe-coded this pull request in just 15 minutes. Please review"</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex justify-start"
            variants={{
              hidden: { opacity: 0, x: -50, scale: 0.8 },
              visible: { 
                opacity: 1, 
                x: 0, 
                scale: 1,
                transition: { duration: 0.5, ease: "easeOut" }
              }
            }}
          >
            <div className="max-w-xs sm:max-w-md bg-gradient-to-br from-gray-700/30 to-gray-600/20 backdrop-blur-md rounded-2xl rounded-bl-sm p-4 border border-gray-500/40 shadow-lg shadow-gray-500/10 hover:shadow-gray-500/20 transition-shadow duration-300">
              <p className="text-gray-100 text-sm font-mono leading-relaxed">Well, why don't you review it first?</p>
            </div>
          </motion.div>

          {/* Dialog 4 */}
          <motion.div 
            className="flex justify-end"
            variants={{
              hidden: { opacity: 0, x: 50, scale: 0.8 },
              visible: { 
                opacity: 1, 
                x: 0, 
                scale: 1,
                transition: { duration: 0.5, ease: "easeOut" }
              }
            }}
          >
            <div className="max-w-xs sm:max-w-md bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-md rounded-2xl rounded-br-sm p-4 border border-green-400/30 shadow-lg shadow-green-500/10 hover:shadow-green-500/20 transition-shadow duration-300">
              <p className="text-green-100 text-sm font-mono leading-relaxed">"Here's my PR, I did this and that for this and that reason."</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex justify-start"
            variants={{
              hidden: { opacity: 0, x: -50, scale: 0.8 },
              visible: { 
                opacity: 1, 
                x: 0, 
                scale: 1,
                transition: { duration: 0.5, ease: "easeOut" }
              }
            }}
          >
            <div className="max-w-xs sm:max-w-md bg-gradient-to-br from-gray-700/30 to-gray-600/20 backdrop-blur-md rounded-2xl rounded-bl-sm p-4 border border-gray-500/40 shadow-lg shadow-gray-500/10 hover:shadow-gray-500/20 transition-shadow duration-300">
              <p className="text-gray-100 text-sm font-mono leading-relaxed">Thank you for the clear explanation!</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="mt-16 text-center">
        <p className="text-white/70 text-xs italic">
          “The value of humanity lies in bringing warmth to a cold universe, using our mortal flesh to write eternal stories.”
        </p>
        <p className="text-white/40 text-xs mt-2">— PoT Team</p>
      </div>
    </div>
  );
}
