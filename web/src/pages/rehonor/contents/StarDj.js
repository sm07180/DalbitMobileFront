import React, {useContext, useEffect, useState} from 'react'
import {Context, GlobalContext} from "context";

import {useHistory, withRouter} from "react-router-dom";
import {IMG_SERVER, PHOTO_SERVER} from 'context/config'
import {RoomValidateFromClipMemNo} from "common/audio/clip_func";
import {getDeviceOSTypeChk} from "common/DeviceCommon";
import {RoomJoin} from "context/room";
import { addComma } from "lib/common_fn";

import Api from "context/api";
import Lottie from 'react-lottie'

import photoCommon from "common/utility/photoCommon";
import DetailView from '../components/DetailView'

const StarDj = (props) => {
  const context = useContext(Context);
  const gtx = useContext(GlobalContext);
  const history = useHistory();
  const {token, profile} = context;
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
    if (context.token.isLogin === false) {
      context.action.alert({
        msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
        callback: () => {
          history.push('/login')
        }
      })
    } else {
      if (getDeviceOSTypeChk() === 3){
        RoomValidateFromClipMemNo(roomNo,memNo, gtx, history, nickNm);
      } else {
        RoomJoin({roomNo: roomNo, memNo:memNo, nickNm: nickNm})
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
                <div className='starDjList' key={index}>
                  <div className='photoWrap'>
                    <div className='thumbnail'>
                      <img src={`${list.profImg.thumb100x100}`} alt={`${list.nickNm}님의 프로필 이미지`}/>
                    </div>
                    {
                      typeof list.roomNo === "undefined" || list.roomNo === null || list.roomNo !== "" ?
                        <div className="badgeLive" onClick={(e) => {
                            e.stopPropagation();
                            if (context.token.memNo !== list.memNo){
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
                        // : context.token.memNo !== list.memNo ?
                        //   <span className={`fanButton ${list.fanYn=== "y" ? "active" : ""}`} onClick={(e) => {
                        //     e.stopPropagation();
                        //     list.fanYn === "y" ? deleteFan(list.mem_no, list.mem_nick) : addFan(list.mem_no, list.mem_nick);
                        //   }}>{list.fanYn=== "y" ? "팬" : "+ 팬등록"}</span>
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
                        <span>누적 좋아요</span>
                        <span>{addComma(list.goodCnt)}개</span>
                      </div>
                      <div className='dataList'>
                        <span>누적 청취자</span>
                        <span>{addComma(list.goodCnt)}명</span>
                      </div>
                      <div className='dataList'>
                        <span>누적 방송시간</span>
                        <span>{addComma(list.broadMin)}분</span>
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
