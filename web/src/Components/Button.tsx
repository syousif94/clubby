import React, { CSSProperties, ReactNode, MouseEventHandler } from 'react';

interface IButtonProps {
  children?: ReactNode;
  style?: CSSProperties;
  containerStyle?: CSSProperties;
  onClick?: MouseEventHandler;
}

export default ({
  children,
  style = {},
  onClick,
  containerStyle = {},
}: IButtonProps) => {
  return (
    <button style={containerStyle} onClick={onClick}>
      <div style={{ ...innerStyle, ...style }}>{children}</div>
    </button>
  );
};

const innerStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
