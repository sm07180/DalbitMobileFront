import React, {useContext, useEffect, useState} from 'react'
import {Context, GlobalContext} from "context";

import {useHistory, withRouter} from "react-router-dom";
import {PHOTO_SERVER} from 'context/config'
import {RoomValidateFromClip, RoomValidateFromClipMemNo} from "common/audio/clip_func";
import {getDeviceOSTypeChk} from "common/DeviceCommon";
import {IMG_SERVER} from 'context/config'

import Api from "context/api";
import Lottie from 'react-lottie'

const PartnerDj = (props) => {
  const context = useContext(Context);
  const gtx = useContext(GlobalContext);
  const history = useHistory();

  const [listData, setListData] = useState([]);

  useEffect(() => {
    getPartnerDj();
  }, []);

  const getPartnerDj = () => {
      Api.getPartnerDjList({
        pageNo: 1,
        pagePerCnt: 100
      }).then((res) => {
        if (res.result === 'success') {
          setListData(res.data[1]);
        }
      })
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
        if (roomNo !== '') {
          RoomJoin({roomNo: roomNo, memNo:memNo, nickNm: nickNm})
        }
      }
    }
  }

  const golink = (path) => {
    history.push(path);
  }
  
  return (
    <>
      <div className='partnerDjInfo'>
        <div className='infoText'>
          <span>파트너 DJ란,</span>
          <p>달라와 파트너십 관계를 맺은<br/>달라의 공식 DJ 입니다.</p>
          <button onClick={() => golink("/partnerDj")}>자세히보기</button>
        </div>
        <div className='infoDecoration'>
          <img src='https://image.dalbitlive.com/honor/partnerDj/honor_partnerDj-topBadge.png' alt='파트너DJ 훈장 이미지'/>
        </div>
      </div>
      <div className='partnerDjWrap'>
        {
          (listData && listData.length > 0) &&
            listData.map((list, index) => {
              return (
                <div className='partnerDjList' key={index} onClick={() => golink(`/profile/${list.mem_no}`)}>
                  <div className='thumbnail'>
                    <img src={`${PHOTO_SERVER}${list.image_profile}`} alt=''/>
                  </div>
                  <div className='userInfo'>
                    <div className='userData'>
                      <span className={`${list.mem_sex === "m" ? "male" : "female"}`}></span>
                      <span className='nickNm'>{list.mem_nick}</span>
                    </div>
                    {
                      list.room_no !== "" ?
                        <div className="badgeLive" onClick={(e) => {
                            e.stopPropagation();
                            goLive(list.room_no, list.mem_no, list.mem_nick);
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
                        :
                        <span className={`fanButton ${list.mem_sex === "f" ? "active" : ""}`}>{list.mem_sex === "f" ? "팬" : "+ 팬등록"}</span>
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
