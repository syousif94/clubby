import React from 'react';
import Head from '../Components/Head';
import Intro from '../Components/Intro';
import Explore from '../Components/ExploreView';

export default () => {
  return (
    <>
      <Head title="Clubby" />
      <div style={{ flex: '0 0 auto', width: '100%' }}>
        <Intro />
        <Explore />
      </div>
    </>
  );
};
