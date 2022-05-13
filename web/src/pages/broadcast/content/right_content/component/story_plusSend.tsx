import React, { useState } from "react";
// Api
import { postStory, getStory, deleteStory } from "common/api";
// component
import {setGlobalCtxAlertStatus, setGlobalCtxSetToastStatus} from "../../../../../redux/actions/globalCtx";
import {useDispatch, useSelector} from "react-redux";
import {setDalCnt} from "../send_gift";

export default function SendingPlus(props: any) {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const { splash, chatInfo } = globalState;
  const { roomNo, roomInfo } = props;

  const [storyMsg, setStoryMsg] = useState<string>("");

  //사연 작성
  const fetchStory = (roomNo: string, storyMsg: string) => {
    async function fetchStoryFunc() {
      const { result, data, message } = await postStory({
        roomNo: roomNo,
        contents: storyMsg,
        djMemNo: roomInfo?.bjMemNo,
        plusYn: 'y'
      });
      if (result === "success") {
        setStoryMsg("");
        setDalCnt(chatInfo, splash?.story, splash?.story[0]?.itemNo, 1);
        dispatch(setGlobalCtxSetToastStatus({
          status: true,
          message: "사연이 등록되었습니다",
        }));
      } else {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          type: "alert",
          content: message,
        }));
      }

    }
    fetchStoryFunc();
  };

  const StoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length > 50) return;
    setStoryMsg(value);
  };

  return (
    <div className="storyForm">
      <p className="infoText">
        * 100달을 사용하여 방송방에 있는 모두와<br />
        공유되는 사연을 보낼 수 있습니다.
      </p>
      <div className="textAreaWrap">
        <textarea
          className="textArea"
          placeholder="10자 이상 50자 이내로 작성해주세요."
          onChange={StoryChange}
          value={storyMsg}
        />
        <span className="msgCount"> {storyMsg.length} / 50</span>
      </div>
      <button className="registBtn" onClick={() => fetchStory(roomNo, storyMsg)}>
        등록하기 (<span className="iconDal"/> 100)
      </button>
    </div>
  );
}
