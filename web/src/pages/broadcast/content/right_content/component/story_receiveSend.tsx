import React, { useEffect, useState, useContext, useRef } from "react";
// Api
import { postStory, getStory, deleteStory } from "common/api";
// import moment from 'moment'
// component
import {setGlobalCtxAlertStatus, setGlobalCtxSetToastStatus} from "../../../../../redux/actions/globalCtx";
import {useDispatch} from "react-redux";

export default function SendingReceive(props: any) {
  const dispatch = useDispatch();
  const { roomNo, roomInfo } = props;

  const [storyMsg, setStoryMsg] = useState<string>("");  

  //사연 작성
  const fetchStory = (roomNo: string, storyMsg: string) => {
    async function fetchStoryFunc() {
      const { result, data, message } = await postStory({
        roomNo: roomNo,
        contents: storyMsg,
        djMemNo: roomInfo?.bjMemNo,
        plusYn: 'n'
      });
      if (result === "success") {
        setStoryMsg("");
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
    if (value.length > 500) return;
    setStoryMsg(value);
  };

  useEffect(() => {

  }, []);

  return (
    <div>
      <div className="storyForm">
        <p className="infoText">
          * 사연을 등록하면 DJ에게 사연이 전달 됩니다.<br />
          채팅창에 쓰기 어려운 내용을 등록해보세요.
        </p>
        <div className="textAreaWrap">
          <textarea
            className="textArea"
            placeholder="10자 이상 500자 이내로 작성해주세요."
            onChange={StoryChange}
            value={storyMsg}
          />
          <span className="msgCount"> {storyMsg.length} / 500</span>
        </div>
        <button className="registBtn" onClick={() => fetchStory(roomNo, storyMsg)}>
          등록하기
        </button>
      </div>
    </div>
  );
}
