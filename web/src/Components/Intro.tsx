import React, { CSSProperties } from 'react';
const styles = require('../App.css');
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

export default () => {
  const location = useLocation();
  return (
    <div
      style={{
        padding: '20px 30px',
        maxWidth: 600,
        background: '#F5F8FB',
        margin: 20,
        borderRadius: 10,
      }}
    >
      <div style={{ fontSize: '3rem', color: '#000', fontWeight: 700 }}>
        Welcome to Clubby
      </div>
      <div style={{ color: '#333', marginTop: 10, lineHeight: 1.5 }}>
        Clubby is a place to hang out with people that share your interests.
      </div>
      <div style={{ color: '#333', marginTop: 10, lineHeight: 1.5 }}>
        The goal for Clubby is use ad revenue to fund free community centers
        that are stocked for makers (wood and metal shops, film equipment,
        oscilloscopes, music studios, art supplies, etc.), because I think the
        technology should foster community, creativity, and learning, instead of
        social isolation and divisive echo chambers.
      </div>
      <div style={{ display: 'flex', marginTop: 20 }}>
        <Link
          to={{
            pathname: `/signup`,
          }}
        >
          <button style={buttonStyle} className={styles.fading}>
            <span>Sign Up</span>
          </button>
        </Link>
        <Link
          to={{
            pathname: `/login`,
          }}
        >
          <button style={buttonStyle} className={styles.fading}>
            <span>Login</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

const buttonStyle: CSSProperties = {
  height: 32,
  borderRadius: 7,
  padding: '0 12px',
  fontWeight: 400,
  color: '#555',
  background: '#fcfcfc',
  boxShadow: '0 0.5px 2px -1px #888',
  border: '0.5px solid #ccc',
  marginRight: 12,
};
