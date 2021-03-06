import React, {useContext, useEffect, useState} from 'react'

import {useHistory, withRouter} from "react-router-dom";
import {IMG_SERVER, PHOTO_SERVER} from 'context/config'
import {RoomValidateFromClipMemNo} from "common/audio/clip_func";
import {getDeviceOSTypeChk} from "common/DeviceCommon";

import Api from "context/api";
import Lottie from 'react-lottie'
import photoCommon from "common/utility/photoCommon";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const PartnerDj = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const [listData, setListData] = useState({cnt: 0, list: []});

  const [scrollParam, setScrollParam] = useState({loading: false, pageNo: 1, pagePerCnt: 100});

  useEffect(() => {
    getPartnerDj(1);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined"){
      document.addEventListener("scroll", scrollEvent);
    }

    return () => {
      document.removeEventListener("scroll", scrollEvent);
    }
  }, [listData, scrollParam]);

  const scrollEvent = () => {
    let scrollHeight = document.documentElement.scrollHeight;
    let scrollTop = document.documentElement.scrollTop
    let height = document.documentElement.offsetHeight;
    let lastPage = Math.ceil(listData.cnt / scrollParam.pagePerCnt)
    if (scrollHeight - 5 < scrollTop + height && !scrollParam.loading && scrollParam.pageNo < lastPage){
      setScrollParam({...scrollParam, loading: true});
      getPartnerDj(scrollParam.pageNo + 1);
    }
  }

  const getPartnerDj = (pageNo) => {
    Api.getPartnerDjList({
      pageNo: pageNo,
      pagePerCnt: scrollParam.pagePerCnt
    }).then((res) => {
      if (res.result === "success"){
        setListData({cnt: res.data[0][0], list: listData.list.concat(res.data[1])})
        if (pageNo > 1){
          setScrollParam({...scrollParam, pageNo: pageNo, loading: false});
        }
      }
    })
  }

  const goLive = (roomNo, memNo, nickNm) => {
    if (globalState.token.isLogin === false) {
      dispatch(setGlobalCtxMessage({type:'alert',
        msg: '?????? ???????????? ??????<br/>???????????? ????????????.',
        callback: () => {
          history.push('/login')
        }
      }))
    } else {
      if (getDeviceOSTypeChk() === 3){
        RoomValidateFromClipMemNo(roomNo,memNo, dispatch, globalState, history, nickNm);
      } else {
        if (roomNo !== '') {
          RoomJoin({roomNo: roomNo, memNo:memNo, nickNm: nickNm})
        }
      }
    }
  }

  const golink = (path) => {
    history.push(path);
  }

  /* ??? ?????? */
  const addFan = (memNo, memNick) => {
    Api.fan_change({data: {memNo}}).then(res => {
      if (res.result === 'success') {
        fanCallback(memNo);
        dispatch(setGlobalCtxMessage({type:'toast',
          msg: `${memNick ? `${memNick}?????? ?????? ???????????????` : '???????????? ?????????????????????'}`
        }))
      } else if (res.result === 'fail') {
        dispatch(setGlobalCtxMessage({type:'alert',
          msg: res.message
        }))
      }
    })
  }

  /* ??? ?????? */
  const deleteFan = (memNo, memNick) => {
    dispatch(setGlobalCtxMessage({type:'confirm',
      msg: `${memNick} ?????? ?????? ?????? ???????????????????`,
      callback: () => {
        Api.mypage_fan_cancel({data: {memNo}}).then(res => {
          if (res.result === 'success') {
            fanCallback(memNo);
            dispatch(setGlobalCtxMessage({type:'toast', msg: res.message }))
          } else if (res.result === 'fail') {
            dispatch(setGlobalCtxMessage({type:'alert', msg: res.message }))
          }
        });
      }
    }))
  }

  const fanCallback = (memNo) => {
    let editFan = listData.list.map((v, i) => {
      return v.mem_no === memNo ? v.fanYn === "y" ? {...v,fanYn: "n" } : {...v, fanYn: "y"} : {...v};
    })
    setListData({...listData, list: editFan});
  }

  return (
    <>
      <div className='partnerDjInfo'>
        <div className='infoText'>
          <span>????????? DJ???,</span>
          <p>????????? ???????????? ????????? ??????<br/>????????? ?????? DJ ?????????.</p>
          <button onClick={() => golink("/partnerDj")}>???????????????</button>
        </div>
        <div className='infoDecoration'>
          <img src='https://image.dalbitlive.com/honor/partnerDj/honor_partnerDj-topBadge.png' alt='?????????DJ ?????? ?????????'/>
        </div>
      </div>
      <div className='partnerDjWrap'>
        {
          listData.list.length > 0 &&
            listData.list.map((list, index) => {
              return (
                <div className='partnerDjList' key={index} onClick={() => golink(`/profile/${list.mem_no}`)}>
                  <div className='thumbnail'>
                    <img src={photoCommon.getPhotoUrl(list.image_profile, "700X700")} alt=''/>
                  </div>
                  <div className='userInfo'>
                    <div className='userData'>
                      <span className={`${list.mem_sex === "m" ? "male" : "female"}`}></span>
                      <span className='nickNm'>{list.mem_nick}</span>
                    </div>
                    {
                      typeof list.room_no === "undefined" || list.room_no === null || list.room_no !== "" ?
                        <div className="badgeLive" onClick={(e) => {
                            e.stopPropagation();
                            if (globalState.token.memNo !== list.mem_no){
                              goLive(list.room_no, list.mem_no, list.mem_nick);
                            }
                          }}>
                          <span className='equalizer'>
                            <Lottie
                              options={{
                                loop: true,
                                autoPlay: true,
                                path: `${IMG_SERVER}/dalla/ani/equalizer_pink.json`
                              }}
                            />
                          </span>
                          <span className='liveText'>LIVE</span>
                        </div>
                        : globalState.token.memNo !== list.mem_no ?
                        <span className={`fanButton ${list.fanYn=== "y" ? "active" : ""}`} onClick={(e) => {
                          e.stopPropagation();
                          list.fanYn === "y" ? deleteFan(list.mem_no, list.mem_nick) : addFan(list.mem_no, list.mem_nick);
                        }}>{list.fanYn=== "y" ? "???" : "+ ?????????"}</span>
                        :
                        <>
                        </>
                    }
                  </div>
                </div>
              )
            })
        }
      </div>
    </>
  )
}

export default withRouter(PartnerDj)
