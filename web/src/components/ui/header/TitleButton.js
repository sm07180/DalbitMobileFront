import React from 'react';
import {useHistory} from "react-router-dom";

export const RankingButton = ({history}) => {
  return <button className='ranking' onClick={() => history.push('/rank')} />
}

export const RankingRewardButton = ({history}) => {
  return <button className='benefits' onClick={() => history.push('/clip_rank/reward')} >혜택</button>
}

export const MessageButton = ({history}) => {
  // 레벨 체크(1레벨 이상),
  return <button className='message' onClick={() => history.push('/')} />
}

export const AlarmButton = ({history}) => {
  return <button className='alarm' onClick={() => history.push('/menu/alarm')} />
}

export const StoreButton = ({history}) => {
  return <button className='store' onClick={() => history.push('/pay/store')} />
}

export const SearchButton = ({history}) => {
  return <button className='search' onClick={() => history.push('/menu/search')} />
}

const TitleButton = (props) => {
  const history = useHistory();
  switch (props.title) {
    case '메인':
      return (
        <div className="buttonGroup">
          <RankingButton history={history} />
          <MessageButton history={history} />
          <AlarmButton history={history} />
        </div>
      )
    case '클립':
      return (
        <div className="buttonGroup">
          <MessageButton history={history} />
          <AlarmButton history={history} />
        </div>
      )
    case '클립 랭킹':
      return (
        <div className='buttonGroup'>
          <RankingRewardButton history={history} />
        </div>
      )
    case '좋아요한 클립':
      return (
        <div className="buttonGroup">
          <button className='play' />
          <button className='shuffle' />
        </div>
      )
    case '최근 들은 클립':
      return (
        <div className="buttonGroup">
          <button className='play' />
          <button className='shuffle' />
        </div>
      )
    case '랭킹':
      return (        
        <div className='buttonGroup'>
          <button className='benefits' onClick={() => history.push("/rank/benefit")}>혜택</button>
        </div>
      )
    case 'MY':
      return (
        <div className="buttonGroup">
          <StoreButton history={history} />
          <SearchButton history={history} />
          <AlarmButton history={history} />
        </div>
      )
    default :
      return (
        <></>
      )
  }
}

export default TitleButton;