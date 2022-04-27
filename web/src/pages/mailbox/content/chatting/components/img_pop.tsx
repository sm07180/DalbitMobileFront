import React, { useContext, useState, useEffect, useRef } from "react";
//api
import { getChatImageList, postChatImageDelete, postReportImg } from "common/api";

//component
import Slider from "./img_slider";
import {useDispatch, useSelector} from "react-redux";
import {
  setMailBoxImgSliderAddDeleteImg,
  setMailBoxImgSliderInit,
  setMailBoxImgSliderPopupClose
} from "../../../../../redux/actions/mailBox";
import {setGlobalCtxAlertStatus} from "../../../../../redux/actions/globalCtx";

export default (props) => {
  const { startMemNo } = props;
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const dispatch = useDispatch();
  const mailboxState = useSelector(({mailBoxCtx}) => mailBoxCtx);

  const [sliderState, setSliderState] = useState(false);
  const [imgList, setImgList] = useState([]);
  const [slider, setSlider] = useState<any>({});
  const [canDelete, setCanDelete] = useState<boolean>(startMemNo === globalState.baseData.memNo ? true : false);
  const [AllSlideCount, setAllSlideCount] = useState(0);
  const [currentSlideNum, setCurrentSlideNum] = useState(0);

  const getImgList = async () => {
    const { result, message, data } = await getChatImageList({
      chatNo: mailboxState.mailboxInfo?.chatNo,
      msgIdx: mailboxState.imgSliderInfo.startImgIdx,
    });
    if (result === "success") {
      setImgList(data.list);
      setSliderState(true);
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "alert",
        content: message,
        callback: () => {
          dispatch(setMailBoxImgSliderPopupClose());
        },
      }));
    }
  };

  const settingDeletedImgList = (list) => {
    const result = list.filter((item: any) => {
      return item.msgIdx !== mailboxState.imgSliderInfo.currentImgIdx;
    });
    setImgList(result);
    setAllSlideCount(result.length);
  };

  const settingCurrentSlideIdx = (list) => {
    let currentSlideidx = list.findIndex((item: any) => {
      return item.msgIdx === mailboxState.imgSliderInfo.currentImgIdx;
    });
    let currentSlide: any = {};
    if (currentSlideidx === 0) {
      currentSlide = list[currentSlideidx + 1];
    } else {
      currentSlide = list[currentSlideidx - 1];
    }
    return currentSlide;
  };

  const actionImgDelete = (list, currentSlide) => {
    dispatch(setMailBoxImgSliderPopupClose());
    if (list.length > 1) {
      dispatch(setMailBoxImgSliderInit({
        memNo: currentSlide.memNo,
        idx: currentSlide.msgIdx,
      }));
    }
  };

  const postImgDelete = async () => {
    const { result, message, data } = await postChatImageDelete({
      chatNo: mailboxState.mailboxInfo?.chatNo,
      msgIdx: mailboxState.imgSliderInfo.currentImgIdx,
    });
    if (result === "success") {
      dispatch(setMailBoxImgSliderAddDeleteImg(mailboxState.imgSliderInfo.currentImgIdx));
      settingDeletedImgList(imgList);
      actionImgDelete(imgList, settingCurrentSlideIdx(imgList));
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "alert",
        content: message,
      }));
    }
  };

  const postImageReport = async () => {
    const currentImg: any = imgList.find((item: any) => item.msgIdx === mailboxState.imgSliderInfo.currentImgIdx);
    const currentImgPath = currentImg && currentImg.imageInfo.path;
    const { result, message } = await postReportImg({
      memNo: mailboxState.mailboxInfo?.memNo,
      roomNo: mailboxState.mailboxInfo?.chatNo,
      imageType: 1,
      imageIdx: mailboxState.imgSliderInfo?.currentImgIdx,
      imagePath: currentImgPath,
    });
    if (result === "sccess") {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "alert",
        content: message,
      }));
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "alert",
        content: message,
      }));
    }
  };

  const handleReportIconClick = () => {
    dispatch(setGlobalCtxAlertStatus({
      status: true,
      type: "confirm",
      content: "현재 이미지를 부적절한 이미지로 <br/> 신고하시겠습니까?",
      callback: () => {
        postImageReport();
      },
    }));
  };

  const settingCurrentSlideNum = () => {
    setCurrentSlideNum(imgList.findIndex((item: any) => item.msgIdx === mailboxState.imgSliderInfo.currentImgIdx) + 1);
  };

  useEffect(() => {
    if (imgList.length > 0) {
      setAllSlideCount(imgList.length);
      settingCurrentSlideNum();
    }
  }, [imgList]);

  useEffect(() => {
    if (imgList.length > 0) {
      const deleteState: any = imgList.find((item: any) => item.msgIdx === mailboxState.imgSliderInfo.currentImgIdx);
      console.log(deleteState);
      setCanDelete(deleteState.isDelete);
      settingCurrentSlideNum();
    }
  }, [mailboxState.imgSliderInfo.currentImgIdx]);

  useEffect(() => {
    getImgList();
  }, []);

  return (
    <div id="chatImgPop">
      <div className="layout">
        <div className="header">
          {!canDelete && (
            <button
              className="declar"
              onClick={() => {
                handleReportIconClick();
              }}
            >
              신고하기
            </button>
          )}
          <button
            className="close"
            onClick={() => {
              dispatch(setMailBoxImgSliderPopupClose());
            }}
          >
            닫기
          </button>
        </div>
        {imgList.length > 0 && (
          <div className={`img_area ${sliderState ? "on" : "off"}`}>
            <Slider imgList={imgList} setSlider={setSlider} />
          </div>
        )}

        <div className="footer">
          <p className="navi">{`${currentSlideNum} / ${AllSlideCount}`}</p>
          <button
            className="slider_btn prev"
            onClick={() => {
              slider.prev();
            }}
          >
            이전으로
          </button>
          {canDelete && (
            <button
              className="delet"
              onClick={() => {
                dispatch(setGlobalCtxAlertStatus({
                  status: true,
                  type: "confirm",
                  content: `업로드된 이미지를 <br/> 삭제하시겠습니까?`,
                  callback: () => {
                    postImgDelete();
                  },
                }));
              }}
            >
              삭제
            </button>
          )}

          <button
            className="slider_btn next"
            onClick={() => {
              slider.next();
            }}
          >
            다음으로
          </button>
        </div>
      </div>
    </div>
  );
};
