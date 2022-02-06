import React, { useRef, useContext, useEffect, useCallback } from "react";
import styled from "styled-components";
import LottiePlayer from "lottie-web";
import { ClipContext } from "context/clip_ctx";
import { createElement } from "lib/create_element";

export default function ClipAnimationViewer() {
  const { clipState } = useContext(ClipContext);
  const { lottie } = clipState;

  const lottieDisplayRef = useRef<any>(null);
  const lottieDisplayWrapRef = useRef<any>(null);

  const comboPositionActive = [false, false, false, false];
  let animationCount = 0;

  useEffect(() => {
    const delayTime = 400;
    let comboIdx = 0;

    function comboCountingTextChange(targetElem: Element, count: number) {
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          if (targetElem) {
            targetElem.textContent = String(i + 1);
          }
        }, delayTime * i);

        if (i + 1 === count) {
          if (targetElem) {
            setTimeout(() => targetElem.classList.remove("text-animation"), delayTime * (i + 1));
          }
        }
      }
    }

    if (lottie) {
      animationCount += 1;
      const lottieDisplayElem = lottieDisplayRef.current;
      const lottieDisplayWrapElem = lottieDisplayWrapRef.current;
      let { lottieUrl, width, height, duration, location, isCombo, count, nickName, profImg, webpUrl } = lottie;
      const animationWrapElem = document.createElement("div");
      animationWrapElem.className = "animation-wrapper";
      lottieDisplayElem.appendChild(animationWrapElem);

      animationWrapElem.style.width = `${width}px`;
      animationWrapElem.style.height = `${height}px`;

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
      } else if (location === "midLeft" && isCombo === true && duration && count) {
        duration = duration + count * delayTime;
        animationWrapElem.classList.add("midLeft");
        animationWrapElem.style.width = "100%";

        if (comboPositionActive[0] === false) {
          comboPositionActive[0] = true;
          comboIdx = 0;
        } else if (comboPositionActive[0] === true && comboPositionActive[1] === false) {
          comboPositionActive[1] = true;
          comboIdx = 1;
        } else if (comboPositionActive[0] === true && comboPositionActive[1] === true && comboPositionActive[2] === false) {
          comboPositionActive[2] = true;
          comboIdx = 2;
        } else if (
          comboPositionActive[0] === true &&
          comboPositionActive[1] === true &&
          comboPositionActive[2] === true &&
          comboPositionActive[3] === false
        ) {
          comboPositionActive[3] = true;
          comboIdx = 3;
        }

        const comboHeight = 110;
        animationWrapElem.style.top = `${comboIdx * comboHeight}px`;

        animationWrapElem.innerHTML = `
        <div class="combo_box">
          <div class="user_info">
            <div class="thumb" style="background-image: url(${profImg})"></div>
            <div class="nick">${nickName}</div>
          </div>
        </div>
      `;

        const comboTextWrap = createElement({
          type: "div",
          className: "text-wrap",
          children: [{ type: "div", className: "x-mark" }],
        });
        const comboCountingText = createElement({ type: "div", className: "combo_counting text-animation", text: "1" });
        comboTextWrap.appendChild(comboCountingText);
        animationWrapElem.children[0].appendChild(comboTextWrap);
        count && comboCountingTextChange(comboCountingText, count);
      }

      lottieDisplayWrapElem.style.zIndex = "2";

      let lottieAnimation;
      if (webpUrl !== "" && webpUrl !== undefined && lottieUrl === "") {
        const webpImg = document.createElement("img");
        webpImg.setAttribute("src", webpUrl);
        webpImg.setAttribute("style", "position: absolute; object-fit: contain; width: inherit; height: inherit;");
        animationWrapElem.appendChild(webpImg);
        duration = duration! * count! * 1000;
      }

      lottieAnimation = LottiePlayer.loadAnimation({
        container: animationWrapElem,
        renderer: "svg",
        loop: isCombo ? true : false,
        autoplay: true,
        path: lottieUrl,
      });

      setTimeout(() => {
        if (webpUrl !== "" && webpUrl !== undefined && lottieUrl === "") {
          LottieComplete();
        }
      }, duration);

      const LottieComplete = () => {
        lottieAnimation.destroy();
        lottieDisplayElem.removeChild(animationWrapElem);
        lottieDisplayWrapElem.style.zIndex = "-1";
      };
      let realCount = 0;
      const LottieLoopComplete = () => {
        ++realCount;
        if (count === realCount) {
          lottieAnimation.destroy();
          lottieDisplayElem.removeChild(animationWrapElem);
          lottieDisplayWrapElem.style.zIndex = "-1";
        }
      };

      const LottieDestroy = () => {
        lottieAnimation.removeEventListener("complete", LottieComplete);
        lottieAnimation.removeEventListener("loopComplete", LottieLoopComplete);
      };

      lottieAnimation.addEventListener("complete", LottieComplete);
      lottieAnimation.addEventListener("loopComplete", LottieLoopComplete);

      lottieAnimation.addEventListener("destroy", LottieDestroy);

      return () => {
        lottieAnimation.destroy();
      };
    }
  }, [lottie]);

  return (
    <LottieDisplayStyledWrap ref={lottieDisplayWrapRef}>
      <div>
        <LottieDisplayStyled ref={lottieDisplayRef} id="clip-animation" />
      </div>
    </LottieDisplayStyledWrap>
  );
}
const LottieDisplayStyledWrap = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-between;
  width: 1186px;
  height: calc(100vh - 56px);
  z-index: -1;
  & > div {
    position: relative;
    display: flex;
    align-items: center;
    width: 800px;
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
      left: 0;

      .combo_box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: absolute;
        margin: 16px 0 0 16px;
        width: 660px;
        height: 88px;
        padding: 12px 20px 12px 12px;
        border-radius: 50px;
        background-image: linear-gradient(to right, #fdad2b, #db233f);
        color: #fff;
        box-sizing: border-box;

        .user_info {
          display: flex;
          align-items: center;

          .thumb {
            width: 68px;
            height: 68px;
            margin-right: 16px;
            background-size: cover;
            border-radius: 50%;
          }

          .nick {
            width: 220px;
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
            left: -32px;
            width: 18px;
            height: 18px;
            background: url("https://image.dalbitlive.com/svg/itemmulitiply.svg") no-repeat;
            background-size: cover;
          }

          .combo_counting {
            position: relative;
            width: 144px;
            text-align: center;
            font-weight: 500;
            font-size: 88px;
            letter-spacing: -1px;

            &.text-animation {
              animation-name: comboCount;
              animation-duration: 0.4s;
              animation-timing-function: linear;
              animation-iteration-count: infinite;
            }
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
