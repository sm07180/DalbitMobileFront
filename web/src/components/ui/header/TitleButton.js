import React, {useEffect} from 'react';
import {useHistory} from "react-router-dom";
import {goMail} from "common/mailbox/mail_func";
import {useDispatch, useSelector} from "react-redux";
import {setNoticeData, setNoticeTab} from "../../../redux/actions/notice";
import API from "../../../context/api";
import {Hybrid, isAndroid, isHybrid} from "../../../context/hybrid";
import moment from "moment";
import Utility from "../../lib/utility";

const TitleButton = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const alarmData = useSelector(state => state.newAlarm);
  const payStoreRdx = useSelector(({payStore})=> payStore);
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const mailboxState = useSelector(({mailBoxCtx}) => mailBoxCtx);
  const memberRdx = useSelector((state)=> state.member);
  const nowDay = moment().format('YYYYMMDD');

  useEffect(() => {
    if(isHybrid()) {
      fetchMypageNewCntData(globalState.profile.memNo);
    }
  }, []);

  const fetchMypageNewCntData = async (memNo) => {
    const res = await API.getMyPageNew(memNo);
    if(res.result === "success") {
      if(res.data) {
        dispatch(setNoticeData(res.data));
      }}
  }

  useEffect(() => {
    if(isHybrid() && globalState.token.isLogin) {
      fetchMypageNewCntData(globalState.profile.memNo);
    }
  }, []);

  const goMailAction = () => {
    const goMailParams = {
      dispatch,
      globalState,
      targetMemNo: globalState.profile.memNo,
      history,
      isChatListPage: true,
    }

    goMail(goMailParams);
  }
  const AlarmButton = () => {
    return <button 
      className={`alarm ${memberRdx.isLogin && (alarmData.alarm || alarmData.notice) > 0 ? 'new' : ''}`} 
      onClick={() => {
        if(alarmData.notice === 0) {
          dispatch(setNoticeTab("알림"));
        } else {
          dispatch(setNoticeTab("공지사항"));
        }
        history.push('/notice');
      }} />
  }


  switch (props.title) {
    case '메인':
      return (
        <div className="buttonGroup">
          <button className={`store ${!moment(nowDay).isAfter(moment('20220428')) ? "bonus" : ""}`} onClick={()=>{
            storeButtonEvent({history, memberRdx, payStoreRdx})
          }} />
          <button className='ranking' onClick={() => history.push('/rank')} />
          <button className={`message ${mailboxState.isMailboxNew ? 'new' : ''}`} onClick={goMailAction} />
          <AlarmButton/>
        </div>
      )
    case '클립':
      return (
        <div className="buttonGroup">
          <button className={`message ${mailboxState.isMailboxNew ? 'new' : ''}`} onClick={goMailAction} />
          <AlarmButton/>
        </div>
      )
    case '클립 랭킹':
      return (
        <div className='buttonGroup'>
          <button className='benefits' onClick={() => history.push('/clip_rank/reward')} >혜택</button>
        </div>
      )
    case '검색':
      return (
        <div className="buttonGroup">
          <button className={`message ${mailboxState.isMailboxNew ? 'new' : ''}`} onClick={goMailAction} />
          <AlarmButton/>
        </div>
      )
    case '랭킹':
      return (
        <div className='buttonGroup'>
          <button className='benefits' onClick={() => history.push("/rankBenefit")}>
            혜택
          </button>
        </div>
      )
    case 'MY':
      return (
        <div className="buttonGroup">
          <button className={`store ${!moment(nowDay).isAfter(moment('20220428')) ? "bonus" : ""}`} onClick={()=>{
            storeButtonEvent({history, memberRdx, payStoreRdx})
          }} />
          <button className={`message ${mailboxState.isMailboxNew ? 'new' : ''}`} onClick={goMailAction} />
          <AlarmButton/>
        </div>
      )
    default :
      return (
        <></>
      )
  }
}

// 하이브리드앱 스토어 버튼 클릭
export const storeButtonEvent = ({history, memberRdx, payStoreRdx}) => {
  if(!memberRdx.isLogin){
    history.push('/login');
    return;
  }
  if(!isHybrid()){
    history.push('/store');
    return;
  }

  const inAppUpdateVersion = isAndroid() ? payStoreRdx.updateVersionInfo.aos : payStoreRdx.updateVersionInfo.ios;
  Utility.compareAppVersion(inAppUpdateVersion, ()=>{
    if(isAndroid()){
      history.push('/store');
    }else{
      Hybrid('openInApp', '');
    }
  }, ()=>{
    if(isAndroid()){
      history.push('/store');
    }else{
      Hybrid('openInApp', '');
    }
  });
}

export default TitleButton;
