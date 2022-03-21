import React, {useContext, useEffect, useState} from 'react';
import Api from "context/api";
import LayerPopup from "components/ui/layerPopup/LayerPopup";
import {setCommonPopupOpenData} from "redux/actions/common";
import {useDispatch, useSelector} from "react-redux";
import {isAndroid} from "context/hybrid";
import {setGlobalCtxBackFunction, setGlobalCtxBackState, setGlobalCtxMessage} from "redux/actions/globalCtx";

const SpecialHistoryPop = (props) => {
  const {profileData} = props;
  const [specialHistory, setSpecialHistory] = useState([]); // 해당유저의 스페셜DJ 데이터
  const [specialLog, setSpecialLog] = useState([]); // 해당유저의 스페셜DJ 획득 로그
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const popup = useSelector(state => state.popup);

  /* 스페셜DJ 약력 조회 */
  const fetchSpecialHistory = () => {
    Api.specialHistory({params: {memNo: profileData.memNo}}).then((res) => {
      if (res.result === 'success') {
        setSpecialHistory(res.data)
        setSpecialLog(res.data.list)
      } else {
        dispatch(setGlobalCtxMessage({
          type:"alert",
          msg: res.message
        }))
      }
    });
  }

  const closePop = () => {
    dispatch(setCommonPopupOpenData({...popup, historyPopup: false}))
  }

  useEffect(() => {
    fetchSpecialHistory();

    if(isAndroid()) {
      dispatch(setGlobalCtxBackState(true));
      dispatch(setGlobalCtxBackFunction({name: 'commonPop', popupData: {...popup, historyPopup: false}}));
    }

    return () => {
      closePop();
      if(isAndroid()) {
        if(globalState.backFunction.name.length === 1) {
          dispatch(setGlobalCtxBackState(null));
        }
        dispatch(setGlobalCtxBackFunction({name: ''}));
      }
    }
  },[])

  return (
    <LayerPopup setPopup={closePop}>
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
  )
}

export default SpecialHistoryPop;
