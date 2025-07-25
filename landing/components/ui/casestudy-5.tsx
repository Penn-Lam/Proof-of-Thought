'use client';

import { MoveRight } from "lucide-react";
import React from "react";

interface CasestudyItem {
  logo: string;
  company: string;
  tags: string;
  title: string;
  subtitle: string;
  image: string;
  link?: string;
}

interface Casestudy5Props {
  featuredCasestudy: CasestudyItem;
  casestudies: CasestudyItem[];
}

const defaultFeaturedCasestudy: CasestudyItem = {
  logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=50&fit=crop&crop=center",
  company: "PoT",
  tags: "HUMAN THINKING / AI COLLABORATION",
  title: "Ritual Animation for Thought Proofs",
  subtitle: "Elevate your thinking with cinematic animations.",
  image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
};

const defaultCasestudies: CasestudyItem[] = [
  {
    logo: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=150&h=50&fit=crop&crop=center",
    company: "Process",
    tags: "THINKING PROCESS / DOCUMENTATION",
    title: "Capture Your Thought Journey",
    subtitle: "Document every step of your creative thinking.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    link: "https://github.com/Penn-Lam/Proof-of-Thought",
  },
  {
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=50&fit=crop&crop=center",
    company: "Share",
    tags: "ELEGANT SHARING / SOCIAL MEDIA",
    title: "Share Your Thinking Beautifully",
    subtitle: "Generate elegant shareable content instantly.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
    link: "https://github.com/Penn-Lam/Proof-of-Thought",
  },
];

export const Casestudy5 = ({
  featuredCasestudy = defaultFeaturedCasestudy,
  casestudies = defaultCasestudies,
}: Casestudy5Props) => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="border border-gray-800 rounded-lg overflow-hidden">
          <div className="grid gap-4 overflow-hidden px-6 lg:grid-cols-2 xl:px-28">
            <div className="flex flex-col justify-between gap-4 pt-8 md:pt-16 lg:pb-16">
              <div>
                <span className="text-xs text-gray-400 sm:text-sm font-mono">
                  {featuredCasestudy.tags}
                </span>
                <h2 className="mt-4 mb-5 text-2xl font-semibold text-balance sm:text-3xl sm:leading-10 text-white font-mono">
                  {featuredCasestudy.title}
                  <span className="font-medium text-gray-400/50 transition-colors duration-500 ease-out group-hover:text-gray-400/70">
                    {" "}
                    {featuredCasestudy.subtitle}
                  </span>
                </h2>
              </div>
            </div>
            <div className="relative isolate py-16">
              <div className="relative isolate h-full border border-gray-700 bg-gray-900 p-2">
                <div className="h-full overflow-hidden">
                  <img
                    src={featuredCasestudy.image}
                    alt="placeholder"
                    className="aspect-[14/9] h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex border-t border-gray-800">
            <div className="hidden w-28 shrink-0 bg-[radial-gradient(var(--muted-foreground)_1px,transparent_1px)] [background-size:10px_10px] opacity-15 xl:block"></div>
            <div className="grid lg:grid-cols-2">
              {casestudies.map((item, idx) => (
                <div
                  key={item.company}
                  className={`flex flex-col justify-between gap-12 border-gray-800 bg-gray-900 px-6 py-8 md:py-16 lg:pb-16 xl:gap-16 ${
                    idx === 0
                      ? "xl:border-l xl:pl-8"
                      : "border-t lg:border-t-0 lg:border-l xl:border-r xl:pl-8"
                  }`}
                >
                  <div>
                    <span className="text-xs text-gray-400 sm:text-sm font-mono">
                      {item.tags}
                    </span>
                    <h2 className="mt-4 mb-5 text-2xl font-semibold text-balance sm:text-3xl sm:leading-10 text-white font-mono">
                      {item.title}
                      <span className="font-medium text-gray-400/50 transition-colors duration-500 ease-out group-hover:text-gray-400/70">
                        {" "}
                        {item.subtitle}
                      </span>
                    </h2>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden w-28 shrink-0 bg-[radial-gradient(var(--muted-foreground)_1px,transparent_1px)] [background-size:10px_10px] opacity-15 xl:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
