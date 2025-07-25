'use client';

import { Brain, Share2, Sparkles, Clock } from 'lucide-react';

export default function HeroContent() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-blue-300" />
            <h3 className="text-xl font-bold text-white">记录思考过程</h3>
          </div>
          <p className="text-gray-200">
            不只是分享结果，更要记录你的思考路径。让每一次创作都有迹可循。
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-purple-300" />
            <h3 className="text-xl font-bold text-white">仪式感动画</h3>
          </div>
          <p className="text-gray-200">
            精心设计的开箱动画，为你的思考证明增添独特的仪式感。
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <Share2 className="w-8 h-8 text-green-300" />
            <h3 className="text-xl font-bold text-white">优雅分享</h3>
          </div>
          <p className="text-gray-200">
            一键生成优雅的分享文案，让你的思考以最美观的方式呈现。
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-8 h-8 text-orange-300" />
            <h3 className="text-xl font-bold text-white">时间证明</h3>
          </div>
          <p className="text-gray-200">
            为你的创作添加时间戳，证明这是你在特定时刻的真实思考。
          </p>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6 text-white">
          在AI时代，重新定义"何以为人"
        </h2>
        <p className="text-lg text-gray-200 mb-8 leading-relaxed">
          当AI可以生成完美的答案时，人类的真正价值在于我们的思考过程。
          Proof of Thought 不是要证明AI的局限，而是要彰显人类思考的独特价值。
          每一次分享，都是对"何以为人"的深刻诠释。
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg">
            开始创建思考证明
          </button>
          <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl transition-colors duration-200 border border-white/30">
            查看示例
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
