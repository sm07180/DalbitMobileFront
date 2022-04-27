import React, { useEffect, useState, useContext, useRef } from "react";
// Api
import { postStory, getStory, deleteStory } from "common/api";
import { TimeFormat } from "lib/common_fn";
// component
import NoResult from "common/ui/no_result";
import { DalbitScroll } from "common/ui/dalbit_scroll";
import {setGlobalCtxAlertStatus, setGlobalCtxSetToastStatus} from "../../../../redux/actions/globalCtx";
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

  const ScrollWrap = useRef<any>(null);
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
  const StoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length > 100) return;
    setStoryMsg(value);
  };
  const refreshList = () => {
    SearchStory(roomNo);
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
          <h3 className="tabTitle">등록 사연</h3>
          <div className="storyWrap__timer">
            <span className="storyWrap__timer__refresh" onClick={refreshList}></span>
            <span className="storyWrap__timer__date">{timer}</span>
            <span className="storyWrap__timer__count">{`사연수 : ${storyArr.length}개`}</span>
          </div>
          <DalbitScroll width={360}>
            <div className="storyWrap__list">
              {storyArr.length === 0 && <NoResult text="등록된 사연이 없습니다." type="default" />}
              {storyArr.length !== 0 &&
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
                })}
            </div>
          </DalbitScroll>
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
