
import { useState, useEffect } from 'react';

export const useStaleDataWarning = () => {
  const [staleDataWarning, setStaleDataWarning] = useState(false);

  const checkStaleData = () => {
    const lastUpdate = localStorage.getItem('sunbeam-last-update');
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (lastUpdate && (now - parseInt(lastUpdate)) > oneDay) {
      setStaleDataWarning(true);
    }

    if (!lastUpdate) {
      localStorage.setItem('sunbeam-last-update', now.toString());
    }
  };

  const refreshData = () => {
    setStaleDataWarning(false);
    localStorage.setItem('sunbeam-last-update', new Date().getTime().toString());
  };

  useEffect(() => {
    checkStaleData();
  }, []);

  return {
    staleDataWarning,
    refreshData
  };
};
