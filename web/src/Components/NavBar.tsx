import React, { CSSProperties } from 'react';
import SearchBar from './SearchBar';
import SignInButton from './SignInButton';
import MenuButton from './MenuButton';

export default () => {
  return (
    <div style={containerStyle}>
      <SearchBar />
      <MenuButton />
    </div>
  );
};

const containerStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 54,
  background: '#fff',
  borderBottom: '1px solid #f4f4f4',
  display: 'flex',
  justifyContent: 'center',
};
