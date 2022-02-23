import React, {useCallback, useContext, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {
  broadcastCheck,
  broadcastContinue,
  broadcastExit,
  broadcastNomalize,
  certificationCheck,
  checkIsMailboxNew,
  selfAuthCheck
} from "common/api";

// context
import {GlobalContext} from "context";
import {MailboxContext} from "context/mailbox_ctx";
// others
import {HostRtc, rtcSessionClear, UserType} from "common/realtime/rtc_socket";
import LayerPopupCommon from "../common/layerpopup/index";
import {MediaType} from "pages/broadcast/constant";
import {authReq} from 'pages/self_auth'
import {IMG_SERVER} from "../constant/define";
import {useDispatch, useSelector} from "react-redux";
import {setIsRefresh} from "../redux/actions/common";
import {setNoticeTab} from "../redux/actions/notice";
import API from "../context/api";

const gnbTypes = [
  {url: '/', isUpdate: true},
  {url: '/clip', isUpdate: true},
  {url: '/search', isUpdate: true},
  {url: '/rank', isUpdate: false},
  // {url: '/mypage', isUpdate: false},
  // {url: '/notice', isUpdate: false},
];

const gntSubTypes = [
  {url: '/mypage'},
  {url: '/mailbox'},
  {url: '/store'},
  {url: '/alarm'},
]

export default function GNB() {
  const context = useContext(GlobalContext);
  const { globalState, globalAction } = context;
  const { baseData, clipPlayer, chatInfo, rtcInfo } = globalState;
  const { mailboxState, mailboxAction } = useContext(MailboxContext);

  const history = useHistory();
  const isDesktop = useSelector((state)=> state.common.isDesktop)
  const dispatch = useDispatch();

  const [showLayer, setShowLayer] = useState(false);
  const [popupState, setPopupState] = useState<boolean>(false);
  const [newCnt, setNewCnt] = useState(0);

  const [activeType, setActiveType] = useState('');

  const [isGnb, setIsGnb] = useState(true);

  //gnbTypes, gntSubTypes : url값 중 해당 페이지의 하위페이지의 조건을 추가하고 싶은 경우에 사용
  const gnbOtherPageCheck = useCallback((url) => {
    return url === '/mypage' && (
      activeType.indexOf('/wallet') > -1
      || activeType.indexOf('/myProfile') > -1
      || activeType.indexOf('/profile') > -1
    );
  },[activeType]);

  const scrollToTop = useCallback(() => {
    window.scrollTo(0, 0);
  }, []);
  const showLayerPopup = () => {
    setShowLayer(true);
    setPopupState(true);
  };
  //dimMenuLink
  const dimLink = async (category: string) => {
    const doAuthCheck = () => {
      certificationCheck().then(res => {
        if(res.data === 'y') {
          globalAction.setAlertStatus &&
          globalAction.setAlertStatus({
            status: true,
            type: "confirm",
            title: "본인인증을 완료해주세요",
            content: `방송하기, 클립 녹음, 클립 업로드를 하기 위해 본인인증을 완료해주세요.`,
            callback: () => {
              // TODO : 본인인증 연결필요
              authReq('9', context.authRef, context);
            },
          });

        }else {
          globalAction.setAlertStatus &&
          globalAction.setAlertStatus({
            status: true,
            content: '본인인증을 이미 완료했습니다.<br/>1일 1회만 가능합니다.',
          });
        }
      });
    }

    /* 본인인증 여부 */
    const authCheck = await selfAuthCheck();
    if(authCheck.result === 'fail') {
      doAuthCheck();
    }else {
      if(globalState.noServiceInfo.americanAge < globalState.noServiceInfo.limitAge) {
        doAuthCheck();
      }else {
        sessionStorage.setItem("isBeforeMailbox", "N");
        let msgText;
        switch (category) {
          case "broadcast_setting":
            msgText = "방송을 생성하시겠습니까?";
            break;
          case "clip_recoding":
            msgText = "클립을 녹음하시겠습니까?";
            break;
          case "clip_upload":
            msgText = "클립을 업로드하시겠습니까?";
            break;

          default:
            break;
        }
        if (rtcInfo !== null && rtcInfo.getPeerConnectionCheck()) {
          return (
              globalAction.setAlertStatus &&
              globalAction.setAlertStatus({
                status: true,
                type: "confirm",
                content: `현재 ${rtcInfo.userType === UserType.HOST ? "방송" : "청취"} 중인 방송방이 있습니다. ${msgText}`,
                callback: () => {
                  if (chatInfo !== null && rtcInfo !== null) {
                    chatInfo.privateChannelDisconnect();
                    rtcInfo.socketDisconnect();
                    rtcInfo.stop();
                    globalAction.dispatchRtcInfo && globalAction.dispatchRtcInfo({ type: "empty" });
                    rtcSessionClear();
                  }

                  scrollToTop();
                  if ("broadcast_setting" === category) {
                    checkBroadcast(category);
                  } else {
                    globalAction.setBroadClipDim!(false);
                    history.push(`/${category}`);
                  }
                },
              })
          );
        }
        if (clipPlayer !== null) {
          return (
              globalAction.setAlertStatus &&
              globalAction.setAlertStatus({
                status: true,
                type: "confirm",
                content: `현재 재생 중인 클립이 있습니다. ${msgText}`,
                callback: () => {
                  clipPlayer.clipExit();
                  scrollToTop();
                  if ("broadcast_setting" === category) {
                    checkBroadcast(category);
                  } else {
                    globalAction.setBroadClipDim!(false);
                    history.push(`/${category}`);
                  }
                },
              })
          );
        }

        scrollToTop();
        if ("broadcast_setting" === category) {
          checkBroadcast(category);
        } else {
          globalAction.setBroadClipDim!(false);
          history.push(`/${category}`);
        }
      }
    }
  };

  const checkBroadcast = async (category) => {
    const roomExit = async (roomNo) => {
      const exitRes = await broadcastExit({ roomNo });
      if (exitRes.result === "success") {
        if (chatInfo && chatInfo !== null) {
          chatInfo.privateChannelDisconnect();
          if (rtcInfo !== null) rtcInfo!.stop();
          globalAction.dispatchRtcInfo!({ type: "empty" });
          rtcSessionClear();
        }
        globalAction.setBroadClipDim!(false);
        history.push(`/${category}`);
      } else {
        globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          type: "confirm",
          content: exitRes.message,
          callback: () => {
            globalAction.setBroadClipDim!(false);
          },
        });
      }
    };

    // 방 정보 설정
    const broadcastMove = (data) => {
      const roomInfo = { ...data, micState: true };

      const { webRtcUrl, webRtcAppName, webRtcStreamName, roomNo, mediaType } = roomInfo;

      const videoConstraints = {
        isVideo: roomInfo.mediaType === MediaType.VIDEO ? true : false,
        videoFrameRate: roomInfo.videoFrameRate,
        videoResolution: roomInfo.videoResolution,
      };

      const newRtcInfo = new HostRtc(UserType.HOST, webRtcUrl, webRtcAppName, webRtcStreamName, roomNo, false, videoConstraints);
      newRtcInfo.setRoomInfo(roomInfo);
      globalAction.dispatchRtcInfo && globalAction.dispatchRtcInfo({ type: "init", data: newRtcInfo });
      sessionStorage.setItem("room_no", roomNo);

      globalAction.setBroadClipDim!(false);
      history.push(`/broadcast/${roomNo}`);
    };

    const { result, message, code, data } = await broadcastCheck();
    if (result === "success") {
      if (code === "1") {
        // 진행중인 방송 존재
        globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          type: "confirm",
          content: message,
          confirmText: "방송종료",
          cancelCallback: () => {
            globalAction.setBroadClipDim!(false);
          },
          callback: () => {
            roomExit(data.roomNo);
          },
        });
      } else if (code === "2") {
        //비정상된 방이 있음 => 이어하기와 동일하게 수정
        globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          type: "confirm",
          content: "2시간 이내에 방송진행 내역이 있습니다. \n방송을 이어서 하시겠습니까?",
          subcont: "※ 이어서 하면 모든 방송데이터 (방송시간, 청취자, 좋아요, 부스터, 선물)를 유지한 상태로 만들어집니다.",
          subcontStyle: { color: `#e84d70` },
          confirmCancelText: "이어서 방송하기",
          confirmText: "새로 방송하기",
          // 이어서방송하기
          cancelCallback: () => {
            (async function() {
              const infoRes = await broadcastNomalize({ roomNo: data.roomNo });
              if (infoRes.result === "success") {
                broadcastMove(infoRes.data);
              } else {
                globalAction.setAlertStatus &&
                globalAction.setAlertStatus({
                  status: true,
                  type: "alert",
                  content: infoRes.message,
                  callback: () => {
                    globalAction.setBroadClipDim!(false);
                  },
                });
              }
            })();
          },
          // 새로방송하기
          callback: () => {
            roomExit(data.roomNo);
          },
        });
      } else if (code === "C100") {
        // 이어하기 가능
        globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          type: "confirm",
          content: "2시간 이내에 방송진행 내역이 있습니다. \n방송을 이어서 하시겠습니까?",
          subcont: "※ 이어서 하면 모든 방송데이터 (방송시간, 청취자, 좋아요, 부스터, 선물)를 유지한 상태로 만들어집니다.",
          subcontStyle: { color: `#e84d70` },
          confirmCancelText: "이어서 방송하기",
          confirmText: "새로 방송하기",
          //이어서방송하기
          cancelCallback: () => {
            (async function() {
              const continueRes = await broadcastContinue();
              if (continueRes.result === "success") {
                broadcastMove(continueRes.data);
              } else {
                globalAction.setAlertStatus &&
                globalAction.setAlertStatus({
                  status: true,
                  type: "alert",
                  content: continueRes.message,
                  callback: () => {
                    globalAction.setBroadClipDim!(false);
                  },
                });
              }
            })();
          },
          //새로방송하기
          callback: () => {
            globalAction.setBroadClipDim!(false);
            history.push(`/${category}`);
          },
        });
      } else {
        globalAction.setBroadClipDim!(false);
        history.push(`/${category}`);
      }
    } else {
      globalAction.setAlertStatus &&
      globalAction.setAlertStatus({
        status: true,
        type: "alert",
        content: message,
        callback: () => {
          globalAction.setBroadClipDim!(false);
        },
      });
    }
  };

  const updateDispatch = (event) => {
    if(location.pathname.includes('customer')) {
      if (event.detail.result == "success" && event.detail.code == "0") {
        globalAction.setAlertStatus!({
          status: true,
          content: "본인인증 완료되었습니다.",
          callback: () => location.replace("/"),
          cancelCallback: () => location.reload(),
        });
      } else {
        globalAction.setAlertStatus!({
          status: true,
          content: event.detail.message,
        });
      }
    }
  };

  const fetchMypageNewCntData = async (memNo) => {
    const res = await API.getMyPageNew(memNo);
    if(res.result === "success") {
      if(res.data) {
        setNewCnt(res.data.newCnt);
      }}
  }

  useEffect(() => {
    return () => globalAction.setBroadClipDim!(false);
  }, []);

  useEffect(() => {
    fetchMypageNewCntData(context.profile.memNo);
  }, [newCnt]);

  useEffect(() => {
    if (globalState.broadClipDim) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [globalState.broadClipDim]);
  useEffect(() => {
    if (popupState === false) {
      if (showLayer) {
        setShowLayer(false);
      }
    }
  }, [popupState]);
  useEffect(() => {
    const mailboxNewCheck = async () => {
      const { result, data, message } = await checkIsMailboxNew({});
      if (result === "success") {
        mailboxAction.setIsMailboxNew && mailboxAction.setIsMailboxNew(data.isNew);
      } else {
        globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          type: "alert",
          content: message,
        });
      }
    };
    if (globalState.baseData.isLogin) {
      mailboxNewCheck();
    } else {
      mailboxAction.setIsMailboxNew && mailboxAction.setIsMailboxNew(false);
    }
  }, [globalState.baseData.isLogin]);

  useEffect(() => {
    setActiveType(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if(location?.pathname.includes('selfauth_result')) {
      setIsGnb(false);
    }
    document.addEventListener("self-auth", updateDispatch);
    return () => {
      document.removeEventListener("self-auth", updateDispatch);
    };
  }, []);

  return (
    <>
      {isDesktop && isGnb &&
      <aside id="GNB">
        <div className="gnbContainer">
          <div className="gnbHeader">
            <h1 onClick={() => {
              if(location.pathname === '/') {
                dispatch(setIsRefresh(true))
              }else {
                history.push('/')
              }
            }}>
              <img src={`${IMG_SERVER}/common/header/LOGO.png`} alt="logo" />
            </h1>
          </div>
          <nav className="gnbNavigation">
            <ul>
              {gnbTypes.map((item, index) => {
                return (
                  <li key={index} data-url={item.url}
                      className={`${activeType === item.url ? 'active' : activeType === "/rankDetail/DJ" && item.url === "/rank" ? "active" : ''} ${(activeType !== item.url || item.isUpdate) ? 'cursorPointer' : ''}`}
                      onClick={() => {
                        history.push(item.url);
                        if(item.isUpdate && activeType === item.url) {
                          dispatch(setIsRefresh(true))
                        }
                      }}
                  >
                    {item.url === '/notice' && globalState.alarmStatus && <span className="newDot"/>}
                  </li>
                )
              })}
            </ul>
          </nav>
          <div className="subGnbNavigation">
            {baseData.isLogin ?
              <>
                <ul>
                  {gntSubTypes.map((item, index) => {
                    return (
                      <li key={index} data-url={item.url}
                          className={`${activeType === item.url || gnbOtherPageCheck(item.url) ? 'active' : ''} ${activeType !== item.url || gnbOtherPageCheck(item.url) ? 'cursorPointer' : ''}`}
                          onClick={() => {
                            if(item.url === "/alarm") {
                              dispatch(setNoticeTab("알림"));
                            }
                            history.push(item.url)
                          }}
                      >
                        {item.url === '/mailbox' && mailboxState.isMailboxNew && <span className="newDot"/>}
                        {newCnt > 0 && <span className="newDot"/>}
                      </li>
                    )
                  })}
                </ul>
                <button className="plusButton" onClick={()=>{
                  if (baseData.isLogin === true) {
                    scrollToTop();
                    return globalAction.setBroadClipDim!(true);
                  }
                }}>만들기</button>
              </>
              :
              <button onClick={()=> history.push("/login")}>로그인</button>
            }
          </div>
        </div>
      </aside>
      }
      {globalState.broadClipDim && (
        <div id="dim-layer" onClick={() => globalAction.setBroadClipDim!(false)}>
          <div className="broadcast-menu">
            <div className="broadcast-menu__links">
              <button className="broad" onClick={() => dimLink("broadcast_setting")} />
              <button className="recoding" onClick={() => dimLink("clip_recoding")} />
              <button className="upload" onClick={() => dimLink("clip_upload")} />
            </div>
          </div>
        </div>
      )}
      {showLayer && <LayerPopupCommon setPopupState={setPopupState} />}
    </>
  );
}
