import React, { useContext, useEffect, useState, useRef } from "react";
// api
import { getLikeList } from "common/api";
import { DalbitScroll } from "common/ui/dalbit_scroll";
// constant
import { tabType } from "../../constant";
// ctx
import { GlobalContext } from "context";
import NoResult from "common/ui/no_result";
import {useDispatch, useSelector} from "react-redux";
import {setBroadcastCtxRightTabType, setBroadcastCtxUserMemNo} from "../../../../redux/actions/broadcastCtx";

// flag
let currentPage = 1;
let moreState = false;
let timer;
export default function LikeList(props: { profile: any; roomNo: string }) {
  const { profile, roomNo } = props;
  // ctx
  const dispatch = useDispatch();
  const broadcastState = useSelector(({broadcastCtx})=> broadcastCtx);
  const { globalState, globalAction } = useContext(GlobalContext);
  const { userMemNo } = broadcastState;
  // state
  const [likelist, setLikelist] = useState<any>([]);
  const [nextList, setNextList] = useState([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const scrollContentRef = useRef<any>();
  const viewProfile = (memNo?: any) => {
    dispatch(setBroadcastCtxRightTabType(tabType.PROFILE));
    if (memNo) {
      dispatch(setBroadcastCtxUserMemNo(memNo));
    }
  };
  async function fetchData(next?) {
    if (!next) currentPage = 1;
    currentPage = next ? ++currentPage : currentPage;
    const { result, data, message } = await getLikeList({
      roomNo: roomNo,
      page: currentPage,
      records: 20,
    });
    if (result === "success" && data.hasOwnProperty("list")) {
      if (data.list.length === 0) {
        if (!next) {
          setLikelist([]);
        }
        moreState = false;
      } else {
        setTotalPage(data.paging.totalPage);
        if (next) {
          moreState = true;
          setNextList(data.list);
        } else {
          setLikelist(data.list);
          fetchData("next");
        }
      }
    } else {
      globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          type: "alert",
          content: message,
        });
    }
  }
  const showMoreList = () => {
    setLikelist(likelist.concat(nextList));
    fetchData("next");
  };
  useEffect(() => {
    if (scrollContentRef.current) {
      scrollContentRef.current.addEventListener("scroll", scrollEvtHdr);
    }
    return () => {
      if (scrollContentRef.current) {
        scrollContentRef.current.removeEventListener("scroll", scrollEvtHdr);
      }
    };
  }, [nextList]);
  const scrollEvtHdr = (event) => {
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(function() {
      //스크롤1
      const scrollContentElem = scrollContentRef.current;
      const scrollContentHeight = scrollContentElem.clientHeight;
      const ScrollContentBottomHeight = scrollContentElem.scrollHeight;

      if (moreState && scrollContentHeight >= ScrollContentBottomHeight - 380) {
        if (nextList.length !== 0) {
          showMoreList();
        }
      } else {
      }
    }, 120);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h3
        className="tabTitle"
        onClick={() => {
          viewProfile();
        }}
      >
        좋아요 내역
      </h3>
      <div className="userListWrap userListWrap--like">
        {likelist && likelist.length > 0 ? (
          <div className="userBox likeList" ref={scrollContentRef}>
            <>
              {likelist.map((v, i) => {
                return (
                  <div className={`user ${!v.isJoin ? `isActive` : ""}`} key={`likelist-${i}`}>
                    <div
                      className="user__box"
                      onClick={() => {
                        viewProfile(v.memNo);
                      }}
                    >
                      <div className="user__thumb" style={{ backgroundImage: `url(${v.profImg.url})` }}></div>
                      <div className="user__infoBox">
                        <span className="user__infoBox--sub">
                          {v.auth === 1 && <span className="user__badge manager">매니저</span>}
                          {v.isNewListener === true && <span className="user__badge new">신입청취자</span>}
                          {v.commonBadgeList &&
                            v.commonBadgeList.map((badge, badgeIdx) => {
                              const { text, icon, startColor, endColor } = badge;
                              if (icon && icon != null && icon != "") {
                                return (
                                  <span
                                    className="fan-badge"
                                    style={{
                                      background: `linear-gradient(to right, ${startColor}, ${endColor})`,
                                    }}
                                    key={badgeIdx}
                                  >
                                    <img src={icon} alt={text} />
                                    <span>{text}</span>
                                  </span>
                                );
                              } else {
                                return (
                                  <span
                                    className="fan-badge-text"
                                    style={{
                                      backgroundColor: `${startColor}`,
                                      border: `solid 1px ${endColor}`,
                                    }}
                                    key={badgeIdx}
                                  >
                                    {text}
                                  </span>
                                );
                              }
                            })}
                          <span className="user__nickNm">{v.nickNm}</span>
                        </span>
                      </div>
                      <div className={`user__likeCnt ${v.isJoin ? `isActive` : ""}`}>{v.goodCnt}</div>
                    </div>
                  </div>
                );
              })}
            </>
          </div>
        ) : (
          <NoResult text="좋아요 내역이 없습니다." />
        )}
      </div>
    </>
  );
}
