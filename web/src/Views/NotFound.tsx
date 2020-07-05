import React from 'react';
import Head from '../Components/Head';
import { Status } from '../Components/Status';

export default () => {
  return (
    <>
      <Head title="Not Found" />
      <Status code={404} />
      <div>Not Found</div>
    </>
  );
};
