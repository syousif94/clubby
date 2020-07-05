import React from 'react';
import { user$ } from '../lib/user';
import { Redirect, RouteComponentProps, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import Head from '../Components/Head';
import FormInput from '../Components/FormInput';
import { useSubject } from '../lib/useSubject';
import {
  phone$,
  phoneSubmitted$,
  submitPhone,
  code$,
  submitCode,
} from '../lib/login';
const styles = require('../App.css');

export default (props: RouteComponentProps) => {
  const location = useLocation();
  const phone = useSubject(phone$);
  const phoneSubmitted = useSubject(phoneSubmitted$);
  const code = useSubject(code$);
  if (user$.value) {
    return <Redirect to="/" />;
  }
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        background: '#fff',
        zIndex: 3,
        overflow: 'scroll',
      }}
    >
      <Head title="Login - Clubby" />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: 400,
          padding: '30px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            fontSize: '2.2rem',
            color: '#000',
            fontWeight: 700,
            marginBottom: 15,
          }}
        >
          Login
        </div>
        <FormInput
          value={phone}
          onChange={(e) => {
            phone$.next(e.target.value);
          }}
          placeholder="Phone"
          type="tel"
          autoFocus
          disabled={phoneSubmitted}
          style={{ margin: '7px 0' }}
        />
        {phoneSubmitted ? (
          <FormInput
            value={code}
            onChange={(e) => {
              code$.next(e.target.value);
            }}
            autoFocus
            placeholder="Code"
            style={{ margin: '7px 0' }}
          />
        ) : null}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          <Link
            to={{
              pathname: `/signup`,
              state: (location as any)?.state,
            }}
          >
            Sign Up
          </Link>
          <button
            className={styles.fading}
            style={{
              height: 32,
              borderRadius: 7,
              padding: '0 12px',
              fontWeight: 400,
              color: '#555',
              background: '#fcfcfc',
              boxShadow: '0 0.5px 2px -1px #888',
              border: '0.5px solid #ccc',
            }}
            onClick={() => {
              if (phoneSubmitted) {
                submitCode();
              } else {
                submitPhone();
              }
            }}
          >
            <span>{phoneSubmitted ? 'Confirm Code' : 'Login'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
