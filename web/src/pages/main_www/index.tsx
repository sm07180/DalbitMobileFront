import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
  useCallback,
} from "react";
import { Link, useHistory } from "react-router-dom";
import {getMain, getBanner, broadcastList, getInnerServerList} from "common/api";
import { getCookie } from "common/utility/cookie";
import { PAGE_TYPE } from "pages/rank/constant";
import moment from "moment";
// component
import NoResult from "common/ui/no_result";
import Layout from "common/layout";
import LayerPopupWrap from "./content/layer_popup_wrap";
import AttendEventBtn from "./content/attend_event_button";
import LayerPopupInput from "./content/layer_popup_input";
import MainSlide from "./content/main_silde";
import RealTimeRank from "./content/rank_list";
import BannerList from "./content/banner_slide";
import MyStar from "./content/star_list";
import RealTimeLive from "./content/live_list";
import RankingTimer from "./content/ranking_timer";
// static
import Logo from "./static/logo_w_no_symbol.svg";
import Alarm from "./static/alarm_w.svg";
import "./main.scss";

import { openMailboxBanAlert } from "common/mailbox/mail_func";
import { contactRemoveUnique } from "lib/common_fn";
import {resolveAny} from "dns";
import {useDispatch, useSelector} from "react-redux";

import {
  setRankFormRankType, setRankFormPageType
} from "redux/actions/rank";
import {setGlobalCtxBroadClipDim} from "../../redux/actions/globalCtx";

// live list reducer
let timer;
type StatusType = {
  page: any;
  category?: string;
  mediaType?: string;
};
type ActionType = {
  type: string;
  pageIdx?: number;
  categoryVal?: string;
  mediaType?: string;
};
const initial = {
  page: 1,
  category: "",
  mediaType: "",
};

const round = [
  {
    title: "1회차",
    start: "000000",
    end: "100000",
    timer: "080000",
  },
  {
    title: "2회차",
    start: "100000",
    end: "190000",
    timer: "170000",
  },
  {
    title: "3회차",
    start: "190000",
    end: "240000",
    timer: "220000",
  },
];

