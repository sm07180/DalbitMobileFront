import React, {useContext, useEffect, useState} from 'react'

import {useHistory, withRouter} from "react-router-dom";
import {IMG_SERVER} from 'context/config'
import {RoomValidateFromClipMemNo} from "common/audio/clip_func";
import {getDeviceOSTypeChk} from "common/DeviceCommon";
import {RoomJoin} from "context/room";
import {addComma} from "lib/common_fn";

import Api from "context/api";
import Lottie from 'react-lottie'
import DetailView from '../components/DetailView'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const StarDj = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const [specialList, setSpecialList] = useState([]);

  let date = new Date();

  const [dateVal, setDateVal] = useState({year: date.getFullYear(), month: date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1, title: "이번달"});

  const getSpecialList = (year, month) => {
      Api.getSpecialDjHistory({
        yy: year,
        mm: month
      }).then((res) => {
        if (res.result === 'success') {
          setSpecialList(res.data.list);
        }
      });
  }

  const goLive = (roomNo, memNo, nickNm) => {
    if (globalState.token.isLogin === false) {
      dispatch(setGlobalCtxMessage({type:'alert',
        msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
        callback: () => {
          history.push('/login')
        }
      }))
    } else {
      if (getDeviceOSTypeChk() === 3){
        RoomValidateFromClipMemNo(roomNo,memNo, dispatch, globalState, history, nickNm);
      } else {
        if (roomNo !== '') {
          RoomJoin({roomNo: roomNo, memNo: memNo, nickNm: nickNm})
        }
      }
    }
  }

  const golink = (path) => {
    history.push(path);
  }

  useEffect(() => {
    getSpecialList(dateVal.year, dateVal.month);
  }, [dateVal]);

  useEffect(() => {
    getSpecialList(dateVal.year, dateVal.month);
  }, []);

  /* 팬 해제 */
  const deleteFan = (memNo, memNick) => {
    dispatch(setGlobalCtxMessage({type:'confirm',
      msg: `${memNick} 님의 팬을 취소 하시겠습니까?`,
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

  /* 팬 등록 */
  const addFan = (memNo, memNick) => {
    Api.fan_change({data: {memNo}}).then(res => {
      if (res.result === 'success') {
        fanCallback(memNo);
        dispatch(setGlobalCtxMessage({type:'toast',
          msg: `${memNick ? `${memNick}님의 팬이 되었습니다` : '팬등록에 성공하였습니다'}`
        }))
      } else if (res.result === 'fail') {
        dispatch(setGlobalCtxMessage({type:'alert',
          msg: res.message
        }))
      }
    })
  }

  const fanCallback = (memNo) => {
    let editFan = specialList.map((v, i) => {
      return v.memNo === memNo ? v.fanYn === "y" ? {...v,fanYn: "n" } : {...v, fanYn: "y"} : {...v};
    })
    setSpecialList(editFan);
  }

  return (
    <>
      <div className='starDjInfo'>
        <DetailView dateVal={dateVal} setDateVal={setDateVal}/>
        <div className='starDjTop'>
          <div className='infoText'>
            <span>달라의 셀럽,</span>
            <p>이 달의 Star DJ를 소개합니다.</p>
            <button onClick={() => golink("/starDj/benefits")}>혜택 보러가기</button>
          </div>
          <div className='infoDecoration'>
            <img src='https://image.dalbitlive.com/honor/starDj/honor_starDj-topBadge.png' alt='스타DJ 훈장 이미지'/>
          </div>
        </div>
      </div>
      <div className='starDjWrap'>
        {
          specialList.length > 0 &&
            specialList.map((list, index) => {
              return (
                <div className='starDjList' key={index} onClick={() => {golink(`/profile/${list.memNo}`)}}>
                  <div className='photoWrap'>
                    <div className='thumbnail'>
                      <img src={`${list.profImg.thumb150x150}`} alt={`${list.nickNm}님의 프로필 이미지`}/>
                    </div>
                    {
                      typeof list.roomNo === "undefined" || list.roomNo === null || list.roomNo !== "" ?
                        <div className="badgeLive" onClick={(e) => {
                            e.stopPropagation();
                            if (globalState.token.memNo !== list.memNo){
                              goLive(list.roomNo, list.memNo, list.nickNm);
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
                        : globalState.token.memNo !== list.memNo ?
                          <span className={`fanButton ${list.fanYn=== "y" ? "active" : ""}`} onClick={(e) => {
                            e.stopPropagation();
                            list.fanYn === "y" ? deleteFan(list.memNo, list.nickNm) : addFan(list.memNo, list.nickNm);
                          }}>{list.fanYn=== "y" ? "팬" : "+ 팬등록"}</span>
                        :
                        <>
                        </>
                    }
                  </div>
                  <div className='userInfoWrap'>
                    <div className='infoWrap'>
                      <span className={`gender ${list.gender === "m" ? "male" : "female"}`}></span>
                      <span className='nickName'>{list.nickNm}</span>
                    </div>
                    <div className='dataWrap'>
                      <div className='dataList'>
                        <span className='dataTitle goodCnt'>누적 좋아요</span>
                        <span className='dataNum'><strong>{addComma(list.goodCnt)}</strong>개</span>
                      </div>
                      <div className='dataList'>
                        <span className='dataTitle listenerCnt'>누적 청취자</span>
                        <span className='dataNum'><strong>{addComma(list.listenerCnt)}</strong>명</span>
                      </div>
                      <div className='dataList'>
                        <span className='dataTitle broadMin'>누적 방송시간</span>
                        <span className='dataNum'><strong>{addComma(list.broadMin)}</strong>분</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
        }
      </div>
    </>
  )
}

export default withRouter(StarDj)
