import React from 'react';
import { useGSAP } from '../../hooks/useGSAP';
import { gsap } from 'gsap';

const MARQUEE_ITEMS = [
  "ESTABLISHED 1968",
  "COLD-GROUND IN RAMGANJ MANDI",
  "SINGLE-ORIGIN PROCUREMENT",
  "ZERO PRESERVATIVES",
  "FARM-DIRECT SOURCING",
];

export default function MarqueeStrip() {
  useGSAP(() => {
    // Duplicate the content to create a seamless infinite loop
    const track = document.querySelector('.marquee-track');
    if (!track) return;
    
    // Calculate total width of one set
    const totalWidth = track.scrollWidth / 2;
    
    gsap.to(track, {
      x: -totalWidth,
      ease: "none",
      duration: 20,
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
      }
    });
  }, []);

  return (
    <div className="w-full bg-char py-4 overflow-hidden border-y border-mist/20">
      <div className="marquee-container w-full flex whitespace-nowrap">
        <div className="marquee-track flex w-max">
          {/* First Set */}
          {MARQUEE_ITEMS.map((text, i) => (
            <div key={`set1-${i}`} className="flex items-center mx-8">
              <span className="text-saffron mr-8 opacity-70">✦</span>
              <span className="font-sans font-bold tracking-[0.2em] text-sm text-cream uppercase">{text}</span>
            </div>
          ))}
          {/* Second Set for seamless loop */}
          {MARQUEE_ITEMS.map((text, i) => (
            <div key={`set2-${i}`} className="flex items-center mx-8">
              <span className="text-saffron mr-8 opacity-70">✦</span>
              <span className="font-sans font-bold tracking-[0.2em] text-sm text-cream uppercase">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
