import React, {useEffect, useState} from 'react';

import Api from 'context/api';
import Lottie from 'react-lottie';
import photoCommon from "common/utility/photoCommon";

import Utility from '../../../../components/lib/utility';
import Header from '../../../../components/ui/header/Header';
import ListRow from '../../../../components/ui/listRow/ListRow';

import './recentStar.scss';
import {IMG_SERVER} from 'context/config';
import {withRouter} from "react-router-dom";
import {getDeviceOSTypeChk} from "common/DeviceCommon";
import {RoomValidateFromClipMemNo} from "common/audio/clip_func";
import {RoomJoin} from "context/room";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const RecentStar = (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  
  const [listParam, setListParam] = useState({cnt: 0, list: [], photoServerUrl: ""});
  const [pagingParam, setPagingParam] = useState({loading: false, pageNo: 1});
  
  let pagePerCnt = 50;

  const getList = (pageNo) => {
    let param = {
      pageNo: pageNo,
      pagePerCnt: pagePerCnt
    }
    Api.getStarList(param).then(res => {
      if (res.result === "success"){
        setListParam({cnt: res.data[0], list: listParam.list.concat(res.data[1]), photoServerUrl: res.data[2]});
        if (pageNo > 1){
          setPagingParam({pageNo: pageNo, loading: false});
        }
      }
    })
  };

  const goLive = (roomNo, memNo, nickNm, listenRoomNo) => {
    if (globalState.token.isLogin === false) {
      dispatch(setGlobalCtxMessage({type: "alert",
        msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
        callback: () => {
          props.history.push('/login')
        }
      }))
    } else {
      if (getDeviceOSTypeChk() === 3){
        RoomValidateFromClipMemNo(roomNo === "0" ? listenRoomNo : roomNo, memNo, dispatch, globalState, props.history, nickNm);
      } else {
        if (roomNo !== "0") {
          RoomJoin({roomNo: roomNo, memNo:memNo, nickNm: nickNm});
        } else {
          RoomJoin({roomNo: listenRoomNo,memNo:memNo, listener: 'listener'});
        }
      }
    }
  };

  const scrollEvent = () => {
    if (!pagingParam.loading){
      if (Utility.isHitBottom() && pagingParam.pageNo < Math.ceil(listParam.cnt / pagePerCnt)) {
        setPagingParam({...pagingParam, loading: true});
        getList(pagingParam.pageNo + 1);
      }
    }
  };

  useEffect(() => {
    getList(pagingParam.pageNo);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined"){
      document.addEventListener("scroll", scrollEvent);
    }
    return () => {
      document.removeEventListener("scroll", scrollEvent);
    }
  }, [listParam, pagingParam]);

  return (
    <div id="recentStar">
      <Header title="최근 접속한 스타" type="back"/>
      <section className="starList">
        {listParam.list && listParam.list.length > 0 &&
          listParam.list.map((val, i) => {
            return(
              <ListRow photo={photoCommon.getPhotoUrl(listParam.photoServerUrl, val.profImgUrl, "120x120")} key={"myStar" + i} onClick={() => {
                if (val.memNo !== undefined && val.memNo > 0) {
                  props.history.push(`/profile/${val.memNo}`);
                }
              }} photoClick={() => {
                if (val.memNo !== undefined && val.memNo > 0) {
                  props.history.push(`/profile/${val.memNo}`);
                }
              }}>
                <div className="userNick">{val.nickNm}</div>
                <div className="listBack">
                  {val.roomNo !== "0" &&
                    <div className="badgeLive" onClick={(e) => {
                      e.stopPropagation();
                      goLive(val.roomNo, val.memNo,  val.nickNm, "0");
                    }}>
                      <span className="equalizer">
                        <Lottie
                          options={{
                            loop: true,
                            autoPlay: true,
                            path: `${IMG_SERVER}/dalla/ani/equalizer_pink.json`
                          }}
                        />
                      </span>
                      <div className="liveText">LIVE</div>
                    </div>
                  }
                  {val.listen_room_no !== "0" &&
                    <div className="badgeLive" onClick={(e) => {
                      e.stopPropagation();
                      goLive("0", val.memNo, val.nickNm, val.listen_room_no);
                    }}>
                      <span className="follow"/>
                      <div className="liveText">LIVE</div>
                    </div>
                  }
                </div>
              </ListRow>
            )
        })}
      </section>
    </div>
  );
};

export default withRouter(RecentStar);
