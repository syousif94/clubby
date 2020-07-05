import React, { useRef, useEffect, CSSProperties, ChangeEvent } from 'react';
import { user$ } from '../lib/user';
import { Redirect, RouteComponentProps, useLocation } from 'react-router';
import Head from '../Components/Head';
import { Link } from 'react-router-dom';
import { useSubject } from '../lib/useSubject';
const styles = require('../App.css');
import {
  name$,
  phone$,
  cityQuery$,
  handleSubmit,
  selectedCity$,
} from '../lib/signup';
import { BehaviorSubject } from 'rxjs';
import FormInput from '../Components/FormInput';
import CitySuggestions from '../Components/CitySuggestions';

export default (props: RouteComponentProps) => {
  const location = useLocation();
  const name = useSubject(name$);
  const phone = useSubject(phone$);
  const cityQuery = useSubject(cityQuery$);
  const selectedCity = useSubject(selectedCity$);
  if (user$.value) {
    return <Redirect to="/" />;
  }
  const onChange = (subject: BehaviorSubject<string>) => (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    subject.next(e.target.value);
  };
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
        overflowY: 'scroll',
      }}
    >
      <Head title="Sign up - Clubby" />
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
          Sign Up
        </div>
        <FormInput
          value={name}
          onChange={onChange(name$)}
          placeholder="Name"
          autoFocus
          style={{ margin: '7px 0' }}
        />
        <FormInput
          value={phone}
          onChange={onChange(phone$)}
          placeholder="Phone"
          style={{ margin: '7px 0' }}
        />
        <FormInput
          value={cityQuery}
          onChange={onChange(cityQuery$)}
          placeholder="City"
          style={{ margin: '7px 0 0' }}
        />
        <CitySuggestions />

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
              pathname: `/login`,
              state: { background: (location as any)?.state?.background },
            }}
          >
            Login
          </Link>
          <button
            onClick={handleSubmit}
            className={styles.fading}
            style={{
              height: 32,
              borderRadius: 7,
              fontWeight: 400,
              padding: '0 12px',
              color: '#555',
              background: '#fcfcfc',
              boxShadow: '0 0.5px 2px -1px #888',
              border: '0.5px solid #ccc',
            }}
          >
            <span>Sign up</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const labelStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  margin: '7px 0',
  borderRadius: 4,
};

const labelTextStyle: CSSProperties = {
  fontWeight: 400,
  color: '#444',
  marginBottom: 5,
};

const inputStyle: CSSProperties = {
  flex: 1,
  padding: '0 10px',
  height: 60,
};
