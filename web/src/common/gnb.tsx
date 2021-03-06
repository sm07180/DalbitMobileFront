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

// others
import {HostRtc, rtcSessionClear, UserType} from "common/realtime/rtc_socket";
import LayerPopupCommon from "../common/layerpopup/index";
import {MediaType} from "pages/broadcast/constant";
import {authReq} from 'pages/self_auth'
import {IMG_SERVER} from "../constant/define";
import {useDispatch, useSelector} from "react-redux";
import {setIsRefresh} from "../redux/actions/common";
import {setNoticeData, setNoticeTab} from "../redux/actions/notice";
import API from "../context/api";
import moment from "moment";
import {setMailBoxIsMailBoxNew} from "../redux/actions/mailBox";
import {
  setGlobalCtxAlertStatus,
  setGlobalCtxBroadClipDim,
  setGlobalCtxRtcInfoEmpty,
  setGlobalCtxRtcInfoInit
} from "../redux/actions/globalCtx";
import {searchDataReset} from "../pages/research";

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
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const { baseData, clipPlayer, chatInfo, rtcInfo } = globalState;
  const mailboxState = useSelector(({mailBoxCtx}) => mailBoxCtx);
  const history = useHistory();
  const member = useSelector((state)=> state.member)
  const isDesktop = useSelector((state)=> state.common.isDesktop)
  const search = useSelector(state => state.search)
  const dispatch = useDispatch();

  const [showLayer, setShowLayer] = useState(false);
  const [popupState, setPopupState] = useState<boolean>(false);

  const [activeType, setActiveType] = useState('');

  const [isGnb, setIsGnb] = useState(true);
  const alarmData = useSelector(state => state.newAlarm);

  const nowDay = moment().format('YYYYMMDD');

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
          dispatch(setGlobalCtxAlertStatus({
            status: true,
            type: "confirm",
            title: "본인인증을 완료해주세요",
            content: `방송하기, 클립 녹음, 클립 업로드를 하기 위해 본인인증을 완료해주세요.`,
            callback: () => {
              authReq({code: '9',formTagRef: globalState.authRef, dispatch});
            },
          }));

        }else {
          dispatch(setGlobalCtxAlertStatus({
            status: true,
            content: '본인인증을 이미 완료했습니다.<br/>1일 1회만 가능합니다.',
          }));
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
              dispatch(setGlobalCtxAlertStatus({
                status: true,
                type: "confirm",
                content: `현재 ${rtcInfo.userType === UserType.HOST ? "방송" : "청취"} 중인 방송방이 있습니다. ${msgText}`,
                callback: () => {
                  if (chatInfo !== null && rtcInfo !== null) {
                    chatInfo.privateChannelDisconnect();
                    rtcInfo.socketDisconnect();
                    rtcInfo.stop();
                    dispatch(setGlobalCtxRtcInfoEmpty());
                    rtcSessionClear();
                  }

                  scrollToTop();
                  if ("broadcast_setting" === category) {
                    checkBroadcast(category);
                  } else {
                    dispatch(setGlobalCtxBroadClipDim(false));
                    history.push(`/${category}`);
                  }
                },
              })
          ));
        }
        if (clipPlayer !== null) {
          return (
              dispatch(setGlobalCtxAlertStatus({
                status: true,
                type: "confirm",
                content: `현재 재생 중인 클립이 있습니다. ${msgText}`,
                callback: () => {
                  clipPlayer.clipExit();
                  scrollToTop();
                  if ("broadcast_setting" === category) {
                    checkBroadcast(category);
                  } else {
                    dispatch(setGlobalCtxBroadClipDim(false));
                    history.push(`/${category}`);
                  }
                },
              })
          ));
        }

        scrollToTop();
        if ("broadcast_setting" === category) {
          checkBroadcast(category);
        } else {
          dispatch(setGlobalCtxBroadClipDim(false));
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
          dispatch(setGlobalCtxRtcInfoEmpty())
          rtcSessionClear();
        }
        dispatch(setGlobalCtxBroadClipDim(false));
        history.push(`/${category}`);
      } else {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          type: "confirm",
          content: exitRes.message,
          callback: () => {
            dispatch(setGlobalCtxBroadClipDim(false));
          },
        }));
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
      dispatch(setGlobalCtxRtcInfoInit(newRtcInfo));
      sessionStorage.setItem("room_no", roomNo);

      dispatch(setGlobalCtxBroadClipDim(false));
      history.push(`/broadcast/${roomNo}`);
    };

    const { result, message, code, data } = await broadcastCheck();
    if (result === "success") {
      if (code === "1") {
        // 진행중인 방송 존재
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          type: "confirm",
          content: message,
          confirmText: "방송종료",
          cancelCallback: () => {
            dispatch(setGlobalCtxBroadClipDim(false));
          },
          callback: () => {
            roomExit(data.roomNo);
          },
        }));
      } else if (code === "2") {
        //비정상된 방이 있음 => 이어하기와 동일하게 수정
        dispatch(setGlobalCtxAlertStatus({
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
                dispatch(setGlobalCtxAlertStatus({
                  status: true,
                  type: "alert",
                  content: infoRes.message,
                  callback: () => {
                    dispatch(setGlobalCtxBroadClipDim(false));
                  },
                }));
              }
            })();
          },
          // 새로방송하기
          callback: () => {
            roomExit(data.roomNo);
          },
        }));
      } else if (code === "C100") {
        // 이어하기 가능
        dispatch(setGlobalCtxAlertStatus({
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
                dispatch(setGlobalCtxAlertStatus({
                  status: true,
                  type: "alert",
                  content: continueRes.message,
                  callback: () => {
                    dispatch(setGlobalCtxBroadClipDim(false));
                  },
                }));
              }
            })();
          },
          //새로방송하기
          callback: () => {
            dispatch(setGlobalCtxBroadClipDim(false));
            history.push(`/${category}`);
          },
        }));
      } else {
        dispatch(setGlobalCtxBroadClipDim(false));
        history.push(`/${category}`);
      }
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "alert",
        content: message,
        callback: () => {
          dispatch(setGlobalCtxBroadClipDim(false));
        },
      }));
    }
  };

  const updateDispatch = (event) => {
    if(location.pathname.includes('customer_clear')) {
      history.push('/login');
    }else if(location.pathname.includes('customer')) {
      if (event.detail.result == "success" && event.detail.code == "0") {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          content: "본인인증 완료되었습니다.",
          callback: () => location.replace("/"),
          cancelCallback: () => location.reload(),
        }));
      } else {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          content: event.detail.message,
        }));
      }
    }
  };

  //새 알림 조회
  const fetchMypageNewCntData = async (memNo) => {
    const res = await API.getMyPageNew(memNo);
    if(res.result === "success") {
      if(res.data) {
        dispatch(setNoticeData(res.data));
      }}
  }

  // 헤더 gnb 영역 클릭
  const gnbTypeClick = (item) => {
    if(item.url.includes('/search')) {
      searchDataReset({searchData: search, dispatch})
    }

    if(item.isUpdate && activeType === item.url) {
      dispatch(setIsRefresh(true))
    }else {
      history.push(item.url);
    }
  }

  useEffect(() => {
    if(isDesktop && globalState.token.isLogin) {
      fetchMypageNewCntData(globalState.profile.memNo);
    }
    return () => {
      dispatch(setGlobalCtxBroadClipDim(false));
    }
  }, []);

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
        dispatch(setMailBoxIsMailBoxNew(data.isNew));
      } else {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          type: "alert",
          content: message,
        }));
      }
    };
    if (globalState.baseData.isLogin) {
      mailboxNewCheck();
    } else {
      dispatch(setMailBoxIsMailBoxNew(false));
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
                      className={
                        `${activeType === item.url ? 'active' : (activeType.indexOf("/rankDetail") > -1 || activeType.indexOf('/rankBenefit') > -1) && item.url === "/rank" ? "active" : ''}
                         ${(activeType !== item.url || item.isUpdate) ? 'cursorPointer' : ''}`
                      }
                      onClick={() => {gnbTypeClick(item)}}
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
                            if(item.url === "/alarm" && alarmData.notice === 0) {
                              dispatch(setNoticeTab("알림"));
                            } else if(item.url === "/alarm" && alarmData.notice > 0) {
                              dispatch(setNoticeTab("공지사항"));
                            }
                            history.push(item.url)
                          }}
                      >
                        {item.url === '/store' && !moment(nowDay).isAfter(moment('20220428')) && <span className="saleStore">SALE</span>}
                        {item.url === '/mailbox' && mailboxState.isMailboxNew && <span className="newDot"/>}
                        {item.url === '/alarm' && (alarmData.alarm || alarmData.notice) > 0 && <span className="newDot"/>}
                      </li>
                    )
                  })}
                </ul>
                <button className="plusButton" onClick={()=>{
                  if (baseData.isLogin === true) {
                    scrollToTop();
                    return dispatch(setGlobalCtxBroadClipDim(true));
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
        <div id="dim-layer" onClick={() => dispatch(setGlobalCtxBroadClipDim(false))}>
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
