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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 860,
        padding: '0 10px 10px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          width: '100%',
        }}
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
        display: 'flex',
        height: 160,
        width: '33.33%',
        flex: '0 0 auto',
        padding: 10,
      }}
    >
      <div
        style={{
          flex: 1,
          boxShadow: '0 0.5px 2px -1px #888',
          border: '0.5px solid #ccc',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          position: 'relative',
          borderRadius: 8,
          overflow: 'hidden',
          background:
            'url(https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.6))',
            color: '#fff',
            fontWeight: 600,
            padding: '20px 8px 5px',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
