import React, { useEffect, useState, useRef, useContext } from 'react';
import styled from 'styled-components';
import Lottie from 'react-lottie';
import { Context } from 'context';

//context
import { useHistory } from 'react-router-dom';
import Room, { RoomJoin } from 'context/room';

// component
import { IMG_SERVER } from 'context/config';
import { Hybrid, isHybrid } from 'context/hybrid';

// static
import animationData from '../static/ic_live.json';
import EventIcon from '../static/ic_event.png';
import RefreshIcon from '../static/ic_arrow_refresh.svg';

let touchStartX = null;
let touchEndX = null;

let touchStartY = null;
let touchEndY = null;

let touchStartStatus = false;
let direction = null;

let scrollDirection = null;

let intervalId = null;
const intervalSec = 5000;
const recommendWrapBaseHeight = 310;

export default (props) => {
  const context = useContext(Context);
  const { list, setMainInitData } = props;
  const history = useHistory();
  const [selectedBIdx, setSelectedBIdx] = useState(null);
  const [blobList, setBlobList] = useState([]);

  const recommendWrapRef = useRef();
  const slideWrapRef = useRef();
  const refreshIconRef = useRef();

  const emojiSplitRegex = /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g;

  const touchStartEvent = (e) => {
    if (touchStartStatus === true) {
      return;
    }

    if (Array.isArray(list) && list.length > 1) {
      touchStartStatus = true;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;

      if (intervalId) {
        clearInterval(intervalId);
      }
      intervalId = null;
    }
  };

  const touchMoveEvent = (e) => {
    if (touchStartStatus === false) {
      return;
    }

    const recommendWrapNode = recommendWrapRef.current;
    const slideWrapNode = slideWrapRef.current;
    const refreshIconNode = refreshIconRef.current;

    touchEndX = e.touches[0].clientX;
    touchEndY = e.touches[0].clientY;

    const baseWidth = slideWrapNode.clientWidth / 3;
    const diff = touchEndX - touchStartX;
    const calcX = `${-baseWidth + diff}px`;

    const heightDiff = touchEndY - touchStartY;

    if (scrollDirection === null) {
      if (heightDiff > 10) {
        scrollDirection = 'down';
      } else if (Math.abs(diff) > 20) {
        scrollDirection = 'side';
      }
    }

    if (scrollDirection === 'down') {
      recommendWrapNode.style.height = `${
        recommendWrapBaseHeight + heightDiff
      }px`;
      refreshIconNode.style.transform = `rotate(${-heightDiff}deg)`;
      refreshIconNode.style.opacity = 1;
    } else if (scrollDirection === 'side') {
      slideWrapNode.style.transform = `translate3d(${calcX}, 0, 0)`;
      slideWrapNode.style.transitionDuration = '0ms';
    }
  };

  const touchEndEvent = async (e) => {
    if (touchStartStatus === false) {
      return;
    }

    const recommendWrapNode = recommendWrapRef.current;
    const slideWrapNode = slideWrapRef.current;
    const refreshIconNode = refreshIconRef.current;

    const baseWidth = slideWrapNode.clientWidth / 3;

    const halfBaseWidth = baseWidth / 16;
    const diff = touchEndX - touchStartX;
    direction = diff > 0 ? 'right' : 'left';
    const absDiff = Math.abs(diff);

    if (scrollDirection === 'down') {
      const transitionTime = 150;

      // Reset init data
      if (recommendWrapNode.clientHeight > recommendWrapBaseHeight + 200) {
        let degree = 0;
        const tempIntevalId = setInterval(() => {
          if (Math.abs(degree) === 360) {
            degree = 0;
          }
          degree -= 30;
          refreshIconNode.style.transform = `rotate(${degree}deg)`;
        }, 50);

        const result = await setMainInitData();
        clearInterval(tempIntevalId);
      }

      const promiseSync = new Promise((resolve, reject) => {
        recommendWrapNode.style.transitionDuration = `${transitionTime}ms`;
        recommendWrapNode.style.height = `${recommendWrapBaseHeight}px`;

        setTimeout(() => resolve(), transitionTime);
      });
      promiseSync.then(() => {
        recommendWrapNode.style.transitionDuration = `0ms`;
        recommendWrapNode.style.height = `${recommendWrapBaseHeight}px`;
        refreshIconNode.style.opacity = 0;
        refreshIconNode.style.transform = `rotate(0)`;
        touchStartStatus = false;
        scrollDirection = null;
      });
    }

    if (scrollDirection === 'side') {
      const slidingTime = 150; // unit is ms
      const promiseSync = new Promise((resolve, reject) => {
        slideWrapNode.style.transitionDuration = `${slidingTime}ms`;

        if (absDiff >= halfBaseWidth) {
          if (direction === 'left') {
            slideWrapNode.style.transform = `translate3d(${
              -baseWidth * 2
            }px, 0, 0)`;
          } else if (direction === 'right') {
            slideWrapNode.style.transform = `translate3d(0, 0, 0)`;
          }
        } else {
          slideWrapNode.style.transform = `translate3d(${-baseWidth}px, 0, 0)`;
        }
        setTimeout(() => resolve(), slidingTime);
      });

      promiseSync.then(() => {
        if (absDiff >= halfBaseWidth) {
          if (direction === 'right') {
            const targetBIdx = Number(
              slideWrapNode.firstChild.getAttribute('b-idx')
            );
            setSelectedBIdx(targetBIdx);
          } else if (direction === 'left') {
            const targetBIdx = Number(
              slideWrapNode.lastChild.getAttribute('b-idx')
            );
            setSelectedBIdx(targetBIdx);
          }

          slideWrapNode.style.transitionDuration = '0ms';
          slideWrapNode.style.transform = 'translate3d(-33.3334%, 0, 0)';
        }

        if (intervalId === null) {
          initInterval();
        }
        touchStartStatus = false;
        scrollDirection = null;
      });
    }

    scrollDirection = 'ing';
  };

  const initInterval = () => {
    const slidingTime = 150; // unit is ms

    intervalId = setInterval(() => {
      const slideWrapNode = slideWrapRef.current;
      const baseWidth = slideWrapNode.clientWidth / 3;

      if (!touchStartStatus) {
        const promiseSync = new Promise((resolve, reject) => {
          touchStartStatus = true;
          slideWrapNode.style.transitionDuration = `${slidingTime}ms`;
          slideWrapNode.style.transform = `translate3d(${
            -baseWidth * 2
          }px, 0, 0)`;
          setTimeout(() => resolve(), slidingTime);
        });

        promiseSync.then(() => {
          setSelectedBIdx((selectedBIdx) => {
            const nextIdx = selectedBIdx + 1;
            if (nextIdx < list.length) {
              return nextIdx;
            } else {
              return 0;
            }
          });

          slideWrapNode.style.transitionDuration = '0ms';
          slideWrapNode.style.transform = 'translate3d(-33.3334%, 0, 0)';
          touchStartStatus = false;
        });
      }
    }, intervalSec);
  };

  function clearBannerImgDiskCache() {
    if (window.localStorage.getItem('bannerList')) {
      const list = JSON.parse(window.localStorage.getItem('bannerList'));
      list.forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
      localStorage.removeItem('bannerList');
    }
  }

  useEffect(() => {
    const tempBlobList = [];
    if (Array.isArray(list) && list.length) {
      setSelectedBIdx(0);

      clearBannerImgDiskCache();

      let count = 0;
      list.forEach((line, idx) => {
        const { bannerUrl } = line;
        fetch(bannerUrl)
          .then((res) => res.blob())
          .then((blob) => {
            count++;
            const cacheUrl = URL.createObjectURL(blob);
            tempBlobList[idx] = cacheUrl;
            if (count === list.length) {
              setBlobList(tempBlobList);
              localStorage.setItem('bannerList', JSON.stringify(tempBlobList));
            }
          })
          .catch(() => {
            count++;
            if (count === list.length) {
              setBlobList(tempBlobList);
              localStorage.setItem('bannerList', JSON.stringify(tempBlobList));
            }
          });
      });

      // initInterval()

      return () => {
        clearInterval(intervalId);
        intervalId = null;
      };
    }
  }, [list]);

  useEffect(() => {
    const swiperNode = document.getElementsByClassName('dalbit-swiper')[0];
    if (swiperNode && direction !== null) {
      touchStartX = null;
      touchEndX = null;
      touchStartY = null;
      touchEndY = null;

      touchStartStatus = false;
      direction = null;
    }
  }, [selectedBIdx]);

  if (selectedBIdx === null) {
    return null;
  }

  const prevBIdx = selectedBIdx - 1 >= 0 ? selectedBIdx - 1 : list.length - 1;
  const nextBIdx = selectedBIdx + 1 < list.length ? selectedBIdx + 1 : 0;
  //클릭 배너 이동
  const { customHeader, token } = context || Room.context;
  const clickSlideDisplay = (data) => {
    const { roomType, roomNo } = data;

    if (roomType === 'link') {
      const { roomNo } = data;
      context.action.updatenoticeIndexNum(roomNo);
      if (roomNo !== '' && !roomNo.startsWith('http')) {
        history.push(`${roomNo}`);
      } else if (roomNo !== '' && roomNo.startsWith('http')) {
        window.location.href = `${roomNo}`;
      }
    } else {
      if (isHybrid() && roomNo) {
        RoomJoin(roomNo);
      }
    }
  };

  return (
    <>
      <RecommendWrap ref={recommendWrapRef}>
        <Room />
        <div className="selected-wrap">
          {Array.isArray(list) && list.length > 0 && (
            <>
              <div
                ref={slideWrapRef}
                className="slide-wrap"
                onTouchStart={touchStartEvent}
                onTouchMove={touchMoveEvent}
                onTouchEnd={touchEndEvent}
              >
                <div
                  className="broad-slide"
                  b-idx={prevBIdx}
                  style={{
                    backgroundImage: `url(${
                      blobList[prevBIdx]
                        ? blobList[prevBIdx]
                        : list[prevBIdx]['bannerUrl']
                    })`,
                  }}
                  onClick={() => clickSlideDisplay(list[prevBIdx])}
                >
                  <div className="text-wrap">
                    <div className="selected-title">
                      {list[prevBIdx]['title']}
                    </div>
                    {list[prevBIdx]['nickNm'] !== 'banner' && (
                      <div className="selected-nickname">
                        {list[prevBIdx]['nickNm']
                          .split(emojiSplitRegex)
                          .map((str, idx) => {
                            // 🎉😝pqpq😝🎉
                            // https://stackoverflow.com/questions/43242440/javascript-unicode-emoji-regular-expressions
                            return <span key={`splited-${idx}`}>{str}</span>;
                          })}
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className="broad-slide"
                  b-idx={selectedBIdx}
                  style={{
                    backgroundImage: `url(${
                      blobList[selectedBIdx]
                        ? blobList[selectedBIdx]
                        : list[selectedBIdx]['bannerUrl']
                    })`,
                  }}
                  onClick={() => clickSlideDisplay(list[selectedBIdx])}
                >
                  <div className="text-wrap">
                    <div className="selected-title">
                      {list[selectedBIdx]['title']}
                    </div>
                    {list[selectedBIdx]['nickNm'] !== 'banner' && (
                      <div className="selected-nickname">
                        {list[selectedBIdx]['nickNm']
                          .split(emojiSplitRegex)
                          .map((str, idx) => {
                            return <span key={`splited-${idx}`}>{str}</span>;
                          })}
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className="broad-slide"
                  b-idx={nextBIdx}
                  style={{
                    backgroundImage: `url(${
                      blobList[nextBIdx]
                        ? blobList[nextBIdx]
                        : list[nextBIdx]['bannerUrl']
                    })`,
                  }}
                  onClick={() => clickSlideDisplay(list[nextBIdx])}
                >
                  <div className="text-wrap">
                    <div className="selected-title">
                      {list[nextBIdx]['title']}
                    </div>
                    {list[nextBIdx]['nickNm'] !== 'banner' && (
                      <div className="selected-nickname">
                        {list[nextBIdx]['nickNm']
                          .split(emojiSplitRegex)
                          .map((str, idx) => {
                            return <span key={`splited-${idx}`}>{str}</span>;
                          })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
          {list[selectedBIdx]['nickNm'] !== 'banner' ? (
            <span className="live-icon">
              <Lottie
                options={{
                  width: 51,
                  height: 16,
                  loop: true,
                  autoPlay: true,
                  animationData: animationData,
                }}
              />
            </span>
          ) : (
            // <img className="live-icon" src={LiveIcon} />
            <img className="live-icon" src={EventIcon} />
          )}
          {list[selectedBIdx]['isSpecial'] === true && (
            <em className="specialIcon">스페셜DJ</em>
          )}
          {Array.isArray(list) && list.length > 0 && (
            <div className="counting">
              <span className="bold">{selectedBIdx + 1}</span>
              <span>{list ? `/ ${list.length}` : ''}</span>
            </div>
          )}
        </div>

        <div className="icon-wrap">
          <img
            className="arrow-refresh-icon"
            src={RefreshIcon}
            ref={refreshIconRef}
          />
        </div>
      </RecommendWrap>
    </>
  );
};

const RecommendWrap = styled.div`
  position: relative;
  height: 310px;
  min-height: 310px;
  /* max-height: 400px; */
  margin-top: -42px;
  transition: height 0ms cubic-bezier(0.26, 0.26, 0.69, 0.69) 0s;

  .icon-wrap {
    display: block;
    position: absolute;
    top: 67px;
    left: 50%;

    .arrow-refresh-icon {
      display: block;
      position: relative;
      left: -50%;
      opacity: 0;
      transition: opacity 200ms ease-in;
    }
  }

  .selected-wrap {
    position: relative;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    overflow: hidden;

    .slide-wrap {
      transition: all 0ms cubic-bezier(0.26, 0.26, 0.69, 0.69) 0s;
      position: absolute;
      width: 300%;
      height: 100%;
      transform: translate3d(-33.3334%, 0, 0);
      display: flex;
      flex-direction: row;

      .broad-slide {
        position: relative;
        width: 33.3334%;
        height: 100%;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
      }
    }

    .live-icon {
      position: absolute;
      top: 51px;
      left: 8px;
      width: 51px;
    }

    .specialIcon {
      position: absolute;
      top: 51px;
      left: 64px;
      display: inline-block;
      width: 62px;
      height: 16px;
      margin-left: 4px;
      border-radius: 10px;
      background-color: #ec455f;
      color: #fff;
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.33;
      letter-spacing: normal;
      text-align: center;
    }

    .counting {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      width: 46px;
      height: 16px;
      right: 8px;
      top: 51px;
      border-radius: 10px;
      background-color: rgba(0, 0, 0, 0.5);
      font-size: 10px;
      color: rgba(255, 255, 255, 0.5);

      .bold {
        color: #fff;
        margin-right: 4px;
      }
    }
  }

  .text-wrap {
    position: absolute;
    width: 100%;
    height: 100px;
    padding-top: 30px;
    background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.25) 34%,
      rgba(0, 0, 0, 0.6)
    );
    bottom: 0;
  }

  .selected-title {
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: -0.4px;
    text-align: center;
    transform: skew(-0.03deg);
  }
  .selected-nickname {
    color: #ffb300;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: -0.35px;
    text-align: center;
    transform: skew(-0.03deg);

    span {
      vertical-align: middle;
    }
  }
`;
