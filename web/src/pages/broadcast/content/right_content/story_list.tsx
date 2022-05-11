import React, { useEffect, useState, useContext, useRef } from "react";
// Api
import { postStory, getStory, deleteStory } from "common/api";
import { TimeFormat } from "lib/common_fn";
// component
import NoResult from "common/ui/no_result";
import ReceiveList from "./component/story_receiveList";

import { DalbitScroll } from "common/ui/dalbit_scroll";
import {setGlobalCtxAlertStatus, setGlobalCtxSetToastStatus} from "../../../../redux/actions/globalCtx";
import {useDispatch} from "react-redux";

type storyTabType = "receive" | "plus";

export default function StoryList(props: any) {
  const dispatch = useDispatch();
  const { roomOwner, roomNo } = props;

  //state
  const [timer, setTimer] = useState("");
  const [storyMsg, setStoryMsg] = useState<string>("");  
  const [storyTab, setStoryTab] = useState<storyTabType>('receive');
  const [storyArr, setStoryArr] = useState([
    {
      nickNm: "",
      contents: "",
      writeDt: "",
      storyIdx: -1,
      profImg: {
        thumb62x62: "",
      },
    },
  ]);

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
    if (value.length > 100) return;
    setStoryMsg(value);
  };
  
  const clocker = () => {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    setTimer(
      `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
    );

  };
  useEffect(() => {
    let interval = setInterval(clocker, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {roomOwner === true ? (
        <div className="storyWrap">
          <StoryTab storyTab={storyTab} setStoryTab={setStoryTab} />
          {storyTab === 'receive' ?
              <ReceiveList roomNo={roomNo}></ReceiveList>
            :
              <></>
          }
        </div>
      ) : (
        <div>
          <h3 className="tabTitle">사연</h3>
          <div className="storyForm">
            <p className="storyForm__explain">
              * 사연을 등록하면 DJ에게 사연이 전달 됩니다.
              <br /> 채팅창에 쓰기 어려운 내용을 등록해보세요.
            </p>
            <textarea
              className="storyForm__textArea"
              placeholder="최대 100자 이내로 작성해주세요."
              onChange={StoryChange}
              value={storyMsg}
            />
            <span className="storyForm__msgCount"> {storyMsg.length} / 100</span>
            <button className="storyForm__registBtn" onClick={() => fetchStory(roomNo, storyMsg)}>
              등록하기
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const StoryTab = ({ storyTab, setStoryTab }) => {
  return (
    <div className="storyTabWrap">
      <div className={`storyTabMenu ${storyTab === 'receive' ? 'active' : ''}`}
           onClick={() => setStoryTab('receive')}
      >
        받은 사연
      </div>
      <div className={`storyTabMenu ${storyTab === 'plus' ? 'active' : ''}`}
           onClick={() => setStoryTab('plus')}
      >
        사연 플러스
      </div>
    </div>
  )
}