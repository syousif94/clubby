import { useState, useEffect } from 'react';
import { BehaviorSubject } from 'rxjs';
import { CLIENT } from './constants';

const dimensions$ = new BehaviorSubject({
  width: CLIENT ? window.innerWidth : 0,
  height: CLIENT ? window.innerHeight : 0,
});

let timeout: number;

if (CLIENT) {
  window.addEventListener(
    'resize',
    function onResize(e) {
      if (timeout) {
        window.cancelAnimationFrame(timeout);
      }

      timeout = window.requestAnimationFrame(() => {
        dimensions$.next({
          height: window.innerHeight,
          width: window.innerWidth,
        });
      });
    },
    false
  );
}

export default function useDimensions() {
  const [dimensions, setDimensions] = useState(dimensions$.value);

  useEffect(() => {
    const sub = dimensions$.subscribe((dimensions) => {
      setDimensions(dimensions);
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  return dimensions;
}
