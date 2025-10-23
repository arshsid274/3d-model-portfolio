import { useEffect, useRef } from 'react';

export const useGSAP = (callback, dependencies = []) => {
  const cleanupRef = useRef();

  useEffect(() => {
    cleanupRef.current = callback();
    
    return () => {
      if (typeof cleanupRef.current === 'function') {
        cleanupRef.current();
      }
    };
  }, dependencies);
};