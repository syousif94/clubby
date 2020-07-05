import React, { ReactNode } from 'react';
import SideBar from './SideBar';
import MenuButton from './MenuButton';

interface ISidebarLayoutProps {
  children?: ReactNode;
}

export default ({ children }: ISidebarLayoutProps) => {
  return (
    <div style={{ display: 'flex' }}>
      <SideBar />
      <div style={{ flex: 2.8, display: 'flex', overflowX: 'hidden' }}>
        {children}
      </div>
      <MenuButton />
    </div>
  );
};
