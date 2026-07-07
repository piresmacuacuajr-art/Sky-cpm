import { useState, useEffect } from 'react';

export default function TimeDisplay() {
  const [time, setTime] = useState(
    new Intl.DateTimeFormat('pt-MZ', {
      timeZone: 'Africa/Maputo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date())
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(
        new Intl.DateTimeFormat('pt-MZ', {
          timeZone: 'Africa/Maputo',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(new Date())
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Africa/Maputo (CAT) - {time}</span>;
}
