import React, { useState, useEffect, useCallback } from 'react';

interface CountdownTimerProps {
  endDate: Date | string;
  onExpire?: () => void;
  className?: string;
  label?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Extracted TimeUnit component to avoid creating components during render
const TimeUnit = ({ value, unitLabel }: { value: number; unitLabel: string }) => (
  <div className="flex flex-col items-center">
    <div className="bg-white text-red-600 font-bold text-2xl md:text-3xl w-14 md:w-16 h-14 md:h-16 rounded-lg shadow-md flex items-center justify-center border border-red-100">
      {String(value).padStart(2, '0')}
    </div>
    <span className="text-xs text-white/80 mt-1 uppercase tracking-wide font-medium">
      {unitLabel}
    </span>
  </div>
);

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endDate,
  onExpire,
  className = '',
  label = 'Sale ends in',
}) => {
  const calculateTimeLeft = useCallback((): TimeLeft | null => {
    const difference = new Date(endDate).getTime() - new Date().getTime();

    if (difference <= 0) {
      onExpire?.();
      return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  if (!timeLeft) return null;

  return (
    <div className={`bg-gradient-to-r from-red-600 to-orange-500 py-4 px-6 ${className}`}>
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="flex items-center gap-2 text-white">
          <span className="text-2xl">🔥</span>
          <span className="font-bold text-lg">{label}</span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <TimeUnit value={timeLeft.days} unitLabel="Days" />
          <span className="text-white text-2xl font-bold">:</span>
          <TimeUnit value={timeLeft.hours} unitLabel="Hrs" />
          <span className="text-white text-2xl font-bold">:</span>
          <TimeUnit value={timeLeft.minutes} unitLabel="Min" />
          <span className="text-white text-2xl font-bold">:</span>
          <TimeUnit value={timeLeft.seconds} unitLabel="Sec" />
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
