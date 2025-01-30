import { useState, useEffect } from 'react';
import Image from 'next/image';

const AdComponent = () => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showAd, setShowAd] = useState(true);

  const ads = [
    {
      title: "FREE Brain Scans in Choroszcz! 🧠",
      text: "Local doctors HATE this! Get a FREE brain scan and receive a complimentary tin foil hat. Side effects may include seeing through walls and reading your neighbor's thoughts!",
      bgColor: "bg-amber-200",
      image: "/panda1.jpg"
    },
    {
      title: "⚠️ THIS MAN IS REAL ⚠️",
      text: "Every night at 3:33 AM he appears in someone's kitchen eating their leftovers. Reports say he leaves cryptic grocery lists. Have YOU seen him reorganizing your fridge?",
      bgColor: "bg-emerald-200",
      image: "/panda2.jpg"
    },
    {
      title: "🎵 EMERGENCY DANCE PARTY ALERT 🎵",
      text: "WARNING: Your device has detected dangerous levels of boredom! Click here for instant party mode. Includes free virtual confetti and digital dance moves!",
      bgColor: "bg-rose-200",
      image: "/panda3.jpg"
    }
  ];

  useEffect(() => {
    if (!showAd) return;
    const eventSource = new EventSource('/api/ads');
    eventSource.onmessage = () => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    };
    return () => eventSource.close();
  }, [showAd]);

  if (!showAd) return null;
  const currentAd = ads[currentAdIndex];

  return (
    <div
      onClick={() => setShowAd(false)}
      className={`fixed bottom-0 left-0 right-0 p-4 ${currentAd.bgColor} cursor-pointer
        transition-all duration-300 ease-in-out animate-bounce
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500/30 before:via-pink-500/30 before:to-yellow-500/30 before:animate-[gradient_3s_ease_infinite]
        after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1)_0%,transparent_50%)] after:animate-[pulse_2s_ease-in-out_infinite]`}
    >
      <div className="max-w-3xl mx-auto relative flex items-center gap-4 min-h-[6rem]">
        <div className="relative w-24 h-24 flex-shrink-0">
          <Image
            src={currentAd.image}
            alt="Ad image"
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="flex-grow px-6 whitespace-nowrap overflow-hidden">
          <h3 className="font-bold text-black text-lg animate-pulse truncate">{currentAd.title}</h3>
          <p className="text-sm text-black truncate">{currentAd.text}</p>
        </div>
      </div>
    </div>
  );
};

export default AdComponent;
