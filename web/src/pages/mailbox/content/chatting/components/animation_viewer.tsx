/**
 * @brief : mailbox/chatting/item_animation.tsx
 * @role : 메시지 선물 view
 */
import React, { useRef, useContext, useEffect } from "react";
// ctx
// modules
import LottiePlayer from "lottie-web";
import styled from "styled-components";
// gfunc
import { createElement } from "lib/create_element";
import {useDispatch, useSelector} from "react-redux";
import {setMailBoxGiftItemInfo} from "../../../../../redux/actions/mailBox";
// var
let animationCount = 0;
export default function() {
  //ctx
  const dispatch = useDispatch();
  const mailboxState = useSelector(({mailBoxCtx}) => mailBoxCtx);
  //ref
  const lottieDisplayRef = useRef<any>(null);
  const lottieDisplayWrapRef = useRef<any>(null);
  useEffect(() => {
    let comboIdx = 0;
    if (mailboxState.giftItemInfo) {
      animationCount += 1;
      const lottieDisplayElem = lottieDisplayRef.current;
      const lottieDisplayWrapElem = lottieDisplayWrapRef.current;
      let { lottieUrl, width, height, duration, location, isCombo, webpUrl, itemCnt } = mailboxState.giftItemInfo;
      const animationWrapElem = document.createElement("div");
      animationWrapElem.className = "animation-wrapper";
      lottieDisplayElem.appendChild(animationWrapElem);
      animationWrapElem.style.width = `${width * 0.68}px`;
      animationWrapElem.style.height = `${height * 0.68}px`;
      if (location === "bottomRight") {
        animationWrapElem.classList.add("bottomRight");
        animationWrapElem.style.width = "50%";
        animationWrapElem.style.height = "100%";
        // isCombo = count ? count > 1 : false;
        // duration = count ? (duration ? count * duration : duration) : duration;
      } else if (location === "topLeft") {
        animationWrapElem.classList.add("topLeft");
        animationWrapElem.style.width = "100%";
        animationWrapElem.style.height = "100%";
        // isCombo = count ? count > 1 : false;
        // duration = count ? (duration ? count * duration : duration) : duration;
      } else if (location === "midLeft" && duration && itemCnt) {
        duration = duration * 1000;
        animationWrapElem.classList.add("midLeft");
        animationWrapElem.style.width = "100%";
        const comboHeight = 110;
        animationWrapElem.style.top = `${comboIdx * comboHeight}px`;
        animationWrapElem.innerHTML = `
        <div class="combo_box">
          <div class="user_info">
            <div class="thumb" style="background-image: url(${mailboxState.otherInfo.profImg &&
              mailboxState.otherInfo.profImg})"></div>
            <div class="nick">${mailboxState.otherInfo.nick}</div>
          </div>
        </div>
      `;
        const comboTextWrap = createElement({
          type: "div",
          className: "text-wrap",
          children: [{ type: "div", className: "x-mark" }],
        });
        const comboCountingText = createElement({ type: "div", className: "combo_counting text-animation", text: `${itemCnt}` });
        comboTextWrap.appendChild(comboCountingText);
        animationWrapElem.children[0].appendChild(comboTextWrap);
      }
      lottieDisplayWrapElem.style.zIndex = "1";
      let lottieAnimation;
      if (webpUrl !== "" && webpUrl !== undefined && lottieUrl === "") {
        const webpImg = document.createElement("img");

        webpImg.setAttribute("src", webpUrl);
        webpImg.setAttribute("style", "position: absolute; object-fit: contain; width: inherit; height: inherit;");

        animationWrapElem.appendChild(webpImg);

        lottieAnimation = LottiePlayer.loadAnimation({
          container: animationWrapElem,
          renderer: "svg",
          loop: isCombo ? true : false,
          autoplay: true,
          path: lottieUrl,
        });
      } else {
        lottieAnimation = LottiePlayer.loadAnimation({
          container: animationWrapElem,
          renderer: "svg",
          loop: isCombo ? true : false,
          autoplay: true,
          path: lottieUrl,
        });
      }

      setTimeout(() => {
        if (webpUrl !== "" && webpUrl !== undefined && lottieUrl === "") {
          lottieAnimation.destroy();
          lottieDisplayElem.removeChild(animationWrapElem);
          lottieDisplayWrapElem.style.zIndex = "-1";
        }
      }, duration * 1000);
      const LottieComplete = () => {
        lottieAnimation.destroy();
        lottieDisplayElem.removeChild(animationWrapElem);
        lottieDisplayWrapElem.style.zIndex = "-1";
      };
      let realCount = 0;
      const LottieLoopComplete = () => {
        ++realCount;
        if (itemCnt === realCount) {
          lottieAnimation.destroy();
          lottieDisplayElem.removeChild(animationWrapElem);
          lottieDisplayWrapElem.style.zIndex = "-1";
        }
      };
      const LottieDestroy = () => {
        lottieAnimation.removeEventListener("complete", LottieComplete);
        lottieAnimation.removeEventListener("loopComplete", LottieLoopComplete);
        dispatch(setMailBoxGiftItemInfo(null));
      };

      lottieAnimation.addEventListener("complete", LottieComplete);
      lottieAnimation.addEventListener("loopComplete", LottieLoopComplete);

      lottieAnimation.addEventListener("destroy", LottieDestroy);

      return () => {
        lottieAnimation.destroy();
      };
    }
  }, [mailboxState.giftItemInfo]);

  // 아이템영역
  return (
    <LottieDisplayStyledWrap ref={lottieDisplayWrapRef}>
      <div>
        <LottieDisplayStyled ref={lottieDisplayRef} id="mail-animation" />
      </div>
    </LottieDisplayStyledWrap>
  );
}
const LottieDisplayStyledWrap = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-between;
  width: 460px;
  height: calc(100vh - 56px);
  z-index: -1;
  & > div {
    position: relative;
    display: flex;
    align-items: center;
    width: 460px;
  }
