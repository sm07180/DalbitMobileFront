import React, {useContext, useEffect, useState} from 'react'
import {Context, GlobalContext} from 'context'

// global components
import DataCnt from 'components/ui/dataCnt/DataCnt'
import FrameItems from 'components/ui/frameItems/frameItems'
import GenderItems from 'components/ui/genderItems/GenderItems'
import LayerPopup from 'components/ui/layerPopup/LayerPopup'
// components
import DetailView from '../components/DetailView'
import Api from "context/api";
import {useHistory, withRouter} from "react-router-dom";
import {getDeviceOSTypeChk} from "common/DeviceCommon";
import {RoomValidateFromClip} from "common/audio/clip_func";
import {RoomJoin} from "context/room";

const SpecialDj = (props) => {
  const context = useContext(Context);
  const gtx = useContext(GlobalContext);
  const history = useHistory();
  const {token, profile} = context;
  const [specialList, setSpecialList] = useState([]);
  const [specialHistory, setSpecialHistory] = useState([]);
  const [specialLog, setSpecialLog] = useState([]);
  const [popup, setPopup] = useState(false);

  let date = new Date();

  const [dateVal, setDateVal] = useState({year: date.getFullYear(), month: date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1, title: "이번달"});



  useEffect(() => {
    getSpecialList(dateVal.year, dateVal.month);
  }, []);

  useEffect(() => {
    getSpecialList(dateVal.year, dateVal.month);
  }, [dateVal]);

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

  const fetchSpecialHistory = (memNo) => {
    Api.specialHistory({
      params: {
        memNo: memNo
      }
    }).then((res) => {
      if (res.result === 'success') {
        setSpecialHistory(res.data)
        setSpecialLog(res.data.list)
      } else {
        context.action.alert({
          callback: () => {},
          msg: res.message
        })
      }
    });
  }

  const popupOpen = (memNo) => {
    fetchSpecialHistory(memNo);
    setPopup(true);
  }

  const goProfile = (memNo) => {
    props.history.push(`/profile/${memNo}`)
  }

  const goLive = (roomNo, nickNm) => {
    if (context.token.isLogin === false) {
      context.action.alert({
        msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
        callback: () => {
          history.push('/login')
        }
      })
    } else {
      if (getDeviceOSTypeChk() === 3){
        RoomValidateFromClip(roomNo, gtx, history, nickNm);
      } else {
        RoomJoin({roomNo: roomNo, nickNm: nickNm})
      }
    }
  }

  return (
    <>
      <DetailView dateVal={dateVal} setDateVal={setDateVal}/>
      <p className='infomation'><strong>달라의 celebrity!</strong> 스페셜 DJ를 소개합니다.</p>
      <section className="listSection">
        {specialList.length > 0 &&
          <div className={`listWrap specialDj`}>
            {specialList.map((list, index) => {
              return (
                <div className='listColumn' key={`specialDj-${index}`}>
                  <div className='listItem'>
                    {list.isNew ?
                      <div className='new'onClick={() => {popupOpen(list.memNo)}}>NEW</div>
                      :
                      <div className='specialCnt' onClick={() => {popupOpen(list.memNo)}}>
                        <span>{list.specialCnt}회</span>
                        <span className='icoRight'></span>
                      </div>
                    }
                    {list.roomNo && <span className='live' onClick={(e) => {
                      e.stopPropagation();
                      goLive(list.roomNo, list.nickNm);
                    }}>LIVE</span>}
                  </div>
                  <div className="photo" onClick={() => goProfile(list.memNo)}>
                    <img src={profile.profImg.thumb120x120} alt="" />
                    <FrameItems content={profile} />
                  </div>
                  <div className='listItem'>
                    <span className='level'>{list.level}</span>
                  </div>
                  <div className='listItem'>
                    <GenderItems data={list.gender} />
                    <span className='nickNm'>{list.nickNm}</span>
                  </div>
                  <div className='listItem'>
                    <DataCnt type={"goodCnt"} value={list.goodCnt}/>
                    <DataCnt type={"listenerCnt"} value={list.listenerCnt} />
                    <DataCnt type={"broadMin"} value={list.broadMin}/>
                  </div>
                </div>
              )
            })}
          </div>
        }
      </section>
      {popup &&
        <LayerPopup setPopup={setPopup}>
          <section className="honorPopup">
            <div className='title'>
              <span><strong>{specialHistory.nickNm}</strong>님은</span>
              <span>현재 스페셜DJ입니다.</span>
            </div>
            <div className='table'>
              <div className='summary'>
                <span>스페셜 DJ 약력</span>
                <span>총 {specialHistory.specialDjCnt}회</span>
              </div>
              <div className='tableInfo'>
                <div className='thead'>
                  <span>선정 일자</span>
                  <span>선정 기수</span>
                </div>
                <div className='tbody'>
                  {specialLog.map((list,index) => {
                    return (
                      <div className='tbodyList' key={index}>
                        <span>{list.selectionDate}</span>
                        <span>{list.roundNo}</span>
                      </div>  
                    )
                  })}             
                </div>
              </div>
            </div>
          </section>
        </LayerPopup>
      }
    </>
  )
}

export default withRouter(SpecialDj);
