import React, { useEffect, useState, useContext, useCallback } from "react";
// Api
import { getNoticeList, postNoticeWrite, deleteNoticeWrite } from "common/api";
import API from "context/api";
import { GlobalContext } from "context";
import { BroadcastContext } from "context/broadcast_ctx";
// component
import NoResult from "common/ui/no_result";
import { DalbitScroll } from "common/ui/dalbit_scroll";

import {BROAD_NOTICE_LENGTH} from "../../constant";

let isModify = false;
export default function NoticeList(props: any) {
  //ctx
  const { globalAction, globalState } = useContext(GlobalContext);
  const { broadcastState } = useContext(BroadcastContext);
  const { roomOwner, roomNo } = props;
  //state
  const [loadNoticeMsg, setLoadNoticeMsg] = useState<string>("");
  const [noticeList, setNoticeList] = useState<any>([]);
  const [noticeMsg, setNoticeMsg] = useState<string>("");

  //공지사항 조회
  const searchNotice = useCallback((roomNo: string) => {
    async function searchNoticeFunc() {
      let params = {memNo: broadcastState.roomInfo?.bjMemNo}
      const { result, data } = await API.myPageBroadcastNoticeSel(params);
      if (result === "success") {
        setLoadNoticeMsg(data.list[0].conts);
        setNoticeList(data.list[0]);
      }
    }
    searchNoticeFunc();
  }, []);

  //공지사항 작성
  const fetchNotice = useCallback((roomNo: string, noticeMsg: string) => {
    async function fetchNoticeFunc() {
      const { result, message } = await API.myPageBroadcastNoticeIns({
        reqBody: true,
        data: {
          memNo: globalState.userProfile.memNo,
          roomNo: roomNo,
          roomNoticeConts: noticeMsg
        }
      });
      if (result === "success") {
        searchNotice(roomNo);
        if (globalAction.callSetToastStatus) {
          globalAction.callSetToastStatus({ status: true, message: message });
        }
      }
    }
    fetchNoticeFunc();
  }, []);

  //공지사항 삭제
  const fetchNoticeDelete = useCallback((roomNo: string, noticeIdx: number) => {
    async function fetchNoticeDeleteFunc() {
      let params = {
        roomNoticeNo: noticeIdx,
        memNo: globalState.userProfile.memNo,
        roomNo: roomNo,
        delChrgrName: ""
      }
      const { result } = await API.myPageBroadcastNoticeDel(params);
      if (result === "success") {
        setNoticeMsg("");
        setLoadNoticeMsg("");
      }
    }
    fetchNoticeDeleteFunc();
  }, []);

  //공지사항 수정
  const fetchNoticeModify = useCallback((roomNo: string, noticeIdx: number, noticeMsg: string) => {
    async function fetchNoticeModifyFunc() {
      const { result, message } = await API.myPageBroadcastNoticeUpd({
        reqBody: true,
        data: {
          roomNoticeNo: noticeIdx,
          memNo: globalState.userProfile.memNo,
          roomNo: roomNo,
          roomNoticeConts: noticeMsg
        }
      });
      if(result === "success") {
        searchNotice(roomNo);
        isModify = false;
        if (globalAction.callSetToastStatus) {
          globalAction.callSetToastStatus({ status: true, message: message });
        }
      }
    }
    fetchNoticeModifyFunc();
  }, []);
  //----------------------------------------------------

  useEffect(() => {
    searchNotice(roomNo);
  }, [broadcastState.noticeState]);
  //----------------------------------------------------

  const NoticeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length > BROAD_NOTICE_LENGTH) return;
    setNoticeMsg(value);
  };

  const modifyNotice = () => {
    setLoadNoticeMsg("");
    setTimeout(() => {
      setNoticeMsg(loadNoticeMsg);
    }, 10);
    isModify = true;
  };

  const DeleteNotice = (e) => {
    const {noticeIdx} = e.currentTarget.dataset;
    globalAction.setAlertStatus!({
      status: true,
      type: "confirm",
      content: "공지사항을 삭제하시겠습니까?",
      callback: () => {
        fetchNoticeDelete(roomNo, noticeIdx);
      },
    });
  };

  return (
    <>
      {roomOwner === true ? (
        //방장이면서 초기 공지사항값이 빈값일 경우
        loadNoticeMsg === "" ? (
          <div className="noticeContainer">
            <h3 className="tabTitle">공지 등록하기</h3>
            <div className="noticeForm">
              <p className="noticeForm__explain">*현재 방송방에서 공지할 내용을 입력하세요.</p>
              <textarea
                onChange={(e) => NoticeChange(e)}
                value={noticeMsg}
                className="noticeForm__textArea"
                placeholder={`최대 ${BROAD_NOTICE_LENGTH}자 이내로 작성해주세요.`}
              />
              <p className="noticeForm__alarmMsg">방송 중 공지는 가장 최근 작성한 공지만 노출됩니다.</p>
              <span className="noticeForm__msgCount">{noticeMsg.length} / {BROAD_NOTICE_LENGTH}</span>
              {!isModify ?
                  <button onClick={() => fetchNotice(roomNo, noticeMsg)} className="noticeForm__registBtn">
                    등록하기
                  </button>
                  :
                  <button onClick={() => fetchNoticeModify(roomNo, noticeList.auto_no, noticeMsg)} className="noticeForm__registBtn">
                    수정하기
                  </button>
              }
            </div>
          </div>
        ) : (
          <div className="noticeContainer">
            <h3 className="tabTitle">공지사항</h3>
            <div className="noticeForm">
              <p className="noticeForm__explain">*현재 방송방에서 공지할 내용을 입력하세요.</p>
              <DalbitScroll height={690}>
                <pre className="noticeForm__textArea">{loadNoticeMsg}</pre>
              </DalbitScroll>
              <div className="noticeForm__btnWrap">
                <button data-notice-idx={noticeList.auto_no} onClick={DeleteNotice} className="noticeForm__btnWrap__cancelBtn">
                  삭제하기
                </button>
                <button onClick={modifyNotice} className="noticeForm__btnWrap__modifyBtn">
                  수정하기
                </button>
              </div>
            </div>
          </div>
        )
      ) : loadNoticeMsg === "" ? (
        <>
          <h3 className="tabTitle">공지사항</h3>
          <NoResult text="등록된 공지사항이 없습니다." type="default" />
        </>
      ) : (
        <>
          <h3 className="tabTitle">공지사항</h3>
          <div className="noticeForm">
            <p className="noticeForm__explain">*현재 방송방의 공지 사항 입니다.</p>
            <DalbitScroll height={690}>
              <pre className="noticeForm__textArea">{loadNoticeMsg}</pre>
            </DalbitScroll>
          </div>
        </>
      )}
    </>
  );
}