`;
const LottieDisplayStyled = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  bottom: 0;

  .animation-wrapper {
    position: absolute;

    .combo_box {
      display: block;
    }

    &.bottomRight {
      right: 0;
      bottom: 0;
    }

    &.topLeft {
      top: 0;
      left: 0;
    }

    &.midLeft {
      left: 0px;
      > svg {
        width: auto;
        margin-left: 54px;
      }
      .combo_box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: absolute;
        margin: 16px 0 0 16px;
        width: 92%;
        height: 68px;
        padding: 10px 20px 10px 12px;
        border-radius: 50px;
        background-image: linear-gradient(to right, #fdad2b, #db233f);
        color: #fff;
        box-sizing: border-box;

        .user_info {
          display: flex;
          align-items: center;

          .thumb {
            width: 48px;
            height: 48px;
            margin-right: 6px;
            background-size: cover;
            border-radius: 50%;
          }

          .nick {
            width: 160px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            word-wrap: normal;
            font-size: 20px;
          }
        }

        .text-wrap {
          display: flex;
          flex-direction: row;
          align-items: center;

          .x-mark {
            content: "";
            display: block;
            left: -10px;
            width: 18px;
            height: 18px;
            background: url("https://image.dalbitlive.com/svg/itemmulitiply.svg") no-repeat;
            background-size: cover;
          }

          .combo_counting {
            position: relative;
            width: 72px;
            text-align: center;
            font-weight: 500;
            font-size: 40px;
            letter-spacing: -1px;
          }
        }
      }
    }

    .content-wrap {
      margin: 0 auto;
    }
  }

  /* .midLeft + .midLeft {
    top: 100px !important;
  }

  .midLeft + .midLeft + .midLeft {
    top: 200px !important;
  } */
`;
