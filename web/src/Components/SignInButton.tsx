import React, { CSSProperties } from 'react';
import Button from './Button';

export default () => {
  return (
    <Button containerStyle={containerStyle} style={{ padding: '0 10px' }}>
      Login
    </Button>
  );
};

const containerStyle: CSSProperties = {
  margin: 10,
  background: 'linear-gradient(#3591fd, #0572f1)',
  color: '#fff',
  fontWeight: 400,
  borderRadius: 4,
  boxShadow: '0 1px 5px #e0e0e0',
};
