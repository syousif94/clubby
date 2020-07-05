import { createMedia } from '@artsy/fresnel';
import { useState, useEffect } from 'react';
import { SERVER } from './constants';

const AppMedia = createMedia({
  breakpoints: {
    s: 0,
    md: 700,
  },
});

export const mediaStyle = AppMedia.createMediaStyle();

export const {
  Media,
  MediaContextProvider,
  findBreakpointsForWidths,
  findBreakpointAtWidth,
  SortedBreakpoints,
} = AppMedia;

export const SSRStyleID = 'ssr-fresnel-style';

export function useMediaQuery(mediaQuery: string): Boolean {
  if (SERVER) {
    return false;
  }

  const [isVerified, setIsVerified] = useState(
    !!window.matchMedia(mediaQuery).matches
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(mediaQuery);
    const documentChangeHandler = () => setIsVerified(!!mediaQueryList.matches);

    mediaQueryList.addListener(documentChangeHandler);

    documentChangeHandler();
    return () => {
      mediaQueryList.removeListener(documentChangeHandler);
    };
  }, [mediaQuery]);

  return isVerified;
}
