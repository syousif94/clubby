import React, { ReactNode } from 'react';

const categories = [
  'Painting',
  'Drawing',
  'Sculpting',
  'Programming',
  'Circuits',
  'Robotics',
  'Woodworking',
  'Fabrication',
  '3D Printing',
  '3D Modeling',
  'Video Production',
  'Crafts',
];

export default () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{ display: 'flex', overflow: 'scroll', padding: '0 10px 20px' }}
      >
        {categories.map((category) => {
          return <ClubCategory key={category}>{category}</ClubCategory>;
        })}
      </div>
    </div>
  );
};

interface IClubCategoryProps {
  children: ReactNode;
}

const ClubCategory = ({ children }: IClubCategoryProps) => {
  return (
    <div
      style={{
        height: 160,
        width: 200,
        background: '#fff',
        boxShadow: '0 0.5px 2px -1px #888',
        border: '0.5px solid #ccc',
        display: 'flex',
        flex: '0 0 auto',
        borderRadius: 8,
        margin: '0 10px',
      }}
    >
      {children}
    </div>
  );
};
