import React, { useEffect, useState, useContext, useRef } from "react";
// Api
import { postStory, getStory, deleteStory } from "common/api";
import { TimeFormat } from "lib/common_fn";
// component
import NoResult from "common/ui/no_result";
import {setGlobalCtxAlertStatus, setGlobalCtxSetToastStatus} from "../../../../../redux/actions/globalCtx";
import {useDispatch} from "react-redux";

export default function StoryList(props: any) {
  const dispatch = useDispatch();
  const { roomOwner, roomNo } = props;

  //state
  const [timer, setTimer] = useState("");
  const [storyMsg, setStoryMsg] = useState<string>("");  
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

  //사연 조회
  const SearchStory = (roomNo: string) => {
    async function getStoryFunc() {
      const { result, data } = await getStory({
        roomNo: roomNo,
        page: 1,
        records: 9999,
      });
      if (result === "success") {
        setStoryArr(data.list);
      }
    }
    getStoryFunc();
  };

  //사연 삭제
  const DeleteStory = (roomNo: string, storyIdx: number) => {
    async function deleteStoryFunc() {
      const { result, data } = await deleteStory({
        roomNo: roomNo,
        storyIdx: storyIdx,
      });
      if (result === "success") {
        SearchStory(roomNo);
      }
    }
    deleteStoryFunc();
  };

  useEffect(() => {
    SearchStory(roomNo);
  }, []);

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
      <div className="storyWrap__list">
        {storyArr.length === 0 ?
         <NoResult text="등록된 사연이 없습니다." type="default" />
         :
          storyArr.map((item, idx) => {
            return (
              <div key={idx} className="storyWrap__innerList">
                <div className="storyWrap__header">
                  <img src={item.profImg.thumb62x62} className="storyWrap__profImg" />
                  <span className="storyWrap__title">{item.nickNm}</span>
                  <div className="storyWrap__deleteWrap">
                    <span className="storyWrap__deleteWrap__dater">{TimeFormat(item.writeDt)}</span>
                    <button className="storyWrap__deleteWrap__cancel" onClick={() => DeleteStory(roomNo, item.storyIdx)}>
                      삭제
                    </button>
                  </div>
                </div>
                <pre className="storyWrap__contentsBox">{item.contents}</pre>
              </div>
            );
          })        
        }          
      </div>
    </>
  );
}
