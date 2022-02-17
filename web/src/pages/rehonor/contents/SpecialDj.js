import React, {useContext, useEffect, useState}from 'react'

import Api from 'context/api'
import moment from "moment";

import DetailView from '../components/DetailView'
import PhotoFrame from 'components/ui/photoFrame/PhotoFrame'
import DataCnt from 'components/ui/dataCnt/DataCnt'
import GenderItems from 'components/ui/genderItems/GenderItems'
import LayerPopup from 'components/ui/layerPopup/LayerPopup'
import {useDispatch, useSelector} from "react-redux";
// global components

const SpecialDj = (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const [ dateData, setDateData ] = useState([]);
  const [ specialDjList, setSpecialDjList ] = useState([]);
  const [ popup, setPopup ] = useState(false);
  const [ popupData, setPopupData ] = useState({});

  const {token, profile} = globalState

  const NowDate = new Date;
  let NowYear = moment(NowDate).format("YYYY");
  let NowMonth = moment(NowDate).format("MM");

  async function fetchHonor() {
    const res = await Api.getSpecialDjHistory({
      yy: NowYear - 1,
      mm: NowMonth
    })
    if (res.result === 'success') {
      setSpecialDjList(res.data.list);
      setDateData(res.data.info);
    }
  }

  const specialDjPop = (data) => {
    setPopup(true)
    setPopupData(data);
    console.log(data);
  }

  useEffect(() => {
    fetchHonor()
  },[])

  return (
    <>
      <DetailView />
      <p className='infomation'>달라의 celebrity! 스페셜 DJ를 소개합니다.</p>
      {profile &&
        <div className='myHonor'>
          <PhotoFrame data={profile} size={80}/>
          <div className='myInfoWrap'>
            <div className='listRow'>
              <div className='nickNm'>{profile.nickNm}</div>
            </div>
            <div className='listRow'>
              <div className='level'>{profile.level}</div>
            </div>
            <div className='listRow dataCnt'>
              <DataCnt type={"goodCnt"} value={0}/>
              <DataCnt type={"listenerCnt"} value={0} />
              <DataCnt type={"broadMin"} value={0}/>
            </div>
          </div>
          <div className='specialCnt' onClick={() => specialDjPop(profile)}>
            <span>{profile.level}회</span>
            <span className='iconRightArrow'></span>
          </div>
          <div className='me'>나</div>
        </div>
      }
      {
        specialDjList.length > 0 ?
          <div className='gridWrap column2'>
            {specialDjList.map((list, index) => {
              return (
                <div className='gridList' key={index}>
                  <div className='listRow'>
                    {list.isNew ?
                      <div className='new' onClick={() => specialDjPop(list)}>NEW</div>
                      :
                      <div className='specialCnt' onClick={() => specialDjPop(list)}>
                        <span>{list.specialCnt}회</span>
                        <span className='iconRightArrow'></span>
                      </div>
                    }
                    {list.roomNo && <span className='live'>LIVE</span>}
                  </div>
                  <PhotoFrame data={list} size={80}/>
                  <div className='listRow'>
                    <span className='level'>{list.level}</span>
                  </div>
                  <div className='listRow'>
                    <GenderItems data={list.gender} />
                    <span className='nickNm'>{list.nickNm}</span>
                  </div>
                  <div className='listRow dataCnt'>
                    <DataCnt type={"goodCnt"} value={list.goodCnt}/>
                    <DataCnt type={"listenerCnt"} value={list.listenerCnt} />
                    <DataCnt type={"broadMin"} value={list.broadMin}/>
                  </div>
                </div>
              )
            })}
          </div>
        :
        <></>
      }
      {
        popup &&
        <LayerPopup setPopup={setPopup}>
          <div className='popTitle'>
            <strong>{popupData.nickNm}</strong>님은<br/>현재 스페셜DJ입니다.
          </div>
          <div className='popContent'>
            <div className='logTop'>
              <span>스페셜 DJ 약력</span>
              <span>총 <strong>{popupData.specialCnt}</strong>회</span>
            </div>
            <div className='logWrap'>
              <div className='logHead'>
                <span>선정 일자</span>
                <span>선정 기수</span>
              </div>
              <div className='logContent'>
                <div className='logList'>
                  <span>2022.02</span>
                  <span>57기</span>
                </div>
                <div className='logList'>
                  <span>2022.01</span>
                  <span>56기</span>
                </div>
                <div className='logList'>
                  <span>2021.12</span>
                  <span>55기</span>
                </div>
                <div className='logList'>
                  <span>2021.12</span>
                  <span>55기</span>
                </div>
                <div className='logList'>
                  <span>2021.12</span>
                  <span>55기</span>
                </div>
                <div className='logList'>
                  <span>2021.12</span>
                  <span>55기</span>
                </div>
                <div className='logList'>
                  <span>2021.12</span>
                  <span>55기</span>
                </div>
                <div className='logList'>
                  <span>2021.12</span>
                  <span>55기</span>
                </div>
                <div className='logList'>
                  <span>2021.12</span>
                  <span>55기</span>
                </div>
                <div className='logList'>
                  <span>2021.12</span>
                  <span>55기</span>
                </div>
                <div className='logList'>
                  <span>2021.12</span>
                  <span>55기</span>
                </div>
                <div className='logList'>
                  <span>2021.12</span>
                  <span>55기</span>
                </div>
                <div className='logList'>
                  <span>2021.12</span>
                  <span>55기</span>
                </div>
                <div className='logList'>
                  <span>2021.12</span>
                  <span>55기</span>
                </div>
                <div className='logList'>
                  <span>2021.12</span>
                  <span>55기</span>
                </div>
                <div className='logList'>
                  <span>2021.12</span>
                  <span>55기</span>
                </div>
                <div className='logList'>
                  <span>2021.12</span>
                  <span>55기</span>
                </div>
              </div>
            </div>
          </div>
        </LayerPopup>
      }
    </>
  )
}

export default SpecialDj
