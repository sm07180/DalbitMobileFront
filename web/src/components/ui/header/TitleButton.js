import React, {useContext} from 'react';
import {useHistory} from "react-router-dom";
import {Context} from "context";
import {goMail} from "common/mailbox/mail_func";
import {MailboxContext} from "context/mailbox_ctx";
import {useSelector} from "react-redux";

export const RankingButton = ({history}) => {
  return <button className='ranking' onClick={() => history.push('/rank')} />
}

export const RankingRewardButton = ({history}) => {
  return <button className='benefits' onClick={() => history.push('/clip_rank/reward')} >혜택</button>
}

export const MessageButton = ({history, context, mailboxAction}) => {
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
  return <button className='message' onClick={goMailAction} />
}

export const AlarmButton = ({history, newAlarmCnt=0}) => {
  return <button className={`alarm ${newAlarmCnt > 0 ? 'new' : ''}`} onClick={() => history.push('/notice')} />
}

export const StoreButton = ({history}) => {
  return <button className='store' onClick={() => history.push('/store')} />
}

export const SearchButton = ({history}) => {
  return <button className='search' onClick={() => history.push('/search')} />
}

const TitleButton = (props) => {
  const history = useHistory();
  const context = useContext(Context);
  const { mailboxAction } = useContext(MailboxContext);
  const mainState = useSelector((state) => state.main);

  switch (props.title) {
    case '메인':
      return (
        <div className="buttonGroup">
          <RankingButton history={history} />
          <MessageButton history={history} context={context} mailboxAction={mailboxAction} />
          <AlarmButton history={history} alarmCnt={mainState.newAlarmCnt} />
        </div>
      )
    case '클립':
      return (
        <div className="buttonGroup">
          <MessageButton history={history} context={context} mailboxAction={mailboxAction} />
          <AlarmButton history={history} alarmCnt={mainState.newAlarmCnt} />
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
          <MessageButton history={history} context={context} mailboxAction={mailboxAction} />
          <AlarmButton history={history} alarmCnt={mainState.newAlarmCnt} />
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
          <StoreButton history={history} />
          <SearchButton history={history} />
          <AlarmButton history={history} alarmCnt={mainState.newAlarmCnt} />
        </div>
      )
    default :
      return (
        <></>
      )
  }
}

export default TitleButton;