export default function Main() {
  const history = useHistory();
  const dispatch = useDispatch()
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const mailboxState = useSelector(({mailBoxCtx}) => mailBoxCtx);
  const {
    baseData,
    userProfile,
    splashData,
    alarmStatus,
    isMailboxOn,
  } = globalState;
  // state
  const [listReady, setListReady] = useState(false);
  const [initData, setInitData] = useState<any>({});
  const [rankType, setRankType] = useState<string>("dj");
  const [fanList, setfanList] = useState<Array<any>>([]);
  const [djList, setDjList] = useState<Array<any>>([]);
  const [myStar, setMyStar] = useState<Array<any>>([]);
  const [liveCategoryFixed, setLiveCategoryFixed] = useState(false);
  const [liveRefresh, setLiveRefresh] = useState(false);
  const [liveList, setLiveList] = useState<Array<any>>([]);
  const [liveAlign, setLiveAlign] = useState(1);
  const [liveTotalPage, setLiveTotalPage] = useState(99);
  const [state, stateDispatch] = useReducer(reducer, initial);
  const [scrollOn, setScrollOn] = useState(false);
  const [inputState, setInputState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rankTitle, setRankTitle] = useState<string>("");
  const [redirectList, setRedirectList] = useState<Array<any>>([]);

  // popup
  const [popupMoon, setPopupMoon] = useState<boolean>(false);
  const [popupData, setPopupData] = useState([]);
  const [popupState, setPopupState] = useState(false);
  const [viewLevel, setViewLevel] = useState<number>();
  // refs
  const MainRef = useRef<HTMLDivElement>(null);
  const mainHeaderRef = useRef<HTMLDivElement>(null);
  const RecommendRef = useRef<HTMLDivElement>(null);
  const RankSectionRef = useRef<HTMLDivElement>(null);
  const BannerSectionRef = useRef<HTMLDivElement>(null);
  const StarSectionRef = useRef<HTMLDivElement>(null);
  const LiveSectionRef = useRef<HTMLDivElement>(null);
  const LiveSectionTitleRef = useRef<HTMLDivElement>(null);

  function reducer(state: StatusType, action: ActionType): StatusType {
    switch (action.type) {
      case "PAGE":
        return {
          ...state,
          page: action.pageIdx,
        };
      case "CATEGORY":
        return {
          ...state,
          page: action.pageIdx,
          category: action.categoryVal,
        };

      case "MEDIA_TYPE":
        setLiveList([]);
        setListReady(false);
        return {
          ...state,
          mediaType: action.mediaType,
          page: 1,
        };

      case "INIT":
        return {
          ...state,
          page: 1,
          category: "",
        };
      default:
        throw new Error();
    }
  }

  const swiperParams: any = {
    slidesPerView: "auto",
  };

  const setInputPopup = () => {
    setInputState(false);
  };
  // async
  async function fetchMainData() {
    const { result, data } = await getMain();
    if (result === "success") {
      setInitData(data);
      setfanList(data.fanRank);
      setDjList(data.djRank);
      setMyStar(data.myStar);
      setViewLevel(data.popupLevel);
    }
  }
  async function fetchPopupData(arg) {
    const res = await getBanner({ position: arg });
    if (res.result === "success") {
      if (res.hasOwnProperty("data")) {
        setPopupData(
          res.data.filter((v) => {
            if (getCookie("popup_notice_" + `${v.idx}`) === undefined) {
              return v;
            } else {
              return false;
            }
          })
        );

        setPopupState(true);
      }
    }
  }
  const fetchLiveListData = async (next: boolean) => {
    if (next === false) {
      setLiveList([]);
    }

    const { result, data } = await broadcastList({
      page: state.page,
      mediaType: state.mediaType === "new" ? "" : state.mediaType,
      records: 10,
      roomType: state.category,
      searchType: liveAlign,
      djType: state.mediaType === "new" ? 3 : "",
    });
    if (result === "success") {
      setListReady(true);
      if (data.paging) {
        setLiveTotalPage(data.paging.totalPage);
        setLoading(false);
        if (next === true) {
          const currentList = [...liveList];
          const concatenated = contactRemoveUnique(
            currentList,
            data.list,
            "roomNo"
          );
          setLiveList([...concatenated]);
          // setLiveList(liveList.concat(data.list));
        } else {
          setLiveList(data.list);
          setLiveRefresh(false);
          // setGoingUp(false);
        }
      }
    }
  };
  //return : undefined or {host, api, photo}
  const readDevInfoData = useCallback((selectHost = '') => redirectList.find((v, i) => (v.host === selectHost)), [redirectList]);

  // 내부서버 리스트 세팅
  const fetchServerListData = useCallback(() => {
    //API에서 내부 ip인지 체크 후 서버리스트를 줌
    const api = () => {
      getInnerServerList().then((resolve: any) => {
        const {list, innerChk} = resolve;

        if (list && list.length > 0) {
          setRedirectList(list);
          localStorage.setItem('innerChk', innerChk);
        } else {
          setRedirectList([]);
        }
      });
    };

    const innerIpChk = (ip = '') => {
      const ipArr = ip.split('.');
      console.log(ipArr,ip, ip === 'undefined' || ipArr.length !== 4);
      if(ip === 'undefined' || ipArr.length !== 4) return false;

      const [g1, g2, g3, g4] = ipArr;
      console.log("ip chk logic ", g1, g2, g3, g4, g1 === '61' && g2 === '80' && g3 === '148' && (parseInt(g4) > 0 && parseInt(g4) < 256) || ip === '59.13.127.250' || ip === '59.13.127.251');
      return g1 === '61' && g2 === '80' && g3 === '148' && (parseInt(g4) > 0 && parseInt(g4) < 256) || ip === '59.13.127.250' || ip === '59.13.127.251';
    };

    const clientIp = localStorage.getItem('innerChk');

    if(!clientIp){
      api();
    } else {
      innerIpChk(clientIp) && api();
    }
  },[]);

  // func
  const reLoad = () => {
    window.location.href = "/";
  };
  const changeLiveType = (arg) => {
    stateDispatch({
      type: "CATEGORY",
      pageIdx: 1,
      categoryVal: arg,
    });
    // setGoingUp(false);
  };
  const RefreshFunc = async () => {
    // setReloadInit(true)
    setListReady(false);
    setLiveRefresh(true);

    // dispatch({
    //   ...state,
    //   type: "PAGE",
    //   pageIdx: state.page + 1,
    // });
    stateDispatch({
      type: "INIT",
    });

    // setLiveRefresh(false);
    // setReloadInit(false)
  };
  const openPopupMoon = async () => {
    setPopupMoon(true);
    setPopupState(true);
  };
  useEffect(() => {
    if (state.page !== 1) {
      fetchLiveListData(true);
    } else {
      fetchLiveListData(false);
    }
  }, [state]);

  useEffect(() => {
    if (
      globalState.userProfile &&
      globalState.userProfile.gender === "n" &&
      globalState.userProfile.birth === "20200101"
    ) {
      setInputState(true);
    }
  }, [globalState.userProfile]);

  const LiveSectionTitleNode = LiveSectionTitleRef.current;
  const LiveSectionTitleHeight =
    LiveSectionTitleNode! && LiveSectionTitleNode!.clientHeight - 10;
  useEffect(() => {
    let didFetch = false;

    const scrollEvtHdr = () => {
      if (timer) window.clearTimeout(timer);

      if (window.scrollY >= 1) {
        setScrollOn(true);
      } else {
        setScrollOn(false);
      }

      const mainHeaderNode = mainHeaderRef.current;
      const RecommendNode = RecommendRef.current;
      const RankSectionNode = RankSectionRef.current;
      const StarSectionNode = StarSectionRef.current;
      const BannerSectionNode = BannerSectionRef.current;

      const mainHeaderHeight = mainHeaderNode! && mainHeaderNode!.clientHeight;
      const RecommendHeight = RecommendNode! && RecommendNode!.clientHeight;
      const RankSectionHeight =
        RankSectionNode! && RankSectionNode!.clientHeight;
      const StarSectionHeight = StarSectionNode!
        ? StarSectionNode!.clientHeight
        : 0;
      const BannerSectionHeight =
        BannerSectionNode! && BannerSectionNode!.clientHeight;

      const TopSectionHeight =
        mainHeaderHeight +
        RecommendHeight +
        RankSectionHeight +
        StarSectionHeight +
        BannerSectionHeight;

      const liveSectionNode = LiveSectionRef.current;
      const liveSectionTop =
        liveSectionNode! && liveSectionNode!.offsetTop - 52;
      if (window.scrollY >= liveSectionTop) {
        setLiveCategoryFixed(true);
      } else {
        setLiveCategoryFixed(false);
      }

      timer = window.setTimeout(function() {
        //스크롤
        const windowHeight =
          "innerHeight" in window
            ? window.innerHeight
            : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight,
          html.scrollHeight,
          html.offsetHeight
        );
        const windowBottom = windowHeight + window.pageYOffset;

        if (windowBottom >= docHeight - 300) {
          if (state.page < liveTotalPage && didFetch === false) {
            if ((state.page - 1) * 10 > liveList.length) {
              return;
            }
            stateDispatch({
              type: "PAGE",
              pageIdx: state.page + 1,
            });
            setLoading(true);
          }
        }
      }, 160);
    };
    window.addEventListener("scroll", scrollEvtHdr);
    return () => {
      window.removeEventListener("scroll", scrollEvtHdr);
      didFetch = true;
    };
  }, [state, liveList]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // if (splashData) {
    //   const concatenated = categoryList.concat(splashData.roomType);
    //   setCategoryList(concatenated);
    // }
    fetchMainData();
    fetchPopupData(6);
    fetchServerListData();
  }, []);

  useEffect(() => {
    if (popupState === false) {
      if (popupMoon) {
        setPopupMoon(false);
      }
    }
  }, [popupState]);

  const moveToLogin = (type) => {
    if (baseData.isLogin) {
      switch (type) {
        case "alarm":
          if (globalState.alarmMoveUrl === "") {
            history.push('/menu/alarm');
          } else {
            history.push(`${globalState.alarmMoveUrl}`);
          }
          break;
        case "mailbox":
          openMailboxBanAlert({ userProfile, dispatch, history });
          break;
        default:
          break;
      }
    } else {
      history.push("/login");
    }
  };

  const MainListRoadingBar = () => {
    return (
      <div className="main-loadingWrap">
        <div id="loading">
          <div className="spinner">
            <span></span>
          </div>
        </div>
      </div>
    );
  };

  const LiveListComponent = useCallback(() => {
    if (!listReady) return <MainListRoadingBar />;
    if (Array.isArray(liveList)) {
      if (liveList.length > 0) {
        return (
          <div className="liveList">
            <RealTimeLive list={liveList} liveListType={state.mediaType} />
          </div>
        );
      } else {
        return <NoResult type="default" text="조회 된 검색 결과가 없습니다." />;
      }
    } else {
      return <MainListRoadingBar />;
    }
  }, [liveList, listReady]);

  return (
    <>
      <div id="mainPage" ref={MainRef}>
        <div className="headerWrap" ref={mainHeaderRef}>
          <div className="icon-wrap">
            <button onClick={() => history.push("/search")}>
              <img
                className="iconSearch"
                src="https://image.dalbitlive.com/svg/ico_search_w.svg"
                alt="검색버튼"
              />
            </button>
            <button
              onClick={() => {
                if (baseData.isLogin === true) {
                  return history.push("/store");
                } else {
                  return history.push("/login");
                }
              }}
            >
              <img
                className="iconStore"
                src="https://image.dalbitlive.com/svg/ico_store_w.svg"
                alt="스토어버튼"
              />
            </button>
          </div>
          <h1 className="gnb-logo" onClick={reLoad}>
            <img src={Logo} alt="달라" />
          </h1>
          <div className="icon-wrap">
            {mailboxState.useMailbox &&
              (mailboxState.isMailboxNew ? (
                <div
                  className="alarmSize"
                  onClick={() => moveToLogin("mailbox")}
                >
                  <img
                    className="icon mailbox"
                    src="https://image.dalbitlive.com/svg/postbox_w_on.svg"
                    alt="메시지"
                  />
                </div>
              ) : (
                <div
                  className="alarmSize"
                  onClick={() => moveToLogin("mailbox")}
                >
                  {!isMailboxOn && baseData.isLogin ? (
                    <img
                      className="icon mailbox"
                      src="https://image.dalbitlive.com/svg/postbox_m_w_off.svg"
                      alt="메시지"
                    />
                  ) : (
                    <img
                      className="icon mailbox"
                      src="https://image.dalbitlive.com/svg/postbox_w.svg"
                      alt="메시지"
                    />
                  )}
                </div>
              ))}
            {alarmStatus === true ? (
              <button
                className="iconAlarm"
                onClick={() => {
                  moveToLogin("alarm");
                }}
              >
                <img
                  src="https://image.dalbitlive.com/ani/webp/main/gnb_alarm_w.webp"
                  alt="alarm active"
                  width={40}
                  height={40}
                />
                {/* <Lottie
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData: AlarmOn,
                  }}
                /> */}
              </button>
            ) : (
              <button
                onClick={() => {
                  moveToLogin("alarm");
                }}
              >
                <img className="icon" src={Alarm} alt="알람버튼" />
              </button>
            )}
          </div>
        {/* </div>
        <div id="gnbWrap">
          <Link to={`/`} className="gnbButton gnbButton--active" title="라이브">
            라이브
          </Link>
          <Link
            to={`/clip`}
            className="gnbButton gnbButton--new"
            title="클립 이동"
          >
            클립
            <i className="newIcon">N</i>
          </Link>
          <button
            className="gnbButton gnbButton--liveIcon"
            onClick={() => {
              if (baseData.isLogin === true) {
                return dispatch(setGlobalCtxBroadClipDim(true));
              } else {
                return history.push("/login");
              }
            }}
          >
            방송하기
          </button>
          <Link to={`/rank`} className="gnbButton" title="랭킹 이동">
            랭킹
          </Link>
          <button
            className="gnbButton"
            onClick={() => {
              if (baseData.isLogin === true) {
                return history.push(`/mypage/${globalState.baseData.memNo}`);
              } else {
                return history.push("/mypage");
              }
            }}
          >
            마이
          </button>
        </div> */}

        <div className="mainSlideWrap" ref={RecommendRef}>
          <MainSlide slideList={initData.recommend} />
        </div>

        {viewLevel === 5 ? (
          <button
            className="levelEventBanner"
            onClick={() => history.push("/event/level_achieve")}
          >
            <span className="eventText">💛이벤트💛</span> 5레벨이 되면 달 20개{" "}
            <p className="giftIcon">선물받기</p>
          </button>
        ) : viewLevel === 10 ? (
          <button
            className="levelEventBanner isRed"
            onClick={() => history.push("/event/level_achieve")}
          >
            <span className="eventText isWhite">💛이벤트💛</span> 10레벨이 되면
            달 50개 <p className="giftIcon isRed">선물받기</p>
          </button>
        ) : (
          <></>
        )}

        <div className="mainRankWrap" ref={RankSectionRef}>
          <div className="titleBox">
            <h2>
              <Link
                to={"/rank"}
                title="실시간 랭킹 더보기"
                className="text isArrow"
                onClick={() => {
                  dispatch(setRankFormPageType(PAGE_TYPE.RANKING));
                }}
              >
                <img
                  src="https://image.dalbitlive.com/svg/ranking_live.svg"
                  className="ico-tit"
                  alt="실시간 랭킹"
                />
                실시간 랭킹
                {rankType === "dj" && rankTitle}
              </Link>
            </h2>

            <div className="tabBox">
              <button
                className={`tabBox__button ${
                  rankType === "dj"
                    ? "tabBox__button tabBox__button--active"
                    : ""
                }`}
                onClick={() => {
                  setRankType("dj");
                  dispatch(setRankFormRankType(1));
                }}
              >
                DJ
              </button>
              <button
                className={`tabBox__button ${
                  rankType === "fan"
                    ? "tabBox__button tabBox__button--active"
                    : ""
                }`}
                onClick={() => {
                  setRankType("fan");
                  dispatch(setRankFormRankType(2));
                }}
              >
                팬
              </button>
            </div>
          </div>

          { rankType === "dj" && <RankingTimer round={round} setRankTitle={setRankTitle} /> }

          <div
            className={`rankingList ${
              rankType === "dj" ? "djBadge" : "fanBadge"
            }`}
          >
            {djList && rankType == "dj" ? (
              <RealTimeRank list={djList} type={rankType} />
            ) : fanList && rankType == "fan" ? (
              <RealTimeRank list={fanList} type={rankType} />
            ) : (
              <></>
            )}
          </div>
        </div>

        <div ref={BannerSectionRef} className="bannerWrap">
          <BannerList />
        </div>

        {(globalState.baseData.isLogin === true && myStar === undefined) ||
        myStar.length > 0 ? (
          <div ref={StarSectionRef} className="starWrap">
            <div className="titleBox">
              <h2>
                <Link
                  to={`/profile/${globalState.baseData.memNo}`}
                  title="나의스타 더보기"
                  className="text isArrow"
                >
                  <img
                    src="https://image.dalbitlive.com/svg/mystar_live.svg"
                    className="ico-tit"
                    alt="나의스타"
                  />
                  나의스타
                </Link>
              </h2>
            </div>
            <MyStar list={myStar} />
          </div>
        ) : (
          <></>
        )}

        <div className="liveWrap" ref={LiveSectionRef}>
          <div
            className={`titleWrap ${liveCategoryFixed ? "fixed" : ""}`}
            ref={LiveSectionTitleRef}
          >
            <div className="titleBox">
              <h2 className="text" onClick={RefreshFunc}>
                <button
                  className={`tab_refresh_btn ${liveRefresh ? "on" : ""}`}
                >
                  <img
                    src="https://image.dalbitlive.com/main/ico_live_refresh_new_s.svg"
                    alt="새로고침"
                  />
                </button>
                실시간 LIVE
              </h2>
              <div className="tabBox">
                {/* <span className="text" onClick={() => setPopup(popup ? false : true)}>
                  {(() => {
                    return liveAlign ? `${alignSet[liveAlign]}순` : '전체'
                  })()}
                </span>
                <button className="sequence-icon" onClick={() => setPopup(popup ? false : true)}>
                  <img src={sortIcon} alt="검색 정렬하기" />
                </button> */}
                {/* <button className="btn__moon" onClick={openPopupMoon}>
                  <img src="https://image.dalbitlive.com/main/common/ico_moon.png" alt="달이 된 병아리" />
                </button> */}

                {/* <button className="detail-list-icon" onClick={() => setLiveListType("detail")}>
                  <img
                    src={liveListType === "detail" ? detailListIconActive : detailListIcon}
                    alt="리스트 형식으로 리스트 보여주기"
                  />
                </button>
                <button className="simple-list-icon" onClick={() => setLiveListType("simple")}>
                  <img
                    src={liveListType === "simple" ? simpleListIconActive : simpleListIcon}
                    alt="리스트 형식으로 리스트 보여주기"
                  />
                </button> */}
                <button
                  className={`tab_all_btn ${
                    state.mediaType === "" ? "on" : ""
                  }`}
                  onClick={() => {
                    stateDispatch({
                      type: "MEDIA_TYPE",
                      mediaType: "",
                    });
                  }}
                >
                  전체선택
                </button>

                <button
                  className={`tab_video_btn ${
                    state.mediaType === "v" ? "on" : ""
                  }`}
                  onClick={() =>
                    stateDispatch({
                      type: "MEDIA_TYPE",
                      mediaType: "v",
                    })
                  }
                >
                  비디오 타입
                </button>

                <button
                  className={`tab_radio_btn ${
                    state.mediaType === "a" ? "on" : ""
                  }`}
                  onClick={() =>
                    stateDispatch({
                      type: "MEDIA_TYPE",
                      mediaType: "a",
                    })
                  }
                >
                  라디오 타입
                </button>

                <button
                  className={`tab_new_btn ${
                    state.mediaType === "new" ? "on" : ""
                  }`}
                  onClick={() =>
                    stateDispatch({
                      type: "MEDIA_TYPE",
                      mediaType: "new",
                    })
                  }
                >
                  신입 타입
                </button>
              </div>
            </div>

            {/* <div className="categoryBox">
              <div className="inner-wrapper">
                {Array.isArray(categoryList) && categoryList.length > 1 && (
                  <Swiper {...swiperParams}>
                    {categoryList
                      .sort((a, b) => Number(a.sortNo) - Number(b.sortNo))
                      .map((key, idx) => {
                        return (
                          <div
                            className={`list ${key.cd === state.category ? "active" : ""}`}
                            key={`list-${idx}`}
                            onClick={() => changeLiveType(key.cd)}
                          >
                            {key.cdNm}
                          </div>
                        );
                      })}
                  </Swiper>
                )}
              </div>
            </div> */}
          </div>

          <div
            className="content-wrap inner"
            style={
              liveCategoryFixed
                ? { paddingTop: LiveSectionTitleHeight + `px` }
                : {}
            }
          >
            {state.mediaType === "new" && (
              <img
                src="https://image.dalbitlive.com/main/banner_newMember.png"
                alt="총 방송시간 30시간 미만의 새로운 DJ들입니다. 많은 관심 부탁드립니다!"
                className="newMember_banner"
              />
            )}
            <LiveListComponent />
          </div>
        </div>

        {popupData.length > 0 && (
          <div className="responsiveBox">
            <LayerPopupWrap
              data={popupData}
              setData={setPopupData}
              setPopupState={setPopupState}
            />
          </div>
        )}

        <AttendEventBtn scrollOn={scrollOn}/>
        {inputState && <LayerPopupInput setInputPopup={setInputPopup} />}

        {/*서버 이동*/}
        {redirectList.length > 0 &&
        <select style={{display: 'inline-block', position: 'fixed', bottom: '100px', left: '100px', backgroundColor: 'blue', color: 'white', zIndex: 500, padding: '5px 5px', marginBottom: '-50px'}}
                value={location.origin}
                onChange={(e) => { if(typeof window !=='undefined') window.location.href = e.target.value}}>
          {redirectList.map((v, idx) =>
              <option key={idx} value={v.host}>{v.name}</option>
          )}
        </select>}
        </div>
      </div>
    </>
  );
}
