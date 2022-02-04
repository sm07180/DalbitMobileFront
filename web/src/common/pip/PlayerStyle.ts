import styled from "styled-components";

export const PlayerAudioStyled = styled.div`
  position: fixed;
  left: 50%;
  margin-left: -220px;
  bottom: 20px;
  width: 440px;
  height: 64px;
  z-index: 4;
  background-color: rgba(0, 0, 0, 0.85);
  color: #fff;
  border-radius: 44px;
  cursor: pointer;

  /* player에 들어가는 움직이는 equalizer bar */
  @keyframes equalizer-bar {
    0% {
      height: 5px;
    }
    10% {
      height: 7px;
    }
    20% {
      height: 9px;
    }
    30% {
      height: 4px;
    }
    40% {
      height: 11px;
    }
    50% {
      height: 13px;
    }
    60% {
      height: 7px;
    }
    70% {
      height: 12px;
    }
    80% {
      height: 9px;
    }
    90% {
      height: 7px;
    }
    100% {
      height: 4px;
    }
  }

  .inner-player {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0px 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;

    .info-wrap {
      display: flex;
      flex-direction: row;
      align-items: center;
      .equalizer {
        width: 36px;
        height: 36px;
        margin-right: 8px;
        color: #fdad2b;
        text-align: center;
        display: flex;
        flex-direction: column;

        ul {
          padding-top: 1px;
          height: 14px;
          width: 20px;
          margin: 0 auto;
          padding: 0 0 0 0;
          position: relative;
          li {
            width: 2px;
            float: left;
            margin: 0 2px 0 0;
            padding: 0;
            height: 14px;
            position: relative;
            list-style-type: none;
            span {
              display: block;
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              height: 14px;
              background: #fdad2b;
              transform: none;
            }
          }
          li:nth-child(1) span {
            animation: equalizer-bar 2s 1s ease-out alternate infinite;
          }
          li:nth-child(2) span {
            animation: equalizer-bar 2s 0.5s ease-out alternate infinite;
          }
          li:nth-child(3) span {
            animation: equalizer-bar 2s 1.5s ease-out alternate infinite;
          }
          li:nth-child(4) span {
            animation: equalizer-bar 2s 0.25s ease-out alternate infinite;
          }
          li:nth-child(5) span {
            animation: equalizer-bar 2s 2s ease-out alternate infinite;
          }
        }
        p {
          margin-top: auto;
          padding-top: 6px;
          font-size: 11px;
        }
      }

      .thumb {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        margin-right: 16px;
        background: #ccc;
        border-radius: 50%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        &::before {
          position: absolute;
          content: "";
          /* background: rgba(0, 0, 0, 0.3); */
          width: 100%;
          height: 100%;
          z-index: 4;
        }
        .playToggle__play,
        .playToggle__stop {
          position: relative;
          padding: 10px;
          z-index: 5;

          &.video {
            background: rgba(0, 0, 0, 0.1);
          }
        }
      }

      .room-info {
        width: 256px;
        font-size: 13px;
        letter-spacing: -0.35px;

        .title {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 3px;
          font-size: 16px;
          font-weight: 300;
        }
        p {
          font-weight: 300;
        }
      }

      .counting {
        span {
          display: inline-block;
          margin-right: 18px;

          img {
            vertical-align: middle;
            display: inline-block;
            margin-right: 5px;
          }
        }
      }
    }

    .close-btn {
      display: block;
      cursor: pointer;
    }
  }
`;
export const PlayerVideoStyled = styled.div`
  overflow: hidden;
  position: fixed;
  left: 50%;
  margin-left: 365px;
  bottom: 20px;
  transform: translate(-50%);
  width: 240px;
  height: 360px;
  border-radius: 10px;
  cursor: pointer;

  &.back {
    background-color: black;
  }

  #videoViewer {
    position: absolute;
    width: 240px !important;
    top: 50%;
    transform: translate(0, -50%);
  }

  #deepar-canvas {
    position: absolute;
    opacity: 0;
  }

  video {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &.unVisible {
    video {
      opacity: 0;
    }
  }

  .playToggle__play {
    position: relative;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    text-align: center;

    .playBox {
      text-align: center;
      top: -50%;
      left: -50%;
      transform: translate(0%, 125%);

      p {
        display: inline-block;
        height: 25px;
        margin-top: 20px;
        padding: 0 6px;
        line-height: 25px;
        border-radius: 18px;
        font-size: 12px;
        color: #fff;
        background: #000;
      }
    }

    &.auto {
      .playBox {
        transform: translate(0%, 312%);
      }
    }
  }

  .close-btn {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
  }
`;
export const NoticeDisplayStyled = styled.div`
  position: absolute;
  width: calc(100% - 26px);
  top: 100px;
  left: 13px;
  & > div {
    display: block;
    position: absolute;
    width: 100%;
    height: 36px;
    padding: 6px 12px;
    align-items: center;
    background-color: rgb(236, 69, 95);
    border-radius: 10px;
    box-sizing: border-box;
    color: #fff;
    text-align: center;
    font-size: 14px;
    line-height: 24px;

    .close-img {
      position: absolute;
      top: 9px;
      right: 18px;
      cursor: pointer;
    }
  }
  z-index: 3;
`;
export const thumbInlineStyle = (target)=>{
  return { backgroundImage: `url(${target["thumb120x120"]})` };
}
