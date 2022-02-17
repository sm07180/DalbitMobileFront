/**
 * @files login/index.tsx
 * @brief 로그인 인덱스
 */
import React, { useContext } from "react";

//components
import LoginForm from "./login_form";
import { postLogin, getProfile, postMemberListen, postAdmin } from "common/api";
import "./login.scss";

// context
import { useHistory } from "react-router-dom";

// utility
import { setCookie } from "common/utility/cookie";

// static
import { CHAT_CONFIG } from "constant/define";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxAlertStatus, setGlobalCtxBaseData, setGlobalCtxUserProfile} from "../../../redux/actions/globalCtx";

export default function login() {
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const { baseData, chatInfo } = globalState;

  const onSubmit = (form: { id: string; password: string }) => {
    async function login() {
      const nowRoomNo = sessionStorage.getItem("room_no");
      const { result, data, message, code } = await postLogin({
        memType: "p",
        memId: form.id,
        memPwd: form.password,
        room_no: nowRoomNo === null || nowRoomNo === undefined ? "" : nowRoomNo,
      });
      if (result === "success") {
        dispatch(setGlobalCtxBaseData(data));
        const { authToken, memNo, isLogin } = data;
        setCookie("authToken", authToken, 3);

        if (isLogin === true && chatInfo !== null) {
          const socketUser = {
            authToken,
            memNo,
            locale: CHAT_CONFIG.locale.ko_KR,
            roomNo: chatInfo.chatUserInfo.roomNo,
          };
          chatInfo.setUserInfo(socketUser);
          chatInfo.sendLogin();
        }

        if (isLogin === true) {
          getProfile({ memNo }).then((res) => {
            const { result, data } = res;
            if (result === "success") {
              dispatch(setGlobalCtxUserProfile(data));
            }
          });
        }

        history.goBack();
      } else {
        if (code === "-6") {
          const memNo = data.memNo;
          dispatch(setGlobalCtxAlertStatus({
            type: "confirm",
            status: true,
            content: "이미 로그인 된 기기가 있습니다.\n방송 입장 시 기존기기의 연결이 종료됩니다.\n그래도 입장하시겠습니까?",
            callback: () => {
              postMemberListen({ memNo: memNo }).then((res) => {
                if (res.result === "success") {
                  window.setTimeout(() => {
                    login();
                  }, 700);
                } else {
                  dispatch(setGlobalCtxAlertStatus({
                    status: true,
                    content: res.message,
                  }));
                }
              });
            },
          }));
        } else if (code === "-3" || code === "-5") {
          let msg = data.opMsg;
          if (msg === undefined || msg === null || msg === "") {
            msg = message;
          }
          dispatch(setGlobalCtxAlertStatus({
            title: "달빛라이브 사용 제한",
            type: "html",
            status: true,
            content: `${msg}`,
          }));
        } else {
          dispatch(setGlobalCtxAlertStatus({
            status: true,
            content: message,
          }));
        }
      }
    }

    login();
  };

  return <LoginForm onSubmit={onSubmit} />;
}
