import React, {useEffect} from 'react';
import {useHistory} from "react-router-dom";
import {NODE_ENV} from "../../../constant/define";
import {isDesktop} from "../../../lib/agent";
import {goMail} from "common/mailbox/mail_func";
import {useDispatch, useSelector} from "react-redux";
import {setNoticeData, setNoticeTab} from "../../../redux/actions/notice";
import {Hybrid, isAndroid, isHybrid} from "../../../context/hybrid";
import API from "../../../context/api";
import moment from "moment";
import Utility from "../../lib/utility";
import AdminIcon from "../../../pages/menu/static/ic_home_admin.svg";

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

  const goAdmin = () => {
    if(isDesktop()) {
      if (NODE_ENV === "dev") {
        window.open("https://devm.dalbitlive.com/admin/question", "_blank");
      } else {
        window.open("https://m.dalbitlive.com/admin/question", "_blank");
      }
    }else {
      if (NODE_ENV === "dev") {
        location.href = "https://devm.dalbitlive.com/admin/question";
      } else {
        location.href = "https://m.dalbitlive.com/admin/question";
      }
    }
  };

  const goMailAction = () => {
    const goMailParams = {
      dispatch,
      globalState,
      targetMemNo: globalState.profile.memNo,
      history,
      isChatListPage: true,
    }

    goMail(goMailParams);
  };

  const AlarmButton = () => {
    return <button 
      className={`alarm ${memberRdx.isLogin && (alarmData.alarm || alarmData.notice) > 0 ? 'new' : ''}`} 
      onClick={() => {
        if(alarmData.notice === 0) {
          dispatch(setNoticeTab("??????"));
        } else {
          dispatch(setNoticeTab("????????????"));
        }
        history.push('/notice');
      }} />
  };

  switch (props.title) {
    case '??????':
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
    case '??????':
      return (
        <div className="buttonGroup">
          <button className={`message ${mailboxState.isMailboxNew ? 'new' : ''}`} onClick={goMailAction} />
          <AlarmButton/>
        </div>
      )
    case '?????? ??????':
      return (
        <div className='buttonGroup'>
          <button className='benefits' onClick={() => history.push('/clip_rank/reward')} >??????</button>
        </div>
      )
    case '??????':
      return (
        <div className="buttonGroup">
          <button className={`message ${mailboxState.isMailboxNew ? 'new' : ''}`} onClick={goMailAction} />
          <AlarmButton/>
        </div>
      )
    case '??????':
      return (
        <div className='buttonGroup'>
          <button className='benefits' onClick={() => history.push("/rankBenefit")}>
            ??????
          </button>
        </div>
      )
    case 'MY':
      return (
        <>
          {globalState.adminChecker && 
            <a onClick={goAdmin}>
              <img src={AdminIcon} alt="??????????????????" />
            </a>
          }
          <div className="buttonGroup">
            <button className={`store ${!moment(nowDay).isAfter(moment('20220428')) ? "bonus" : ""}`} onClick={()=>{
              storeButtonEvent({history, memberRdx, payStoreRdx})
            }} />
            <button className={`message ${mailboxState.isMailboxNew ? 'new' : ''}`} onClick={goMailAction} />
            <AlarmButton/>
          </div>
        </>
      )
    default :
      return (
        <></>
      )
  }
}

// ?????????????????? ????????? ?????? ??????
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
