// File: under-construction.js
// Folder: /rwtnews/pages

import Head from 'next/head';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function UnderConstruction() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set target date to 3 weeks from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 21);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Coming Soon | Red, White and True News</title>
        <link rel="icon" href="/images/core/rwtn_favicon.jpg" />
      </Head>
      
      {/* Header without menu */}
      <header className="bg-[#3C3B6E] text-white p-4 sticky top-0 z-50 shadow-md max-w-7xl mx-auto">
        <div className="flex justify-center items-center">
          <div className="logo">
            <h1 className="text-2xl font-bold uppercase">Red, White and True News</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
          <h1 className="text-4xl font-bold text-[#3C3B6E] mb-6">Coming Soon</h1>
          
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            We are working hard to gather The RIGHT News for America so you can stay informed on the issues that matter to you. Stay tuned!
          </p>

          <h2 className="text-2xl font-semibold text-[#3C3B6E] mb-6">Estimated time to launch:</h2>

          {/* Countdown Timer */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#3C3B6E] text-white p-4 rounded-lg">
              <div className="text-3xl font-bold">{timeLeft.days}</div>
              <div className="text-sm uppercase">Days</div>
            </div>
            <div className="bg-[#3C3B6E] text-white p-4 rounded-lg">
              <div className="text-3xl font-bold">{timeLeft.hours}</div>
              <div className="text-sm uppercase">Hours</div>
            </div>
            <div className="bg-[#3C3B6E] text-white p-4 rounded-lg">
              <div className="text-3xl font-bold">{timeLeft.minutes}</div>
              <div className="text-sm uppercase">Minutes</div>
            </div>
            <div className="bg-[#3C3B6E] text-white p-4 rounded-lg">
              <div className="text-3xl font-bold">{timeLeft.seconds}</div>
              <div className="text-sm uppercase">Seconds</div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4 mb-6">
            <a href="https://www.facebook.com/RedWhiteandTrueNews/" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); if (confirm("You're leaving to visit Facebook. Continue?")) window.open(e.target.href, '_blank'); }}>
              <img src="/images/core/facebook-icon-square.png" alt="Facebook" className="w-12 h-12 hover:opacity-80 transition-opacity" />
            </a>
            <a href="https://x.com/RWTNews" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); if (confirm("You're leaving to visit X. Continue?")) window.open(e.target.href, '_blank'); }}>
              <img src="/images/core/x-icon-square.png" alt="X" className="w-12 h-12 hover:opacity-80 transition-opacity" />
            </a>
            <a href="https://www.youtube.com/@RWTNews" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); if (confirm("You're leaving to visit YouTube. Continue?")) window.open(e.target.href, '_blank'); }}>
              <img src="/images/core/youtube-icon-square.png" alt="YouTube" className="w-12 h-12 hover:opacity-80 transition-opacity" />
            </a>
            <a href="mailto:contact@rwtnews.com" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); if (confirm("You're opening an email form. Continue?")) window.location.href = e.target.href; }}>
              <img src="/images/core/email-icon.png" alt="Email" className="w-12 h-12 hover:opacity-80 transition-opacity" />
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#3C3B6E] text-white p-6 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center gap-4 mb-4">
            <a href="https://www.facebook.com/RedWhiteandTrueNews/" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); if (confirm("You're leaving to visit Facebook. Continue?")) window.open(e.target.href, '_blank'); }}>
              <img src="/images/core/facebook-icon-square.png" alt="Facebook" className="w-12 h-12" />
            </a>
            <a href="https://x.com/RWTNews" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); if (confirm("You're leaving to visit X. Continue?")) window.open(e.target.href, '_blank'); }}>
              <img src="/images/core/x-icon-square.png" alt="X" className="w-12 h-12" />
            </a>
            <a href="https://www.youtube.com/@RWTNews" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); if (confirm("You're leaving to visit YouTube. Continue?")) window.open(e.target.href, '_blank'); }}>
              <img src="/images/core/youtube-icon-square.png" alt="YouTube" className="w-12 h-12" />
            </a>
            <a href="mailto:contact@rwtnews.com" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); if (confirm("You're opening an email form. Continue?")) window.location.href = e.target.href; }}>
              <img src="/images/core/email-icon.png" alt="Email" className="w-12 h-12" />
            </a>
          </div>
          <div className="text-sm">
            <Link href="/terms" className="text-[#B22234] mx-2">Terms of Use</Link>
            <Link href="/privacy" className="text-[#B22234] mx-2">Privacy Policy</Link>
          </div>
          <p className="text-sm mt-4">© 2025 Red, White and True News LLC</p>
        </div>
      </footer>
    </>
  );
}