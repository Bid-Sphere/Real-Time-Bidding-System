import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  deadline: string; // ISO date string
  urgent?: boolean;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  isUrgent: boolean;
}

function calculateTimeRemaining(deadline: string): TimeRemaining {
  const now = new Date().getTime();
  const deadlineTime = new Date(deadline).getTime();
  const difference = deadlineTime - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, isUrgent: true };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

  // Urgent if less than 24 hours
  const isUrgent = difference < 24 * 60 * 60 * 1000;

  return { days, hours, minutes, isUrgent };
}

export function CountdownTimer({ deadline, urgent }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(
    calculateTimeRemaining(deadline)
  );

  useEffect(() => {
    // Update every minute
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(deadline));
    }, 60000);

    return () => clearInterval(interval);
  }, [deadline]);

  const { days, hours, minutes, isUrgent } = timeRemaining;
  const shouldShowUrgent = urgent !== undefined ? urgent : isUrgent;

  // Format the display text
  let displayText = '';
  if (days === 0 && hours === 0 && minutes === 0) {
    displayText = 'Expired';
  } else if (days === 0) {
    displayText = `Ends in ${hours}h ${minutes}m`;
  } else if (days === 1) {
    displayText = `${days} day ${hours}h`;
  } else {
    displayText = `${days} days ${hours}h`;
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
        shouldShowUrgent
          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
      }`}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{displayText}</span>
    </div>
  );
}
