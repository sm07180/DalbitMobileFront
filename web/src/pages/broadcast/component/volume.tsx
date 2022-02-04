import React, { useState, useEffect, useRef, useImperativeHandle, useMemo, useCallback } from "react";
import styled from "styled-components";

// static
import VolumeIcon from "../static/ic_volume.svg";
import VolumeOffIcon from "../static/ic_volume_off.svg";

// others
type VolumeBarPropType = {
  visible: boolean;
  currentVolume: number;
  iconClick: (e: any) => void;
  onChange: (value: number) => void;
  setVolumeBarDown: (value: boolean) => void;
};

// export default function VolumeBar(props: VolumeBarPropType) {
const VolumeBar = React.forwardRef((props: VolumeBarPropType, ref: any) => {
  const innerBarRef = useRef<HTMLDivElement>(null);
  const showingBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const circleBtnRef = useRef<HTMLDivElement>(null);

  const [circleDown, setCircleDown] = useState<boolean>(false);
  const [downStartY, setDownStartY] = useState<number>(0);
  const [barStartHeight, setBarStartHeight] = useState<number>(0);
  const [currentVolume, setCurrentVolume] = useState<number>(props.currentVolume);

  useImperativeHandle(ref, () => ({
    circleDown,
  }));

  const addStopPropagation = (e: any) => {
    e.stopPropagation();
  };

  const volumeBarDownEvent = (e: any) => {
    if (circleDown === false) {
      const volumeBarElem = volumeBarRef.current;
      if (volumeBarElem !== null) {
        setCircleDown(true);
        setDownStartY(e.clientY);
        setBarStartHeight(volumeBarElem.clientHeight);
        props.setVolumeBarDown(true);
      }
    }
  };

  const mouseClickEvent = useCallback(() => {
    if (circleDown === true) {
      setCircleDown(false);
      props.setVolumeBarDown(false);
    }
  }, [circleDown]);

  const volumeBtnMouseMoveEvent = (e: any) => {
    e.preventDefault();

    if (circleDown === true) {
      const circleBtnElem = circleBtnRef.current;
      const showingBarElem = showingBarRef.current;
      const volumeBarElem = volumeBarRef.current;

      if (circleBtnElem !== null && showingBarElem !== null && volumeBarElem !== null) {
        const MaxBarHeight = 88;
        const circleMinSpacing = 7;
        const minimumSpacing = 8;

        let barHeight = barStartHeight + downStartY - e.clientY;
        if (barHeight >= MaxBarHeight - minimumSpacing) {
          barHeight = MaxBarHeight;
        } else if (barHeight <= minimumSpacing) {
          barHeight = 0;
        }

        const volume = barHeight / showingBarElem.clientHeight;
        setCurrentVolume(volume);

        volumeBarElem.style.height = `${barHeight}px`;
        circleBtnElem.style.bottom = `${barHeight - circleMinSpacing}px`;
      }
    }
  };

  const innerBarClickEvent = (e: any) => {
    const circleBtnElem = circleBtnRef.current;
    const showingBarElem = showingBarRef.current;
    const volumeBarElem = volumeBarRef.current;
    const target = e.target;

    if (circleBtnElem !== null && showingBarElem !== null && volumeBarElem !== null) {
      const targetHeight = target.clientHeight;
      const MaxBarHeight = 88;
      const circleMinSpacing = 7;
      const minimumSpacing = 8;

      let barHeight = targetHeight - e.nativeEvent.offsetY;

      if (barHeight >= MaxBarHeight - minimumSpacing) {
        barHeight = MaxBarHeight;
      } else if (barHeight <= minimumSpacing) {
        barHeight = 0;
      }

      const volume = barHeight / showingBarElem.clientHeight;
      setCurrentVolume(volume);

      volumeBarElem.style.height = `${barHeight}px`;
      circleBtnElem.style.bottom = `${barHeight - circleMinSpacing}px`;
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", volumeBtnMouseMoveEvent);
    window.addEventListener("click", mouseClickEvent);

    return () => {
      window.removeEventListener("mousemove", volumeBtnMouseMoveEvent);
      window.removeEventListener("click", mouseClickEvent);
    };
  }, [circleDown]);

  useEffect(() => {
    props.onChange(currentVolume);
  }, [currentVolume]);

  const barHeight = useMemo(() => 88 * currentVolume, [props.visible]);
  const circleMinSpacing = 7;

  return (
    <VolumeWrapper>
      <img className="icon" src={currentVolume === 0 ? VolumeOffIcon : VolumeIcon} onClick={props.iconClick} />
      {props.visible === true && (
        <VolmeBar onClick={addStopPropagation} onMouseUp={mouseClickEvent}>
          <div className="inner-bar" ref={innerBarRef} onClick={innerBarClickEvent}>
            <div className="showing-bar" ref={showingBarRef}>
              <div ref={volumeBarRef} className="volume-bar" style={{ height: `${barHeight}px` }}></div>
            </div>
            <div
              ref={circleBtnRef}
              className="circle-btn"
              onMouseDown={volumeBarDownEvent}
              onClick={addStopPropagation}
              style={{ bottom: `${barHeight - circleMinSpacing}px` }}
            >
              <div className="core"></div>
            </div>
          </div>
        </VolmeBar>
      )}
    </VolumeWrapper>
  );
});

export default VolumeBar;

const VolumeWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;

  .icon {
    cursor: pointer;
  }
`;

const VolmeBar = styled.div`
  position: absolute;
  top: -105px;
  left: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 106px;
  border-radius: 8px;
  background-color: #000;

  .inner-bar {
    position: relative;
    width: 14px;
    height: 88px;
    padding: 0px 5px;
    box-sizing: border-box;
    cursor: pointer;

    .showing-bar {
      position: relative;
      width: 4px;
      height: 100%;
      border-radius: 50px;
      background-color: #bdbdbd;

      .volume-bar {
        position: absolute;
        width: 100%;
        height: 100%;
        bottom: 0;
        border-radius: 50px;
        background-color: #fdad2b;
      }
    }

    .circle-btn {
      position: absolute;
      left: 0px;
      bottom: 81px;
      width: 14px;
      height: 14px;
      padding: 2px;
      border-radius: 50%;
      box-sizing: border-box;
      cursor: pointer;

      .core {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #fdad2b;
      }
    }
  }
`;
