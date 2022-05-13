import React, { useState } from "react";
// Api
import {postStory, getProfile} from "common/api";
// component
import {setGlobalCtxAlertStatus, setGlobalCtxSetToastStatus, setGlobalCtxUserProfile} from "../../../../../redux/actions/globalCtx";
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
      if(storyMsg.length < 10){
        dispatch(setGlobalCtxSetToastStatus({
          status: true,
          message: "내용을 10자 이상 입력해야 합니다."
        }));
        return;
      }
      const { result, message } = await postStory({
        roomNo: roomNo,
        contents: storyMsg,
        djMemNo: roomInfo?.bjMemNo,
        plusYn: 'y'
      });
      if (result === "success") {
        setStoryMsg("");
        setDalCnt(chatInfo, splash?.story, splash?.story[0]?.itemNo, 1);

        // profile 업데이트
        const { result, data } = await getProfile({
          memNo: globalState.userProfile.memNo,
        });
        if (result === "success") {
          dispatch(setGlobalCtxUserProfile(data));
        }

        dispatch(setGlobalCtxSetToastStatus({
          status: true,
          message: `${roomInfo.bjNickNm} 님에게 선물을 보냈습니다.`,
        }));
      } else {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          type: "alert",
          content: message.replaceAll('\n','<br/>'),
        }));
      }

    }
    fetchStoryFunc();
  };

  const StoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    // 50자 이하, 개행문자 최대 4개
    if (value.length > 50 || (value.match(/\n/g)?.length || 0) > 4) {
      e.target.value = storyMsg;
      return;
    }
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
