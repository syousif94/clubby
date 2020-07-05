import React, { ReactNode, useEffect, useRef, CSSProperties } from 'react';
import { Media, useMediaQuery } from '../lib/media';
import { useSubject } from '../lib/useSubject';
import { showSidebar$ } from '../lib/sidebar';
import { useSpring, animated as a } from 'react-spring';
const styles = require('./SideBar.scss');

const SIDEBAR_WIDTH = 240;

export default () => {
  return (
    <Wrapper>
      <div
        style={{
          width: '100%',
          maxWidth: SIDEBAR_WIDTH,
          height: '100%',
          overflowY: 'scroll',
          pointerEvents: 'auto',
          padding: '15px 0',
        }}
      >
        <div className={styles.link}>Explore</div>
        <div className={styles.link}>Profile</div>
        <div className={styles.link}>Feed</div>
        <div className={styles.link}>Messages</div>
        <div className={styles.link}>Events</div>
        <div className={styles.link}>Clubs</div>
        <div className={styles.link}>Advertising</div>
      </div>
    </Wrapper>
  );
};

interface IWrapperProps {
  children: ReactNode;
}

function onTouchMove(e: TouchEvent) {
  e.preventDefault();
}

function disableScroll(ref: React.MutableRefObject<HTMLDivElement | null>) {
  document.body.style.overflow = 'hidden';
  ref.current?.addEventListener('touchmove', onTouchMove);
}

function enableScroll(ref: React.MutableRefObject<HTMLDivElement | null>) {
  document.body.style.overflow = 'visible';
  ref.current?.removeEventListener('touchmove', onTouchMove);
}

const Wrapper = ({ children }: IWrapperProps) => {
  const dismissRef: React.MutableRefObject<HTMLDivElement | null> = useRef(
    null
  );
  const showSidebar = useSubject(showSidebar$);
  const isNarrow = useMediaQuery('(max-width: 699px)');
  const { transform, opacity } = useSpring({
    opacity: showSidebar ? 1 : 0,
    transform: `translateX(${showSidebar ? 0 : -SIDEBAR_WIDTH}px)`,
    config: { mass: 2, tension: 1200, friction: 120 },
  });
  useEffect(() => {
    if (!document) {
      return;
    }
    if (showSidebar) {
      disableScroll(dismissRef);
    } else {
      enableScroll(dismissRef);
    }
  }, [showSidebar]);
  useEffect(() => {
    if (!document) {
      return;
    }
    if (showSidebar$.value && isNarrow) {
      disableScroll(dismissRef);
    } else if (!isNarrow) {
      enableScroll(dismissRef);
    }
  }, [isNarrow]);
  return (
    <>
      <Media lessThan="md">
        {(mediaClassNames) => {
          return (
            <div
              className={mediaClassNames}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 2,
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  position: 'fixed',
                  height: '100%',
                  top: 0,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  pointerEvents: 'none',
                }}
              >
                <a.div
                  ref={dismissRef}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.4)',
                    opacity,
                    pointerEvents: showSidebar ? 'auto' : 'none',
                  }}
                  onClick={() => {
                    showSidebar$.next(false);
                  }}
                />
                <a.div
                  style={{
                    height: '100%',
                    width: SIDEBAR_WIDTH,
                    transform,
                    background: '#fff',
                  }}
                >
                  {children}
                </a.div>
              </div>
            </div>
          );
        }}
      </Media>
      <Media greaterThanOrEqual="md">
        {(mediaClassNames) => {
          return (
            <div
              className={mediaClassNames}
              style={{
                flex: 1,
                display: 'flex',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'fixed',
                  height: '100%',
                  top: 0,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    borderRight: '1px #f4f4f4 solid',
                  }}
                >
                  {children}
                </div>
                <div style={{ flex: 2.8 }} />
              </div>
            </div>
          );
        }}
      </Media>
    </>
  );
};
