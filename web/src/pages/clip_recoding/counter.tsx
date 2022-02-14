import React, { useState, useEffect, useRef, useCallback } from "react";

function useCounter(initialValue, ms) {
  //초기 카운트 0
  const [count, setCount] = useState<any>(initialValue);
  //버튼 ref
  const intervalRef = useRef<any>(null);
  // start
  const start = useCallback(() => {
    if (intervalRef.current !== null) {
      return;
    }
    intervalRef.current = setInterval(() => {
      setCount((c) => c + 1);
    }, ms);
  }, []);
  // stop
  const stop = useCallback(() => {
    if (intervalRef.current === null) {
      return;
    }
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);
  // reset
  const reset = useCallback(() => {
    setCount(initialValue);
  }, []);

  //...element
  return { count, start, stop, reset };
}

export default useCounter;
