import { BehaviorSubject } from 'rxjs';
import { useState, useEffect } from 'react';

export function useSubject<T>(subject: BehaviorSubject<T>): T {
  const [state, setState] = useState(subject.value);

  useEffect(() => {
    const sub = subject.subscribe((val) => {
      setState(val);
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  return state;
}
