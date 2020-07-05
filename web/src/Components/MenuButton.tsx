import React, { CSSProperties } from 'react';
import { Media } from '../lib/media';
import { showSidebar$ } from '../lib/sidebar';
const styles = require('../App.css');

export default () => {
  return (
    <Media lessThan="md">
      {(mediaClassNames) => {
        return (
          <div
            className={`${mediaClassNames} ${styles.menuButton}`}
            style={{
              position: 'fixed',
              right: 15,
              height: 54,
              width: 54,
              background: 'blue',
              borderRadius: '50%',
            }}
            onClick={() => {
              showSidebar$.next(true);
            }}
          ></div>
        );
      }}
    </Media>
  );
};
