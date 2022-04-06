import React, {useContext, useEffect, useState} from 'react'
import {Context, GlobalContext} from "context";

import {useHistory, withRouter} from "react-router-dom";
import {IMG_SERVER, PHOTO_SERVER} from 'context/config'
import {RoomValidateFromClipMemNo} from "common/audio/clip_func";
import {getDeviceOSTypeChk} from "common/DeviceCommon";

import Api from "context/api";
import Lottie from 'react-lottie'
import photoCommon from "common/utility/photoCommon";

const StarDj = (props) => {
  const context = useContext(Context);
  const gtx = useContext(GlobalContext);
  const history = useHistory();

  const [listData, setListData] = useState({cnt: 0, list: []});

  const golink = (path) => {
    history.push(path);
  }

  /* 팬 등록 */
  const addFan = (memNo, memNick) => {
    Api.fan_change({data: {memNo}}).then(res => {
      if (res.result === 'success') {
        fanCallback(memNo);
        context.action.toast({
          msg: `${memNick ? `${memNick}님의 팬이 되었습니다` : '팬등록에 성공하였습니다'}`
        })
      } else if (res.result === 'fail') {
        context.action.alert({
          msg: res.message
        })
      }
    })
  }

  /* 팬 해제 */
  const deleteFan = (memNo, memNick) => {
    context.action.confirm({
      msg: `${memNick} 님의 팬을 취소 하시겠습니까?`,
      callback: () => {
        Api.mypage_fan_cancel({data: {memNo}}).then(res => {
          if (res.result === 'success') {
            fanCallback(memNo);
            context.action.toast({ msg: res.message })
          } else if (res.result === 'fail') {
            context.action.alert({ msg: res.message })
          }
        });
      }
    })
  }

  const fanCallback = (memNo) => {
    let editFan = listData.list.map((v, i) => {
      return v.mem_no === memNo ? v.fanYn === "y" ? {...v,fanYn: "n" } : {...v, fanYn: "y"} : {...v};
    })
    setListData({...listData, list: editFan});
  }
  
  return (
    <>
      <div className='starDjInfo'>
        <div className='infoText'>
          <span>달라의 셀럽,</span>
          <p>이 달의 Star DJ를 소개합니다.</p>
          <button onClick={() => golink("/starDj")}>혜택 보러가기</button>
        </div>
        <div className='infoDecoration'>
          <img src='https://image.dalbitlive.com/honor/starDj/honor_starDj-topBadge.png' alt='스타DJ 훈장 이미지'/>
        </div>
      </div>
      <div className='starDjWrap'>
        {
          listData.list.length > 0 &&
            listData.list.map((list, index) => {
              return (
                <div className='starDjList' key={index} onClick={() => golink(`/profile/${list.mem_no}`)}>
                  <div className='thumbnail'>
                    <img src={photoCommon.getPhotoUrl(PHOTO_SERVER, list.image_profile, "700X700")} alt=''/>
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
                            if (context.token.memNo !== list.mem_no){
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
                        : context.token.memNo !== list.mem_no ?
                        <span className={`fanButton ${list.fanYn=== "y" ? "active" : ""}`} onClick={(e) => {
                          e.stopPropagation();
                          list.fanYn === "y" ? deleteFan(list.mem_no, list.mem_nick) : addFan(list.mem_no, list.mem_nick);
                        }}>{list.fanYn=== "y" ? "팬" : "+ 팬등록"}</span>
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

export default withRouter(StarDj)
