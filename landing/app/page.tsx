'use client';

import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';
import HeroContent from '@/components/hero-content';
import Navigation from '@/components/navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);

    const resetEvent = new Event('resetSection');
    window.dispatchEvent(resetEvent);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="https://me7aitdbxq.ufs.sh/f/2wsMIGDMQRdYuZ5R8ahEEZ4aQK56LizRdfBSqeDMsmUIrJN1"
        // posterSrc="https://framerusercontent.com/images/HJcCbfFQM8yzx7RAm2rtZSvpQ.gif"
        posterSrc="https://framerusercontent.com/images/97D9LMP4XZ7GcnNMEB1wIek.png"
        // bgImageSrc="https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=2348&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        bgImageSrc="https://pbs.twimg.com/media/GdErUjnXAAAsR7i?format=jpg&name=4096x4096"
        title="Proof of Thought"
        date="Defining AI Manners"
        scrollToExpand="Scroll to explore"
        textBlend
      >
        <HeroContent />
      </ScrollExpandMedia>
    </div>
  );
}
