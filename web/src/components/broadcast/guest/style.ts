import styled from "styled-components";

export const GuestWrapStyled = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex: 1;
  z-index: 1;

  .guestIconWrap {
    display: flex;
    margin-bottom: 5px;
    background-color: #000;
    border-radius: 30px;
    .guestGift {
      display: inline-block;
      margin: 0 12px;
      img {
        width: 32px;
        height: 32px;
      }
    }
    .guestImageWrap {
      display: block;
      text-align: right;
      cursor: pointer;
    }
    .guestImg {
      display: inline-block;
      width: 62px;
      height: 62px;
      border-radius: 50%;
      cursor: pointer;
    }

    .equalizer {
      position: absolute;
      animation: roll linear 2s infinite;
      @keyframes roll {
        from {
          transform: rotate(0deg);
        }

        to {
          transform: rotate(359deg);
        }
      }
    }
  }
  .guestBtnWrap {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .hintIcon {
      width: 28px;
      height: 28px;
      margin-right: 6px;
      cursor: pointer;
    }
    & > button {
      position: relative;
      width: 62px;
      height: 28px;
      background-color: rgb(0, 0, 0, 0.2);
      border-radius: 24px;
      color: #fff;
      font-size: 13px;
      line-height: 26px;
      text-align: center;
      .guestAlarm {
        position: absolute;
        left: 0;
      }

      & > img[alt="G"] {
        display: inline-block;
        width: 24px;
        height: 24px;
        margin-top: -2px;
        vertical-align: middle;
      }
    }
  }

  .guestBtnToggle {
    position: absolute;
    top: 66px;
    right: 0;
    padding: 4px 6px;
    background: #000;
    border-radius: 40px;

    button + button {
      margin-left: 4px;
    }

    img {
      vertical-align: middle;
    }
  }
`;
