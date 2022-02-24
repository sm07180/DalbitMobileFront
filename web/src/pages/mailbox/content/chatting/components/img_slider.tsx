import React, { useContext, useEffect, useCallback } from "react";
import { useKeenSlider } from "keen-slider/react";
import {useDispatch, useSelector} from "react-redux";
import {setMailBoxImgSliderChangeCurrent} from "../../../../../redux/actions/mailBox";

export default (props) => {
  let { imgList, setSlider } = props;

  const dispatch = useDispatch();
  const mailboxState = useSelector(({mailBoxCtx}) => mailBoxCtx);
  const { imgSliderInfo } = mailboxState;
  const { deletedImgArray } = mailboxState.imgSliderInfo;
  const initialImgIdx = imgList.findIndex((item) => item.msgIdx === imgSliderInfo.startImgIdx);

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    initial: initialImgIdx,
    slidesPerView: 1,
    slideChanged: (slider) => {
      const currentImgIdx = slider.details().absoluteSlide;
      if (imgList[currentImgIdx]) {
        dispatch(setMailBoxImgSliderChangeCurrent(imgList[currentImgIdx].msgIdx))
      }
    },
  });

  const createSlider = useCallback(() => {
    return imgList.map((item: any, idx) => {
      const { imageInfo, msgIdx } = item;
      const { url } = imageInfo;
      let stateName = "normal";
      if (deletedImgArray.indexOf(msgIdx) !== -1) stateName = "deleted";
      return (
        <div className="keen-slider__slide" key={idx}>
          <div className={`img_wrap ${stateName}`}>
            {stateName === "normal" ? (
              <img src={url} />
            ) : (
              <div className="deletedImgSlide">
                <img src={"https://image.dalbitlive.com/svg/deleted_img_l.svg"} />
                삭제된 이미지
              </div>
            )}
          </div>
        </div>
      );
    });
  }, [deletedImgArray]);

  useEffect(() => {
    if (slider !== null && imgList.length > 0) {
      setSlider(slider);
    }
  }, [imgList, slider]);

  return (
    <>
      <div ref={sliderRef} className={`keen-slider`}>
        {createSlider()}
      </div>
    </>
  );
};
