import React, {useEffect, useState} from 'react'

// global components
import DataCnt from 'components/ui/dataCnt/DataCnt'
import FrameItems from 'components/ui/frameItems/frameItems'
import GenderItems from 'components/ui/genderItems/GenderItems'
// components
import DetailView from '../components/DetailView'
import Api from "context/api";
import {useHistory, withRouter} from "react-router-dom";
import {getDeviceOSTypeChk} from "common/DeviceCommon";
import {RoomValidateFromClip} from "common/audio/clip_func";
import {RoomJoin} from "context/room";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const SpecialDj = (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory();

  const {token, profile} = globalState;

  const [specialList, setSpecialList] = useState([]);

  let date = new Date();

  const [dateVal, setDateVal] = useState({
    year: date.getFullYear(),
    month: date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1,
    title: "이번달"
  });



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

  const goProfile = (memNo) => {
    props.history.push(`/profile/${memNo}`)
  }

  const goLive = (roomNo, nickNm) => {
    if (globalState.token.isLogin === false) {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
        callback: () => {
          history.push('/login')
        }
      }))
    } else {
      if (getDeviceOSTypeChk() === 3) {
        RoomValidateFromClip(roomNo, dispatch, globalState, history, nickNm);
      } else {
        RoomJoin({roomNo: roomNo, nickNm: nickNm})
      }
    }
  }

  return (
    <>
      <DetailView dateVal={dateVal} setDateVal={setDateVal}/>
      <p className='infomation'>달라의 celebrity! 스페셜 DJ를 소개합니다.</p>
      <section className="listSection">
      {specialList.length > 0 &&
        <div className={`listWrap specialDj`}>
          {specialList.map((list, index) => {
            return (
              <div className='listColumn' key={`specialDj-${index}`} onClick={() => goProfile(list.memNo)}>
                <div className='listItem'>
                  {list.isNew ?
                    <div className='new'>NEW</div>
                    :
                    <div className='specialCnt'>
                      <span>{list.specialCnt}회</span>
                      <span className='icoRight'></span>
                    </div>
                  }
                  {list.roomNo && <span className='live' onClick={(e) => {
                    e.stopPropagation();
                    goLive(list.roomNo, list.nickNm);
                  }}>LIVE</span>}
                </div>
                <div className="photo">
                  <img src={profile.profImg.thumb120x120} alt="" />
                  <FrameItems content={profile} />
                </div>
                <span className='level'>{list.level}</span>
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
    </>
  )
}

export default withRouter(SpecialDj);
