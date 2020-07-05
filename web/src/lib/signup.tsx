import { useState, useEffect } from 'react';
import { BehaviorSubject } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { switchMap, filter, debounceTime } from 'rxjs/operators';

export const name$ = new BehaviorSubject('');

export const phone$ = new BehaviorSubject('');

export const photo$ = new BehaviorSubject('');

export const cityQuery$ = new BehaviorSubject('');

export const selectedCity$ = new BehaviorSubject<CitySuggestion | null>(null);

class CitySuggestion {
  mainText: string;
  secondaryText: string;
  placeId: string;

  constructor(json: any) {
    this.mainText = json['main_text'];
    this.secondaryText = json['secondary_text'];
    this.placeId = json['place_id'];
  }
}

export function useCitySuggestions() {
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  useEffect(() => {
    const sub = cityQuery$
      .pipe(
        filter((query) => !!query),
        debounceTime(100),
        switchMap((text) => {
          const body = {
            text,
          };
          return fromFetch('/api/cities/suggest', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accepts: 'application/json',
            },
            body: JSON.stringify(body),
          });
        }),
        switchMap((res) => res.json())
      )
      .subscribe((json: any) => {
        if (json.error) {
          console.log(json.error);
        }

        setSuggestions(
          json.suggestions.map((json: any) => new CitySuggestion(json))
        );
      });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  return suggestions;
}

export async function handleSubmit() {
  console.log(name$.value, phone$.value, photo$.value);
}
