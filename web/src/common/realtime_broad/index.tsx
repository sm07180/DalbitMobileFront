import React, { useEffect, useContext, useState, useMemo } from "react";
import styled from "styled-components";
import { makeHourMinute } from "lib/common_fn";
import { useHistory, useLocation } from "react-router-dom";
import { mailBoxJoin } from "common/mailbox/mail_func";
import { IMG_SERVER } from "constant/define";


// lib
import { convertDateFormat } from "lib/dalbit_moment";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxRealtimeBroadStatus} from "../../redux/actions/globalCtx";

let msgArray: any[] = [];
let copyArray: any[] = [];

let timer;

export default function RealTimeBroadUI() {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const { pathname } = location;
  const checkChatting = pathname.split("/")[2];
  const checkBroad = pathname.split("/")[1];
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const mailboxState = useSelector(({mailBoxCtx}) => mailBoxCtx);

  const { type } = globalState.realtimeBroadStatus;

  const [last, setLast] = useState(false);
  const [removeIdx, setRemoveIdx] = useState("");

  useEffect(() => {
    const { message, roomNo, profImg, time, nickNm, memNo } = globalState.realtimeBroadStatus;
    if (message && message !== "") {
      msgArray.push({ message: message, roomNo: roomNo, profImg: profImg, time: time, nickNm: nickNm, memNo: memNo });
      copyArray.push({ message: message, roomNo: roomNo, profImg: profImg, time: time, nickNm: nickNm, memNo: memNo });
    }

    return () => {
      if (globalState.realtimeBroadStatus.status === false) {
        msgArray = [];
        copyArray = [];
      }
    };
  }, [globalState.realtimeBroadStatus]);


  const [msgData , setMsgData ] = useState<any[]>([]);
  useEffect( () => {
    const { message, roomNo, profImg, time, nickNm, memNo } = globalState.realtimeBroadStatus;
    if (message && message !== "") {
      let newMsgValue = { message: message, roomNo: roomNo, profImg: profImg, time: time, nickNm: nickNm, memNo: memNo };
      if (copyArray.length > 0) {
        setMsgData([...msgArray, newMsgValue]);
      } else {
        setMsgData([newMsgValue]);
      }
    } else {
      setMsgData([]);
    }
  }, [globalState.realtimeBroadStatus, last]);

  const makeMonthDay = (date) => {
    return convertDateFormat(date, "MM월 DD일");
    // return `${date.slice(0, 2)}월 ${date.slice(2, 4)}일`;
  };
  const convertDate = (sendDt: any) => {
    let today = new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");
    let date;
    if (sendDt) {
      if (sendDt.slice(0, 8) === today) {
        date = makeHourMinute(sendDt.slice(8, 12));
      } else {
        date = makeMonthDay(sendDt.slice(4, 8));
      }
      return date;
    } else {
      return "";
    }
  };
  const removeItem = (e, roomNo: string) => {
    e.stopPropagation();
    setRemoveIdx(roomNo);
  };

  const msgLocate = (memNo) => {
    // history.push(`/mailbox/chatting/${roomNo}`);
    mailBoxJoin(memNo, dispatch, history);
    dispatch(setGlobalCtxRealtimeBroadStatus({
      message: "",
      roomNo: "",
      time: "",
      nickNm: "",
      memNo: "",
      type: "",
      status: false,
    }));
  };
  //----------------------------

  useEffect(() => {
    if (removeIdx !== "") {
      const idx = msgData.indexOf(removeIdx);
      msgData.splice(idx, 1);
      if (timer) {
        clearTimeout(timer);
      }
      copyArray.shift();
      if (copyArray.length === 0) {
        msgArray = [];
        setLast(true);
      }

      setRemoveIdx("");
    }
    return () => {
      setRemoveIdx("");
    };
  }, [msgData, removeIdx]);

  useEffect(() => {
    if (msgData.length > 0) {
      timer = setTimeout(() => {
        copyArray.shift();
        if (copyArray.length === 0) {
          msgArray = [];
          setLast(true);
        }
      }, 3000);
    }
  }, [msgData]);
  useEffect(() => {
    if (last === true && msgData.length === 0) {
      dispatch(setGlobalCtxRealtimeBroadStatus({
        message: "",
        roomNo: "",
        time: "",
        nickNm: "",
        memNo: "",
        type: "",
        status: false,
      }));
      setLast(false);
    }
  }, [last, msgData]);

  return (
    <>
      {mailboxState.useMailbox && checkChatting !== "chatting" && checkBroad !== "broadcast" && (
        <Wrap>
          {msgData.length > 0 && type === "MailAlarm"
            ? msgData.map((item, idx) => {
                const { memNo } = item;
                return (
                  <React.Fragment key={idx}>
                    <MailtimeBroadWrap>
                      <div className="wrapper mailbox" onClick={() => msgLocate(memNo)}>
                        <img src={item.profImg} alt="프로필 이미지" className="thumb" />
                        <div className="infoWrap">
                          <div className="infoWrap__titleArea">
                            <span className="infoWrap__nick">{item.nickNm}</span>
                            <span className="infoWrap__time">{convertDate(item.time)}</span>
                          </div>
                          <p className="infoWrap__msg">{item.message}</p>
                        </div>
                        <button onClick={(e) => removeItem(e, item.roomNo)} className="close" />
                      </div>
                    </MailtimeBroadWrap>
                  </React.Fragment>
                );
              })
            : msgData.map((item, idx) => {
              console.log(item)
                return (
                  <React.Fragment key={idx}>
                    <RealtimeBroadWrap>
                      <div className="wrapper">
                        <img src={item.profImg} alt="프로필 이미지" className="thumb" />
                        <span className="broadMsg">{item.message}</span>
                        <button onClick={() => setRemoveIdx(item.roomNo)} className="close" />
                      </div>
                    </RealtimeBroadWrap>
                  </React.Fragment>
                );
              })}
        </Wrap>
      )}
      <RealtimeBroadWrap>
        <div className="wrapper">
          <img src={"https://devphoto2.dallalive.com/profile_3/profile_m_200327.jpg?150x150"} alt="프로필 이미지" className="thumb" />
          <span className="broadMsg">{"item.message"}</span>
          <button  className="close" />
        </div>
      </RealtimeBroadWrap>
    </>
  );
}
const Wrap = styled.div`
  .wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .thumb {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .broadMsg {
      width: 234px;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: -0.35px;
      text-align: left;
      color: #000;
    }
    &.mailbox {
      text-align: left;
      justify-content: initial;
      cursor: pointer;
      .infoWrap {
        width: calc(100% - 92px);
        margin-left: 4px;
        &__titleArea {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        &__nick {
          max-width: 188px;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: -0.35px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        &__time {
          font-size: 12px;
          text-align: center;
          letter-spacing: -0.3px;
        }
        &__msg {
          display: -webkit-box;
          overflow: hidden;
          height: 40px;
          margin-top: 2px;
          line-height: 20px;
          font-weight: 500;
          letter-spacing: -0.35px;
          font-size: 14px;
          text-overflow: ellipsis;
          word-break: break-word;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
      .close {
        width: 36px;
        height: 36px;
        margin-left: auto;
        background: url("${IMG_SERVER}/svg/ico_close_b_m.svg");
      }
    }
    .close {
      width: 36px;
      height: 36px;
      background: url("${IMG_SERVER}/svg/ico_close_b_m.svg");
    }
  }
  @keyframes realTimeBroadFadeInOut {
    0% {
      bottom: -50px;
    }
    20% {
      bottom: 24px;
      opacity: 1;
    }
    80% {
      bottom: 24px;
      opacity: 1;
    }
    100% {
      bottom: 50px;
      opacity: 0;
    }
  }
`;
const RealtimeBroadWrap = styled.div`
  position: fixed;
  top: 18px;
  left: 50%;
  opacity: 0;
  display: none;
  transform: translateX(-50%);
  animation-name: realTimeBroadFadeInOut;
  animation-duration: 4s;
  animation-timing-function: ease-in-out;
  width: 360px;
  height: 60px;
  padding: 10px 10px 10px 12px;
  font-size: 16px;
  text-align: center;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
  border-radius: 20px;
  z-index: 120;
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
`;
const MailtimeBroadWrap = styled.div`
  position: fixed;
  top: 18px;
  left: 50%;
  opacity: 0;
  transform: translateX(-50%);
  animation-name: realTimeBroadFadeInOut;
  animation-duration: 3s;
  animation-timing-function: ease-in-out;
  width: 360px;
  height: 72px;
  padding: 6px 10px 12px 12px;
  font-size: 16px;
  text-align: center;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
  border-radius: 20px;
  z-index: 120;
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
`;
