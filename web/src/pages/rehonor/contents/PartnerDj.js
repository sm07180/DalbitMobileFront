import React, {useContext, useEffect, useState} from 'react'
import {Context, GlobalContext} from "context";

import {useHistory, withRouter} from "react-router-dom";
import {IMG_SERVER, PHOTO_SERVER} from 'context/config'
import {RoomValidateFromClipMemNo} from "common/audio/clip_func";
import {getDeviceOSTypeChk} from "common/DeviceCommon";

import Api from "context/api";
import Lottie from 'react-lottie'
import photoCommon from "common/utility/photoCommon";

const PartnerDj = (props) => {
  const context = useContext(Context);
  const gtx = useContext(GlobalContext);
  const history = useHistory();

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
          listData.list.length > 0 &&
            listData.list.map((list, index) => {
              return (
                <div className='partnerDjList' key={index} onClick={() => golink(`/profile/${list.mem_no}`)}>
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
