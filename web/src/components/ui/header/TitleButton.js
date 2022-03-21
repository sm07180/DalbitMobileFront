import React, {useEffect} from 'react';
import {useHistory} from "react-router-dom";
import {goMail} from "common/mailbox/mail_func";
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import {setNoticeData, setNoticeTab} from "../../../redux/actions/notice";
import API from "../../../context/api";
import {isHybrid} from "../../../context/hybrid";
import {OS_TYPE} from '../../../context/config'

export const RankingButton = ({history}) => {
  return <button className='ranking' onClick={() => history.push('/rank')} />
}

export const RankingRewardButton = ({history}) => {
  return <button className='benefits' onClick={() => history.push('/clip_rank/reward')} >혜택</button>
}

export const MessageButton = ({history}) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const mailboxState = useSelector(({mailBoxCtx}) => mailBoxCtx);

  /* 메시지 이동 */
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

export const StoreButton = ({event}) => {
  return <button className='store' onClick={event} />
}

export const SearchButton = ({history}) => {
  return <button className='search' onClick={() => history.push('/search')} />
}

const TitleButton = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const alarmData = useSelector(state => state.newAlarm);

  const fetchMypageNewCntData = async (memNo) => {
    const res = await API.getMyPageNew(memNo);
    if(res.result === "success") {
      if(res.data) {
        dispatch(setNoticeData(res.data));
      }}
  }

  useEffect(() => {
    if(isHybrid()) {
      fetchMypageNewCntData(globalState.profile.memNo);
    }
  }, []);

  const storeButtonEvent = () => {
    if(globalState.token.isLogin){
      if (globalState.customHeader['os'] === OS_TYPE['IOS']) {
        return webkit.messageHandlers.openInApp.postMessage('')
      } else {
        history.push('/store')
      }
    }else{
      history.push('/login')
    }
  }

  switch (props.title) {
    case '메인':
      return (
        <div className="buttonGroup">
          <StoreButton event={storeButtonEvent}/>
          <RankingButton history={history} />
          <MessageButton history={history}/>
          <AlarmButton history={history} dispatch={dispatch} newAlarmCnt={alarmData.alarm} noticeCount={alarmData.notice} isLogin={globalState.profile} />
        </div>
      )
    case '클립':
      return (
        <div className="buttonGroup">
          <MessageButton history={history}/>
          <AlarmButton history={history} dispatch={dispatch} newAlarmCnt={alarmData.alarm} noticeCount={alarmData.notice} isLogin={globalState.profile} />
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
          <MessageButton history={history}/>
          <AlarmButton history={history} dispatch={dispatch} newAlarmCnt={alarmData.alarm} noticeCount={alarmData.notice} isLogin={globalState.profile} />
        </div>
      )
    case '랭킹':
      return (
        <div className='buttonGroup'>
          <button className='benefits' onClick={() => history.push("/rankBenefit")}>혜택</button>
        </div>
      )
    case 'MY':
      return (
        <div className="buttonGroup">
          <StoreButton event={storeButtonEvent} />
          <MessageButton history={history}/>
          <AlarmButton history={history} dispatch={dispatch} newAlarmCnt={alarmData.alarm} noticeCount={alarmData.notice} isLogin={globalState.profile} />
        </div>
      )
    default :
      return (
        <></>
      )
  }
}

export default TitleButton;
