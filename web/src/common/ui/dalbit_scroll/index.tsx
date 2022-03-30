import React, { useState, useEffect, useRef, useCallback, useImperativeHandle } from "react";
import { usePrevious } from "lib/hooks";
import styled from "styled-components";

import "./index.scss";

let scroll_debounce_timer: null | ReturnType<typeof setTimeout>  = null;
let startTouchY = 0;
let startScrollY = 0;

const isWindows = navigator.appVersion.indexOf("Windows") !== -1;
const isMacintosh = navigator.appVersion.indexOf("Macintosh") !== -1;

export type ScrollObject = {
  elem: HTMLDivElement;
  scrollToDown: () => void;
};

type ScrollPropsType = {
  width?: number;
  height?: number;
  displayClassName?: string;
  barWrapClassName?: string;
  barClassName?: string;
  initBarBottom?: boolean;
  preventAutoHidden?: boolean;
  dynamic?: boolean; // Scroll Content is changed dynamically.
  fixedIntervalSec?: number;
  scrollUpCallback?: () => void;
  scrollBottomCallback?: () => void;
  intervalCallback?: () => void;
  children: React.ReactChildren | React.ReactChild;
  lenCheck?: number;
  always?: boolean;
  onHoverBarVisible?: boolean;
};

export const DalbitScroll = React.forwardRef((props: ScrollPropsType, ref: any) => {
  const {
    width,
    height,
    displayClassName,
    barWrapClassName,
    barClassName,
    initBarBottom,
    preventAutoHidden,
    dynamic,
    fixedIntervalSec,
    lenCheck,
    always,
    onHoverBarVisible,
    scrollUpCallback,
    scrollBottomCallback,
    intervalCallback,
  } = props;

  const [scrollBottom, setScrollBottom] = useState<boolean>(false);
  const [scrollBarMouseDown, setScrollBarMouseDown] = useState<boolean>(false);
  const [scrollBarVisible, setScrollBarVisible] = useState<boolean>(preventAutoHidden ? preventAutoHidden : false);

  // Only once feature
  const [initBottom, setInitBottom] = useState<boolean>(initBarBottom === true ? initBarBottom : false);

  const previousScrollBottom = usePrevious(scrollBottom);

  const innerRef = useRef<HTMLDivElement>(null);
  const scrollBarWrapRef = useRef<HTMLDivElement>(null);
  const scrollBarRef = useRef<HTMLDivElement>(null);

  const hoverRef = useRef<boolean>(false);

  useImperativeHandle(ref, () => ({
    elem: ref.current,
    scrollToDown: () => {
      const innerElem = innerRef.current;
      const scrollBarElem = scrollBarRef.current;

      if (innerElem !== null && scrollBarElem !== null) {
        const innerScrollTop = innerElem.scrollHeight - innerElem.clientHeight;
        let scrollTop = Math.ceil(innerScrollTop * (innerElem.clientHeight / innerElem.scrollHeight));
        innerElem.scrollTo(0, innerElem.scrollHeight);
        scrollBarElem.style.transform = `translateY(${scrollTop}px)`;
        // setScrollBottom(true);
      }
    },
    getInnerRef: () => {  /* 스크롤 제어용 */
      return innerRef.current;
    }
  }));

  const scrollMove = useCallback(
    (forcePositionY?: number) => {
      const innerElem = innerRef.current;
      const scrollBarElem = scrollBarRef.current;
      if (innerElem !== null && scrollBarElem !== null && innerElem.scrollHeight !== innerElem.clientHeight) {
        if (Math.abs(innerElem.scrollHeight - innerElem.clientHeight - innerElem.scrollTop) <= 2 && innerElem.scrollTop !== 0) {
          if (scrollBottom === false) {
            setScrollBottom(true);
          }
        } else {
          if (scrollBottom === true) {
            setScrollBottom(false);
          }
        }

        if (forcePositionY !== undefined) {
          innerElem.scrollTop = forcePositionY;
          let scrollTop = Math.floor(innerElem.scrollTop * (innerElem.clientHeight / innerElem.scrollHeight));
          scrollBarElem.style.transform = `translateY(${scrollTop}px)`;
        } else {
          requestAnimationFrame(() => {
            if (intervalCallback) {
              intervalCallback();
            }

            if (innerElem !== null && scrollBarElem !== null) {
              if (scrollBottom === false) {
                let scrollTop = Math.ceil(innerElem.scrollTop * (innerElem.clientHeight / innerElem.scrollHeight));
                scrollBarElem.style.transform = `translateY(${scrollTop}px)`;
              }
            }
          });
        }
      }
    },
    [scrollBottom, initBottom]
  );

  const mouseDownEvent = useCallback(
    (e: any) => {
      const scrollBarWrapElem = scrollBarWrapRef.current;
      const scrollBarElem = scrollBarRef.current;
      const target = e.currentTarget;

      e.stopPropagation();
      e.preventDefault();

      if (target === scrollBarElem) {
        if (scrollBarMouseDown === false) {
          setScrollBarMouseDown(true);
          const innerElem = innerRef.current;
          if (innerElem !== null) {
            startTouchY = e.clientY;
            startScrollY = innerElem.scrollTop * (innerElem.clientHeight / innerElem.scrollHeight);
          }
        }
      } else if (target === scrollBarWrapElem) {
        if (scrollBarElem !== null) {
          const innerElem = innerRef.current;
          const barHeight = scrollBarElem.clientHeight;

          if (innerElem !== null) {
            const moveToScroll = (e.nativeEvent.offsetY - barHeight / 2) / (innerElem.clientHeight / innerElem.scrollHeight);
            scrollMove(moveToScroll);
          }
        }
      }
    },
    [scrollMove, scrollBarMouseDown]
  );

  const mouseMoveEvent = useCallback(
    (e: any) => {
      if (scrollBarMouseDown === true) {
        const innerElem = innerRef.current;
        const diff = e.clientY - startTouchY;

        if (innerElem !== null) {
          const moveToScroll = (startScrollY + diff) / (innerElem.clientHeight / innerElem.scrollHeight);
          scrollMove(moveToScroll);
        }
      }
    },
    [scrollMove, scrollBarMouseDown]
  );

  const mouseUpEvent = useCallback(() => {
    setScrollBarMouseDown(false);
  }, []);

  const onScrollEvent = useCallback(
    (e) => {
      scrollMove();
      if (preventAutoHidden !== true) {
        const timeoutSec = 200; // millisec
        if (scroll_debounce_timer !== null) {
          clearTimeout(scroll_debounce_timer);
        }
        setScrollBarVisible(true);
        scroll_debounce_timer = setTimeout(() => {
          if (hoverRef.current === false) {
            setScrollBarVisible(false);
            scroll_debounce_timer = null;
          }
        }, timeoutSec);
      }
    },
    [scrollMove]
  );

  const setScrollBarHeight = () => {
    const innerElem = innerRef.current;
    const scrollBarWrapElem = scrollBarWrapRef.current;
    const scrollBarElem = scrollBarRef.current;

    if (innerElem !== null && scrollBarWrapElem !== null && scrollBarElem !== null) {
      if (always || onHoverBarVisible) {
        setTimeout(() => {
          scrollBarWrapElem.style.display = "block";
          const barHeight = (innerElem.clientHeight / innerElem.scrollHeight) * innerElem.clientHeight;
          scrollBarElem.style.height = `${barHeight}px`;
        });
      } else if (innerElem.scrollHeight > innerElem.clientHeight) {
        scrollBarWrapElem.style.display = "block";
        const barHeight = (innerElem.clientHeight / innerElem.scrollHeight) * innerElem.clientHeight;
        scrollBarElem.style.height = `${barHeight}px`;
      } else {
        scrollBarWrapElem.style.display = "none";
        scrollBarElem.style.height = "0px";
      }

      if (scrollBottom === true) {
        const innerScrollTop = innerElem.scrollHeight - innerElem.clientHeight;
        let scrollTop = Math.ceil(innerScrollTop * (innerElem.clientHeight / innerElem.scrollHeight));
        innerElem.scrollTo(0, innerScrollTop);
        scrollBarElem.style.transform = `translateY(${scrollTop}px)`;
      }
    }
    scrollMove();
  };

  useEffect(() => {
    setScrollBarHeight();
  }, [scrollBottom, dynamic, lenCheck, always]);

  // Compare previous with current scroll bottom
  useEffect(() => {
    if (previousScrollBottom === false && scrollBottom === true) {
      if (scrollBottomCallback) {
        scrollBottomCallback();
      }
    } else if (previousScrollBottom === true && scrollBottom === false) {
      if (scrollUpCallback) {
        scrollUpCallback();
      }
    }
  }, [scrollBottom]);

  useEffect(() => {
    window.addEventListener("mousemove", mouseMoveEvent);
    window.addEventListener("mouseup", mouseUpEvent);
    return () => {
      window.removeEventListener("mousemove", mouseMoveEvent);
      window.removeEventListener("mouseup", mouseUpEvent);
    };
  }, [scrollBarMouseDown]);

  useEffect(() => {
    if (scrollBottom === false && initBottom === true) {
      setScrollBottom(true);
      setInitBottom(false);
    }
  }, []);

  useEffect(() => {
    if (always === true) {
      setScrollBarHeight();
    }
  }, [props.children, always]);

  return (
    <DalbitScrollStyled
      ref={ref}
      className={`scroll-wrap ${displayClassName ? displayClassName : ""}`}
      style={{ width: `${width ? width + "px" : ""}`, height: `${height ? height + "px" : ""}` }}
      onMouseEnter={() => {
        if (onHoverBarVisible) {
          setScrollBarVisible(true);
          hoverRef.current = true;
          setScrollBarHeight();
        }
      }}
      onMouseLeave={() => {
        if (onHoverBarVisible) {
          setScrollBarVisible(false);
          hoverRef.current = false;
        }
      }}
    >
      <div
        ref={innerRef}
        className={`scroll-inner ${isWindows ? "windows" : isMacintosh ? "macintosh" : ""}`}
        onScroll={onScrollEvent}
      >
        {props.children}
      </div>
      <div
        className={`scroll-bar-wrap ${barWrapClassName ? barWrapClassName : ""}`}
        ref={scrollBarWrapRef}
        onMouseDown={mouseDownEvent}
        onMouseUp={mouseUpEvent}
      >
        <div
          ref={scrollBarRef}
          className={`scroll-bar ${barClassName ? barClassName : ""} ${scrollBarVisible ? "visible" : "hidden"}`}
          onMouseDown={mouseDownEvent}
          onMouseUp={mouseUpEvent}
        ></div>
      </div>
    </DalbitScrollStyled>
  );
});

const DalbitScrollStyled = styled.div``;
