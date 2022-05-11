import React, { useEffect, useState, useContext, useRef } from "react";
// Api
import { postStory, getStory, deleteStory } from "common/api";
import { dateTimeFormat } from "lib/common_fn";
// import moment from 'moment'
// component
import NoResult from "common/ui/no_result";
import {setGlobalCtxAlertStatus, setGlobalCtxSetToastStatus} from "../../../../../redux/actions/globalCtx";
import {useDispatch} from "react-redux";

export default function StoryList(props: any) {
  const dispatch = useDispatch();
  const { roomNo } = props;

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
        url: "",
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
    SearchStory(roomNo);
    let interval = setInterval(clocker, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className="storyListWrap">
        {storyArr.length === 0 ?
         <NoResult text="등록된 사연이 없습니다." type="default" />
         :
          storyArr.map((item, idx) => {
            return (
              <div className="storyList" key={idx}>
                <div className="listHeader">
                  <div className="photo">
                    <img src={item.profImg.url} className="storyWrap__profImg" />
                  </div>
                  <div className="infoWrap">
                    <span className="userNick">{item.nickNm}</span>
                    <span className="writeDate">{dateTimeFormat(item.writeDt)}</span>
                  </div>
                  <div className="deleteWrap">
                    <button className="deleteBtn" onClick={() => DeleteStory(roomNo, item.storyIdx)}>
                      삭제
                    </button>
                  </div>
                </div>
                <div className="listContent">
                  <pre className="storyContent">{item.contents}</pre>
                </div>
              </div>
            );
          })        
        }          
      </div>
    </>
  );
}
