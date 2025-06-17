'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DarkModeToggle from '../components/DarkModeToggle';
import RequireAuth from '../components/RequireAuth';

const REWARDS = [
  { value: 2, color: '#FF6B6B', label: '2 Points' },
  { value: 5, color: '#4ECDC4', label: '5 Points' },
  { value: 8, color: '#45B7D1', label: '8 Points' },
  { value: 10, color: '#96CEB4', label: '10 Points' },
  { value: 12, color: '#FFEEAD', label: '12 Points' },
  { value: 15, color: '#D4A5A5', label: '15 Points' },
  { value: 18, color: '#9DE0AD', label: '18 Points' },
  { value: 20, color: '#FF9999', label: '20 Points' },
];

export default function SpinWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [points, setPoints] = useState(0);
  const [lastSpinTime, setLastSpinTime] = useState<number | null>(null);
  const [timeUntilNextSpin, setTimeUntilNextSpin] = useState<number | null>(null);

  const SPIN_COOLDOWN = 3600000; // 1 hour in milliseconds

  useEffect(() => {
    // Load points from localStorage
    const savedPoints = localStorage.getItem('userPoints');
    if (savedPoints) {
      setPoints(parseInt(savedPoints));
    }

    // Load last spin time from localStorage
    const savedLastSpinTime = localStorage.getItem('lastSpinTime');
    if (savedLastSpinTime) {
      setLastSpinTime(parseInt(savedLastSpinTime));
    }
  }, []);

  useEffect(() => {
    // Update countdown timer
    if (lastSpinTime) {
      const updateTimer = () => {
        const now = Date.now();
        const timeSinceLastSpin = now - lastSpinTime;
        if (timeSinceLastSpin < SPIN_COOLDOWN) {
          setTimeUntilNextSpin(SPIN_COOLDOWN - timeSinceLastSpin);
        } else {
          setTimeUntilNextSpin(null);
        }
      };

      const timer = setInterval(updateTimer, 1000);
      updateTimer();

      return () => clearInterval(timer);
    }
  }, [lastSpinTime]);

  const formatTimeRemaining = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const handleSpin = () => {
    if (isSpinning || (lastSpinTime && Date.now() - lastSpinTime < SPIN_COOLDOWN)) {
      return;
    }

    setIsSpinning(true);
    setResult(null);

    // Calculate random rotation (5-10 full spins + random segment)
    const spinCount = 5 + Math.random() * 5;
    const randomAngle = Math.random() * 360;
    const totalRotation = spinCount * 360 + randomAngle;

    // Determine which segment was landed on
    const segmentAngle = 360 / REWARDS.length;
    const normalizedAngle = randomAngle % 360;
    const segmentIndex = Math.floor(normalizedAngle / segmentAngle);
    const reward = REWARDS[REWARDS.length - 1 - segmentIndex];

    // Reset rotation to 0 before starting new spin
    setRotation(0);
    
    // Use requestAnimationFrame to ensure smooth animation
    requestAnimationFrame(() => {
      setRotation(totalRotation);
    });

    // After spin animation completes
    setTimeout(() => {
      setIsSpinning(false);
      setResult(reward.value);
      const newPoints = points + reward.value;
      setPoints(newPoints);
      localStorage.setItem('userPoints', newPoints.toString());
      setLastSpinTime(Date.now());
      localStorage.setItem('lastSpinTime', Date.now().toString());
    }, 5000);
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Navbar is now handled in layout.tsx */}
        {/* <Navbar /> */}

        {/* Removed Mobile Menu as it's now part of Navbar */}
        {/* <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} /> */}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Spin & Win Points
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Spin the wheel to earn points between 2-20!
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You can spin once every hour
            </p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-8">
            {/* Wheel Container */}
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              {/* Wheel */}
              <div
                className="absolute w-full h-full rounded-full transition-transform duration-5000 ease-out"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  background: `conic-gradient(${REWARDS.map((reward, index) => 
                    `${reward.color} ${(index * 360) / REWARDS.length}deg, 
                     ${reward.color} ${((index + 1) * 360) / REWARDS.length}deg`
                  ).join(', ')})`,
                  transformOrigin: 'center',
                }}
              >
                {/* Segment Labels */}
                {REWARDS.map((reward, index) => {
                  const angle = (index * 360) / REWARDS.length;
                  const segmentAngle = 360 / REWARDS.length;
                  const labelAngle = angle + (segmentAngle / 2); // Center the label in the segment
                  return (
                    <div
                      key={index}
                      className="absolute left-1/2 top-1/2 z-10"
                      style={{
                        transform: `rotate(${labelAngle}deg) translateY(-112px) translateX(-50%)`,
                        transformOrigin: 'center',
                      }}
                    >
                      <span
                        className="block text-white font-extrabold select-none text-center"
                        style={{
                          transform: `rotate(-${labelAngle}deg)`,
                          fontSize: '1.5rem',
                          textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                          whiteSpace: 'nowrap',
                          letterSpacing: '1px',
                        }}
                      >
                        {reward.value}
                      </span>
                    </div>
                  );
                })}
              </div>
              {/* Center Point */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Win</div>
                  <div className="text-base font-bold text-blue-600 dark:text-blue-400">2-20</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Points</div>
                </div>
              </div>
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-4 h-8 bg-red-500 clip-triangle"></div>
            </div>

            {/* Spin Button */}
            <button
              onClick={handleSpin}
              disabled={isSpinning || (timeUntilNextSpin !== null)}
              className={`px-6 py-3 rounded-full text-white font-semibold shadow-lg transition-all
                ${isSpinning || timeUntilNextSpin !== null
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl'
                }`}
            >
              {isSpinning
                ? 'Spinning...'
                : timeUntilNextSpin !== null
                  ? `Next spin in ${formatTimeRemaining(timeUntilNextSpin)}`
                  : 'Spin Now!'}
            </button>

            {/* Result Display */}
            {result !== null && (
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-4">
                You won {result} points!
              </div>
            )}

            {/* Total Points Display */}
            <div className="text-xl text-gray-800 dark:text-gray-200 mt-4">
              Total Points: {points}
            </div>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
} 