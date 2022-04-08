import React, {useContext, useEffect} from 'react';
import {useHistory} from "react-router-dom";
import {Context} from "context";
import {goMail} from "common/mailbox/mail_func";
import {MailboxContext} from "context/mailbox_ctx";
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import {setNoticeData, setNoticeTab} from "../../../redux/actions/notice";
import API from "../../../context/api";
import {Hybrid, isAndroid, isHybrid, isIos} from "../../../context/hybrid";
import {OS_TYPE} from '../../../context/config'
import moment from "moment";
import Utility from "../../lib/utility";

export const RankingButton = ({history}) => {
  return <button className='ranking' onClick={() => history.push('/rank')} />
}

export const RankingRewardButton = ({history}) => {
  return <button className='benefits' onClick={() => history.push('/clip_rank/reward')} >혜택</button>
}

export const MessageButton = ({history, context, mailboxAction, mailboxState}) => {
  /* 메시지 이동 */
  const goMailAction = () => {
    const goMailParams = {
      context,
      mailboxAction,
      targetMemNo: context.profile.memNo,
      history,
      isChatListPage: true,
    }
    goMail(goMailParams);
  }

  // 레벨 체크(1레벨 이상),
  return <button className={`message ${mailboxState.isMailboxNew ? 'new' : ''}`} onClick={goMailAction} />
}

export const AlarmButton = ({history, dispatch, newAlarmCnt, isLogin, noticeCount}) => {
  return <button className={`alarm ${isLogin && (newAlarmCnt || noticeCount) > 0 ? 'new' : ''}`} onClick={() => {
    if(noticeCount === 0) {
      dispatch(setNoticeTab("알림"));
    } else {
      dispatch(setNoticeTab("공지사항"));
    }
    history.push('/notice');
  }} />
}

export const StoreButton = ({history, memberRdx, payStoreRdx}) => {
  return <button className='store' onClick={()=>{

    storeButtonEvent({history, memberRdx, payStoreRdx})
  }} />
}

export const SearchButton = ({history}) => {
  return <button className='search' onClick={() => history.push('/search')} />
}

const TitleButton = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const context = useContext(Context);
  const { mailboxState, mailboxAction } = useContext(MailboxContext);
  const alarmData = useSelector(state => state.newAlarm);
  const memberRdx = useSelector((state)=> state.member);
  const payStoreRdx = useSelector(({payStore})=> payStore);

  const fetchMypageNewCntData = async (memNo) => {
    const res = await API.getMyPageNew(memNo);
    if(res.result === "success") {
      if(res.data) {
        dispatch(setNoticeData(res.data));
      }}
  }

  useEffect(() => {
    if(isHybrid()) {
      fetchMypageNewCntData(context.profile.memNo);
    }
  }, []);

  switch (props.title) {
    case '메인':
      return (
        <div className="buttonGroup">
          <StoreButton history={history} memberRdx={memberRdx} payStoreRdx={payStoreRdx}/>
          <RankingButton history={history} />
          <MessageButton history={history} context={context} mailboxAction={mailboxAction} mailboxState={mailboxState} />
          <AlarmButton history={history} dispatch={dispatch} newAlarmCnt={alarmData.alarm} noticeCount={alarmData.notice} isLogin={context.profile} />
        </div>
      )
    case '클립':
      return (
        <div className="buttonGroup">
          <MessageButton history={history} context={context} mailboxAction={mailboxAction} mailboxState={mailboxState} />
          <AlarmButton history={history} dispatch={dispatch} newAlarmCnt={alarmData.alarm} noticeCount={alarmData.notice} isLogin={context.profile} />
        </div>
      )
    case '클립 랭킹':
      return (
        <div className='buttonGroup'>
          <RankingRewardButton history={history} />
        </div>
      )
    case '검색':
      return (
        <div className="buttonGroup">
          <MessageButton history={history} context={context} mailboxAction={mailboxAction} mailboxState={mailboxState} />
          <AlarmButton history={history} dispatch={dispatch} newAlarmCnt={alarmData.alarm} noticeCount={alarmData.notice} isLogin={context.profile} />
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
          <StoreButton history={history} memberRdx={memberRdx} payStoreRdx={payStoreRdx}/>
          <MessageButton history={history} context={context} mailboxAction={mailboxAction} mailboxState={mailboxState} />
          <AlarmButton history={history} dispatch={dispatch} newAlarmCnt={alarmData.alarm} noticeCount={alarmData.notice} isLogin={context.profile} />
        </div>
      )
    default :
      return (
        <></>
      )
  }
}

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
