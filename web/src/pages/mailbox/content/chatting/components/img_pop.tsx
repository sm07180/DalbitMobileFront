import React, { useContext, useState, useEffect, useRef } from "react";
import { GlobalContext } from "context";
import { MailboxContext } from "context/mailbox_ctx";
//api
import { getChatImageList, postChatImageDelete, postReportImg } from "common/api";

//component
import Slider from "./img_slider";

export default (props) => {
  const { startMemNo } = props;
  const { globalState, globalAction } = useContext(GlobalContext);
  const { mailboxAction, mailboxState } = useContext(MailboxContext);
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
      globalAction.setAlertStatus!({
        status: true,
        type: "alert",
        content: message,
        callback: () => {
          mailboxAction.dispathImgSliderInfo && mailboxAction.dispathImgSliderInfo({ type: "popupClose" });
        },
      });
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
    mailboxAction.dispathImgSliderInfo && mailboxAction.dispathImgSliderInfo({ type: "popupClose" });
    if (list.length > 1) {
      mailboxAction.dispathImgSliderInfo &&
        mailboxAction.dispathImgSliderInfo({
          type: "init",
          data: {
            memNo: currentSlide.memNo,
            idx: currentSlide.msgIdx,
          },
        });
    }
  };

  const postImgDelete = async () => {
    const { result, message, data } = await postChatImageDelete({
      chatNo: mailboxState.mailboxInfo?.chatNo,
      msgIdx: mailboxState.imgSliderInfo.currentImgIdx,
    });
    if (result === "success") {
      mailboxAction.dispathImgSliderInfo &&
        mailboxAction.dispathImgSliderInfo({ type: "addDeletedImg", data: mailboxState.imgSliderInfo.currentImgIdx });
      settingDeletedImgList(imgList);
      actionImgDelete(imgList, settingCurrentSlideIdx(imgList));
    } else {
      globalAction.setAlertStatus!({
        status: true,
        type: "alert",
        content: message,
      });
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
      globalAction.setAlertStatus!({
        status: true,
        type: "alert",
        content: message,
      });
    } else {
      globalAction.setAlertStatus!({
        status: true,
        type: "alert",
        content: message,
      });
    }
  };

  const handleReportIconClick = () => {
    globalAction.setAlertStatus!({
      status: true,
      type: "confirm",
      content: "현재 이미지를 부적절한 이미지로 <br/> 신고하시겠습니까?",
      callback: () => {
        postImageReport();
      },
    });
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
              mailboxAction.dispathImgSliderInfo && mailboxAction.dispathImgSliderInfo({ type: "popupClose" });
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
                globalAction.setAlertStatus &&
                  globalAction.setAlertStatus({
                    status: true,
                    type: "confirm",
                    content: `업로드된 이미지를 <br/> 삭제하시겠습니까?`,
                    callback: () => {
                      postImgDelete();
                    },
                  });
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