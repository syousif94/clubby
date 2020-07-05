import React from 'react';
import { useCitySuggestions, selectedCity$ } from '../lib/signup';
import { useSubject } from '../lib/useSubject';
const styles = require('../App.css');

export default () => {
  const selectedCity = useSubject(selectedCity$);
  const suggestions = useCitySuggestions();
  return (
    <div style={{ marginBottom: 7, marginTop: suggestions.length ? 7 : 0 }}>
      {selectedCity
        ? null
        : suggestions.map((suggestion) => {
            return (
              <div
                key={suggestion.placeId}
                style={{
                  padding: 7,
                  borderBottom: '1px solid #f4f4f4',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                className={styles.fading}
              >
                <div style={{ fontSize: '1rem' }}>{suggestion.mainText}</div>
                <div
                  style={{
                    fontSize: '0.73rem',
                    color: '#888',
                    marginTop: 3,
                  }}
                >
                  {suggestion.secondaryText}
                </div>
              </div>
            );
          })}
    </div>
  );
};
