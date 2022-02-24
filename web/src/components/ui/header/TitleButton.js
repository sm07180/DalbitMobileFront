import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import {Context} from "context";
import {goMail} from "common/mailbox/mail_func";
import {useDispatch, useSelector} from "react-redux";
import {setNoticeTab} from "../../../redux/actions/notice";
import API from "../../../context/api";

export const RankingButton = () => {
  const history = useHistory();
  return <button className='ranking' onClick={() => history.push('/rank')} />
}

export const RankingRewardButton = () => {
  const history = useHistory();
  return <button className='benefits' onClick={() => history.push('/clip_rank/reward')} >혜택</button>
}

export const MessageButton = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const mailboxState = useSelector(({mailBoxCtx}) => mailBoxCtx);
  /* 메시지 이동 */
  const goMailAction = () => {
    const goMailParams = {
      globalState,
      dispatch,
      targetMemNo: globalState.profile.memNo,
      history,
      isChatListPage: true,
    }
    goMail(goMailParams);
  }

  // 레벨 체크(1레벨 이상),
  return <button className={`message ${mailboxState.isMailboxNew ? 'new' : ''}`} onClick={goMailAction} />
}

export const AlarmButton = ({newAlarmCnt, isLogin, noticeCount}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  return <button className={`alarm ${isLogin && newAlarmCnt > 0 ? 'new' : ''}`} onClick={() => {
    if(noticeCount === 0) {
      dispatch(setNoticeTab("알림"));
    } else {
      dispatch(setNoticeTab("공지사항"));
    }
    history.push('/notice');
  }} />
}

export const StoreButton = () => {
  const history = useHistory();
  return <button className='store' onClick={() => history.push('/store')} />
}

export const SearchButton = () => {
  const history = useHistory();
  return <button className='search' onClick={() => history.push('/search')} />
}

const TitleButton = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const context = useContext(Context);
  const mailboxState = useSelector(({mailBoxCtx}) => mailBoxCtx);
  const mainState = useSelector((state) => state.main);
  const [newCnt, setNewCnt] = useState(0);
  const [noticeCount, setNoticeCount] = useState(0);

  //알림/공지사항 신규 알림 있는지 조회
  const fetchMypageNewCntData = async (memNo) => {
    const res = await API.getMyPageNew(memNo);
    if(res.result === "success") {
      if(res.data) {
        setNewCnt(res.data.newCnt);
        setNoticeCount(res.data.notice);
      }}
  }

  useEffect(() => {
    fetchMypageNewCntData(context.profile.memNo);
  }, [newCnt]);

  switch (props.title) {
    case '메인':
      return (
        <div className="buttonGroup">
          <RankingButton />
          <MessageButton />
          <AlarmButton newAlarmCnt={newCnt} noticeCount={noticeCount} isLogin={context.profile} />
        </div>
      )
    case '클립':
      return (
        <div className="buttonGroup">
          <MessageButton />
          <AlarmButton newAlarmCnt={newCnt} noticeCount={noticeCount} isLogin={context.profile} />
        </div>
      )
    case '클립 랭킹':
      return (
        <div className='buttonGroup'>
          <RankingRewardButton />
        </div>
      )
    case '검색':
      return (
        <div className="buttonGroup">
          <MessageButton />
          <AlarmButton newAlarmCnt={newCnt} noticeCount={noticeCount} isLogin={context.profile} />
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
          <StoreButton />
          <MessageButton />
          <AlarmButton newAlarmCnt={newCnt} noticeCount={noticeCount} isLogin={context.profile} />
        </div>
      )
    default :
      return (
        <></>
      )
  }
}

export default TitleButton;
