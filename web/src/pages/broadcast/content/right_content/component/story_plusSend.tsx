import React, { useEffect, useState, useContext, useRef } from "react";
// Api
import { postStory, getStory, deleteStory } from "common/api";
// import moment from 'moment'
// component
import {setGlobalCtxAlertStatus, setGlobalCtxSetToastStatus} from "../../../../../redux/actions/globalCtx";
import {useDispatch} from "react-redux";

export default function SendingPlus(props: any) {
  const dispatch = useDispatch();
  const { roomNo } = props;

  const [storyMsg, setStoryMsg] = useState<string>("");  

  //사연 작성
  const fetchStory = (roomNo: string, storyMsg: string) => {
    async function fetchStoryFunc() {
      const { result, data, message } = await postStory({
        roomNo: roomNo,
        contents: storyMsg,
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
    if (value.length > 50) return;
    setStoryMsg(value);
  };

  useEffect(() => {

  }, []);

  return (
    <div>
      <div className="storyForm">
        <p className="storyForm__explain">
          * 100달을 사용하여 방송방에 있는 모두와<br />
          공유되는 사연을 보낼 수 있습니다.
        </p>
        <textarea
          className="storyForm__textArea"
          placeholder="10자 이상 50자 이내로 작성해주세요."
          onChange={StoryChange}
          value={storyMsg}
        />
        <span className="storyForm__msgCount"> {storyMsg.length} / 50</span>
        <button className="storyForm__registBtn" onClick={() => fetchStory(roomNo, storyMsg)}>
          등록하기
        </button>
      </div>
    </div>
  );
}
