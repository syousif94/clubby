import React from 'react';
import { Helmet } from 'react-helmet-async';

const isProd = process.env.NODE_ENV === 'production';

interface HeadProps {
  description?: string;
  title?: string;
  image?: string;
  children?: any;
}

function Head({
  title = 'Join Clubs',
  description,
  image,
  children,
}: HeadProps) {
  return (
    <Helmet>
      {/* <link rel="shortcut icon" href={favicon} type="image/x-icon" />
      <link rel="apple-touch-icon" sizes="512x512" href={icon512} />
      <link rel="apple-touch-icon" sizes="192x192" href={icon192} />
      <link rel="apple-touch-icon-precomposed" href={icon192} />
      <link rel="icon" sizes="192x192" href={icon192} /> */}
      {description && <meta name="description" content={description} />}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      <link rel="manifest" href="/manifest.json" />
      {children && children}
      {title && <title>{title}</title>}
    </Helmet>
  );
}

export default Head;
