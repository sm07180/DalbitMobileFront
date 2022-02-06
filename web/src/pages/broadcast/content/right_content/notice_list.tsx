import React, { useEffect, useState, useContext, useCallback } from "react";
// Api
import { getNoticeList, postNoticeWrite, deleteNoticeWrite } from "common/api";
import { GlobalContext } from "context";
import { BroadcastContext } from "context/broadcast_ctx";
// component
import NoResult from "common/ui/no_result";
import { DalbitScroll } from "common/ui/dalbit_scroll";

import {BROAD_NOTICE_LENGTH} from "../../constant";

export default function NoticeList(props: any) {
  //ctx
  const { globalAction } = useContext(GlobalContext);
  const { broadcastState } = useContext(BroadcastContext);
  const { roomOwner, roomNo } = props;
  //state
  const [loadNoticeMsg, setLoadNoticeMsg] = useState<string>("");
  const [noticeMsg, setNoticeMsg] = useState<string>("");

  //공지사항 조회
  const searchNotice = useCallback((roomNo: string) => {
    async function searchNoticeFunc() {
      const { result, data } = await getNoticeList({
        roomNo: roomNo,
      });
      if (result === "success") {
        setLoadNoticeMsg(data.notice);
      }
    }
    searchNoticeFunc();
  }, []);

  //공지사항 작성
  const fetchNotice = useCallback((roomNo: string, noticeMsg: string) => {
    async function fetchNoticeFunc() {
      const { result, data, message } = await postNoticeWrite({
        roomNo: roomNo,
        notice: noticeMsg,
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
  const fetchNoticeDelete = useCallback((roomNo: string, noticeMsg: string) => {
    async function fetchNoticeDeleteFunc() {
      const { result, data } = await deleteNoticeWrite({
        roomNo: roomNo,
        notice: "",
      });
      if (result === "success") {
        setNoticeMsg("");
        setLoadNoticeMsg("");
      }
    }
    fetchNoticeDeleteFunc();
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
  };

  const DeleteNotice = () => {
    globalAction.setAlertStatus!({
      status: true,
      type: "confirm",
      content: "공지사항을 삭제하시겠습니까?",
      callback: () => {
        fetchNoticeDelete(roomNo, noticeMsg);
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
              <button onClick={() => fetchNotice(roomNo, noticeMsg)} className="noticeForm__registBtn">
                등록하기
              </button>
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
                <button onClick={DeleteNotice} className="noticeForm__btnWrap__cancelBtn">
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
