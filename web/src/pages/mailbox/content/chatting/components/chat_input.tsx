import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {useHistory} from "react-router-dom";
//api
import {getProfile, postChatImage} from "common/api";
// context
import DalbitCropper from "common/ui/dalbit_cropper";
import {useDispatch, useSelector} from "react-redux";
import {
  setGlobalCtxAlertStatus,
  setGlobalCtxSetToastStatus,
  setGlobalCtxUserProfile
} from "../../../../../redux/actions/globalCtx";

export default function chatInput(props) {
  const { setChatText, sendMessage, chatText, setGiftPop, targetIsMailboxOn } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const mailboxState = useSelector(({mailBoxCtx}) => mailBoxCtx);
  const { chatInfo, isMailboxOn } = globalState;
  const textareaRef = useRef<any>(null);
  //크롭퍼 state
  const [image, setImage] = useState<any>(null);
  const [cropOpen, setCropOpen] = useState<boolean>(false);
  const [eventObj, setEventObj] = useState<any>(null);
  //disabled State
  const [chatDisable, setChatDisable] = useState(true);

  //function
  const handleChangeInput = (e) => {

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight - 24 + "px";
    const { value } = e.target;
    let space = /\s/;

    if (space.exec(value) && value.length === 1) {
      return false;
    } else {
      setChatText(value);
    }
  };
  const chatKeydownEvent = useCallback(
    (e: any) => {
      const target = e.currentTarget;
      if (e.shiftKey) {
      } else {
        if (e.keyCode === 13 && target.value !== "") {
          sendMessage(chatText, 1);
          setChatText("");
        }
      }
    },
    [chatInfo, chatText]
  );

  const chatNoUseToast = () => {
    dispatch(setGlobalCtxSetToastStatus({
      status: true,
      message: "메시지 기능을 사용하지 않는 상태이므로 사용할 수 없습니다.",
    }));
  };
  const openGiftPop = () => {
    if (!chatDisable) return chatNoUseToast();
    ProfileInfo();
    setGiftPop(true);
  };
  async function ProfileInfo() {
    const { result, data, message } = await getProfile({
      memNo: globalState.baseData.memNo,
    });
    if (result === "success") {
      dispatch(setGlobalCtxUserProfile(data));
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "alert",
        content: message,
        callback: () => {
          history.push(`/`);
        },
      }));
    }
  }
  //----------------------
  useLayoutEffect(() => {
    setChatDisable(isMailboxOn ? targetIsMailboxOn : false);
  }, [targetIsMailboxOn, isMailboxOn]);

  useEffect(() => {
    if (image !== null) {
      if (image.status === false) {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          type: "alert",
          content: image.content,
          callback: () => {
            return;
          },
        }));
      } else {
        const imageUpload = async () => {
          const { result, data, message } = await postChatImage({
            roomNo: String(mailboxState.mailboxInfo?.chatNo),
            dataURL: image.content,
            os: "3",
          });
          if (result === "success") {
            (document.getElementById("fileUpload") as HTMLInputElement).value = "";
            setImage(null);
          } else {
            dispatch(setGlobalCtxAlertStatus({
              status: true,
              type: "alert",
              content: message,
            }));
          }
        };
        imageUpload();
      }
    }
  }, [image]);
  return (
    <>
      <div className="chatAddBox">
        <button onClick={openGiftPop}>
          <img src="https://image.dalbitlive.com/mailbox/ico_gift.svg" alt="선물하기" />
        </button>
        <textarea
          placeholder={chatDisable ? "대화를 입력해 주세요" : "대화가 불가능한 상태입니다."}
          className={chatDisable ? "" : "off"}
          value={chatText}
          onChange={(e) => handleChangeInput(e)}
          onKeyDown={chatKeydownEvent}
          ref={textareaRef}
          disabled={!chatDisable}
        ></textarea>
        <div
          className="fileUpload"
          onClick={() => {
            if (!chatDisable) chatNoUseToast();
          }}
        >
          <label htmlFor="fileUpload">
            <img src="https://image.dalbitlive.com/mailbox/ico_img.svg" alt="사진올리기" />
          </label>
          <input
            type="file"
            id="fileUpload"
            disabled={!chatDisable}
            onChange={(e: any) => {
              e.persist();
              setEventObj(e);
              setCropOpen(true);
            }}
          />
        </div>        
        {/* <button>
          <img src="https://image.dalbitlive.com/mailbox/ico_camera_w.svg" alt="사진찍기" />
        </button> */}
      </div>
      {cropOpen && eventObj !== null && (
        <DalbitCropper
          imgInfo={eventObj}
          onClose={() => {
            setCropOpen(false);
          }}
          onCrop={(value) => setImage(value)}
          type={"chatting"}
        />
      )}
    </>
  );
}
