import React, { useContext, useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
// api
import { getBroadcastListeners } from "common/api";

// component
import { DalbitScroll } from "common/ui/dalbit_scroll";

// ctx
import { GuestContext } from "context/guest_ctx";

// constant
import { tabType } from "pages/broadcast/constant";

// component
import ListenerListItem from "./listener_list_item";
import { AuthType } from "constant";
import {thumbInlineStyle} from "../../../../common/pip/PlayerStyle";
import {useDispatch, useSelector} from "react-redux";
import {getList, nextList, prevList, setListParam} from "../../../../redux/actions/broadcast/listener";
import {initialState} from "../../../../redux/reducers/broadcast";
import {setBroadcastCtxRightTabType, setBroadcastCtxUserMemNo} from "../../../../redux/actions/broadcastCtx";

export default function ListenerList(props: { roomInfo: any; roomOwner: boolean; roomNo: string; profile: any }) {
  const { roomInfo, roomOwner, roomNo, profile } = props;

  const history = useHistory();

  const dispatch = useDispatch();
  const broadcastRdx = useSelector(({broadcast})=> broadcast);
  // ctx
  const globalState = useSelector(({globalCtx})=> globalCtx);
  const broadcastState = useSelector(({broadcastCtx})=> broadcastCtx);
  const { guestState } = useContext(GuestContext);
  const { isLogin } = globalState.baseData;
  const { userCount } = broadcastState;
  const { guestConnectStatus, guestObj } = guestState;
  // state
  const [pageInfo, setPageInfo] = useState({
    page:1
    , pagePerCnt:50
  })
  // 프로필 보기
  const viewProfile = useCallback((memNo: string) => {
    if (isLogin === true) {
      dispatch(setBroadcastCtxRightTabType(tabType.PROFILE));
      dispatch(setBroadcastCtxUserMemNo(memNo));
    } else {
      return history.push("/login");
    }
  }, []);

  // fetch data
  const [init , setInit] = useState(false);

  if(!broadcastState.roomInfo){
    return <></>
  }

  useEffect(() => {
    // if(!init){
    //   setInit(true);
    //   fetchData().then(()=>{
    //     setInit(false);
    //   });
    // }
    dispatch(getList({...initialState.listener.list.param, roomNo:roomNo}))
  }, [broadcastState.roomInfo]);
  // }, [broadcastState.roomInfo.isListenerUpdate]);
  const copy = [...broadcastRdx.listener.list.data.list];
  const listeners = copy.splice((pageInfo.page-1)*pageInfo.pagePerCnt,pageInfo.pagePerCnt);
  const listenersFilter = listeners.filter((user) => user.auth === AuthType.LISTENER && user.isGuest === false);
  const managerFilter = listeners.filter((user) => user.auth === AuthType.MANAGER && user.isGuest === false);
  const guestFilter = listeners.filter((user) => user.isGuest === true);

  return (
    <>
      <h3 className="blind">청취자 리스트</h3>
      <div className="userListWrap">
        <DalbitScroll width={342} onHoverBarVisible={true}>
          <div className="scroll-box">
            <h4 className="subTitle">방송 DJ</h4>
            <div className="userBox">
              {roomInfo && (
                <div className="user user--dj">
                  <span
                    className="user__box"
                    onClick={() => {
                      viewProfile(roomInfo.bjMemNo);
                    }}
                  >
                    <span className="user__thumb" style={thumbInlineStyle(roomInfo.bjProfImg)}>
                      <span className="blind">{roomInfo.bjNickNm}</span>
                    </span>
                    <div className={`user__badge dj ${roomInfo.isNew === true ? "new" : ""}`}>
                      {roomInfo.isNew === true ? "신입DJ" : "DJ"}
                    </div>
                    <span className="user__nickNm">{roomInfo.bjNickNm}</span>
                  </span>
                </div>
              )}
            </div>
            {guestConnectStatus === true && (
              <>
                <h4 className="subTitle">게스트</h4>
                <div className="userBox">
                  {
                    isLogin === true &&
                    <ListenerListItem roomOwner={roomOwner} roomNo={roomNo} profile={profile} data={guestFilter} classNm="listeners" />
                  }
                </div>
              </>
            )}
            {
              managerFilter.length > 0 &&
              <>
                <h4 className="subTitle">방송 매니저</h4>
                <div className="userBox">
                  {
                    isLogin === true &&
                    <ListenerListItem roomOwner={roomOwner} roomNo={roomNo} profile={profile} data={managerFilter} classNm="manager" />
                  }
                </div>
              </>
            }
            <h4 className="subTitle">
              청취자
              <button className="refreshBtn" onClick={()=>{
                dispatch(getList({...initialState.listener.list.param, roomNo:roomNo}));
                setPageInfo({...pageInfo, page: 1})
                // dispatch(setListParam(initialState.listener.list.param));
              }}/>
            </h4>
            <div className="userBox">
              {/*{isLogin === true && Array.isArray(listenersList) && (*/}
              {
                isLogin === true &&
                <ListenerListItem roomOwner={roomOwner} roomNo={roomNo} profile={profile} data={listenersFilter} classNm="listeners" />
              }
            </div>
          </div>
        </DalbitScroll>
      </div>
      <div className="btnWrap" >
        <button className={`paginationBtn ${pageInfo.page === 1 ? 'disabled' : ''}`}
                onClick={()=>{
                  if(pageInfo.page === 1){
                    return;
                  }

                  const page = pageInfo.page-1;
                  if(
                    (page - 1) * pageInfo.pagePerCnt <= broadcastRdx.listener.list.data.list.length
                    && broadcastRdx.listener.list.data.list.length <= page * pageInfo.pagePerCnt
                  ){
                    setPageInfo({...pageInfo, page: pageInfo.page-1})
                  }else{
                    dispatch(getList({
                      roomNo:roomNo,
                      records: broadcastRdx.listener.list.param.records,
                      page: 1
                    }))
                    setPageInfo({...pageInfo, page: 1})
                  }
                }}
        >
          &lt;
        </button>
        <button className={`paginationBtn ${pageInfo.page * pageInfo.pagePerCnt < broadcastRdx.listener.list.data.list.length ? '' : 'disabled'}`}
                onClick={()=>{
                  if(pageInfo.page * pageInfo.pagePerCnt >= broadcastRdx.listener.list.data.list.length){
                    return;
                  }
                  setPageInfo({...pageInfo, page: pageInfo.page+1})
                }}
        >
          &gt;
        </button>
      </div>
    </>
  );
}
