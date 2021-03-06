import React, {useEffect, useRef, useState} from 'react';
import Api from "context/api";
import {useDispatch, useSelector} from "react-redux";
import {isAndroid} from "context/hybrid";
import {
  setGlobalCtxBackFunction,
  setGlobalCtxBackFunctionEnd,
  setGlobalCtxBackState,
  setGlobalCtxMessage
} from "redux/actions/globalCtx";

const SpecialHistoryPop = () => {
  const dispatch = useDispatch();
  const popup = useSelector(state => state.popup);
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const starHistoryPopRef = useRef();
  
  const [profileData, setProfileData] = useState([]);
  const [specialHistory, setSpecialHistory] = useState({cnt: 0, list: [], isLoading: false, pageNo: 1}); // 해당유저의 스페셜DJ 데이터
  
  let pagePerCnt = 100;

  /* 스타DJ 약력 조회 Api */
  const fetchSpecialHistory = (pageNo) => {
    const param = {
      pageNo: pageNo,
      pagePerCnt: pagePerCnt,
    }
    Api.getStarDjLog(param).then(res => {
      if (res.result === 'success') {
        setSpecialHistory({cnt: res.data[0], list: specialHistory.list.concat(res.data[1]), isLoading: false, pageNo: pageNo});
        setProfileData(res.data[1]);
      } else {
        dispatch(setGlobalCtxMessage({type:'alert',
          callback: () => {},
          msg: res.message
        }))
      }
    });
  }

  const scrollEvent = () => {
    let scrollHeight = starHistoryPopRef.current?.scrollHeight;
    let offsetHeight = starHistoryPopRef.current?.offsetHeight;
    let scrollTop = starHistoryPopRef.current?.scrollTop;
    let pageNo = specialHistory.pageNo;

    if (scrollHeight - 5 < scrollTop + offsetHeight && pageNo < Math.ceil(specialHistory.cnt / pagePerCnt) && !specialHistory.isLoading){
      setSpecialHistory({...specialHistory, isLoading: true});
      fetchSpecialHistory(pageNo + 1);
    }
  }

  useEffect(() => { 
    fetchSpecialHistory(1);

    if(isAndroid()) {
      dispatch(setGlobalCtxBackState(true))
      dispatch(setGlobalCtxBackFunction({name: 'commonPop', popupData: {...popup, commonPopup: false}}))
    }

    return () => {
      if(isAndroid()) {
        dispatch(setGlobalCtxBackFunctionEnd(''));
      }
    }
  },[]);

  useEffect(() => {
    const target = starHistoryPopRef.current;
    if (target){
      target.addEventListener("scroll", scrollEvent);
    }
    return () => {
      target.removeEventListener("scroll", scrollEvent);
    }
  }, [specialHistory]);


  return (
    <section className="honorPopup">
      <div className="title">
        <span><strong>{globalState.profile.nickNm}</strong>님은</span>
        <span>{globalState.profile.isSpecial ? "현재 스타DJ입니다." : "현재 스타DJ가 아닙니다."}</span>
      </div>
      <div className='reference'>
        * 60일 이내에 2시간 이상 방송 시간이 없으면<br/>스타DJ 누적 횟수가 초기화 됩니다.
      </div>
      <div className="table">
        <div className="summary">
          <span>스타 DJ 약력</span>
          <span>총 {specialHistory.list.length}회</span>
        </div>
        <div className="tableInfo">
          <div className="thead">
            <span>선정 일자</span>
            <span>선정 기수</span>
          </div>
          <div ref={starHistoryPopRef} className="tbody" id="starHistoryPop">
            {specialHistory.list.map((list,index) => {
              return (
                <div className="tbodyList" key={index}>
                  <span>{list.select_year}년 {list.select_month}월</span>
                  <span>{list.round_no}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SpecialHistoryPop;
