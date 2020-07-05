import React, { CSSProperties } from 'react';

export default () => {
  return (
    <div style={containerStyle}>
      <input style={inputStyle} placeholder="Cities and clubs" />
    </div>
  );
};

const containerStyle: CSSProperties = {
  background: '#fbfbfb',
  display: 'flex',
  margin: 7,
  borderRadius: 4,
  width: 400,
};

const inputStyle: CSSProperties = {
  padding: '0 10px',
  flex: 1,
};
