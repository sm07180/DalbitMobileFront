import React, {useContext, useEffect, useState} from 'react'
import {useSelector} from "react-redux";

import Lottie from 'react-lottie'

import Header from 'components/ui/header/Header'
import ListRow from 'components/ui/listRow/ListRow'

import {IMG_SERVER} from 'context/config'
import './style.scss'
import Api from 'context/api'
import photoCommon from "common/utility/photoCommon";
import {withRouter} from "react-router-dom";
import {getDeviceOSTypeChk} from "common/DeviceCommon";
import {RoomValidateFromClip, RoomValidateFromClipMemNo} from "common/audio/clip_func";
import {RoomJoin} from "context/room";
import {Context, GlobalContext} from "context";

const RecentStar = (props) => {
  let pagePerCnt = 50;

  let [listParam, setListParam] = useState({cnt: 0, list: [], photoServerUrl: ""});

  let [pagingParam, setPagingParam] = useState({loading: false, pageNo: 1});

  const context = useContext(Context);

  const gtx = useContext(GlobalContext);

  const mainState = useSelector((state) => state.main);
  useEffect(() => {
    getList(1);
  }, []);

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
  }

  const goLive = (roomNo, memNo, nickNm, listenRoomNo) => {
    if (context.token.isLogin === false) {
      context.action.alert({
        msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
        callback: () => {
          props.history.push('/login')
        }
      })
    } else {
      if (getDeviceOSTypeChk() === 3){
        RoomValidateFromClipMemNo(roomNo === "0" ? listenRoomNo : roomNo, memNo,gtx, props.history, nickNm);
      } else {
        if (roomNo !== "0") {
          RoomJoin({roomNo: roomNo, memNo:memNo, nickNm: nickNm});
        } else {
          RoomJoin({roomNo: listenRoomNo,memNo:memNo, listener: 'listener'});
        }
      }
    }
  }

  useEffect(() => {
    if (typeof document !== "undefined"){
      document.addEventListener("scroll", scrollEvent);
    }

    return () => {
      document.removeEventListener("scroll", scrollEvent);
    }
  }, [listParam, pagingParam]);

  const scrollEvent = () => {
    if (!pagingParam.loading){
      let scrollHeight = document.documentElement.scrollHeight;
      let offsetHeight = document.documentElement.offsetHeight;
      let scrollTop = document.documentElement.scrollTop;
      if (scrollHeight - 10 <= offsetHeight + scrollTop && pagingParam.pageNo < Math.ceil(listParam.cnt / pagePerCnt)){
        setPagingParam({...pagingParam, loading: true});
        getList(pagingParam.pageNo + 1);
      }
    }
  }
  
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
                <div className="userNick">
                  {val.nickNm}
                </div>
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