import React from 'react';
import {useHistory} from "react-router-dom";
import MovePage from '../../module/MovePage';

export const RankingButton = ({history}) => {
  return <button className='ranking' onClick={() => MovePage({url: '/rank', history})} />
}

export const MessageButton = () => {
  // 레벨 체크(1레벨 이상),
  return <button className='message' onClick={() => history.push('/')} />
}

export const AlarmButton = () => {
  return <button className='alarm' onClick={() => MovePage('alarm', '/menu/alarm')} />
}

export const StoreButton = () => {
  return <button className='store' onClick={() => MovePage('store', '/pay/store')} />
}

export const SearchButton = () => {
  return <button className='search' onClick={() => MovePage('search', '/menu/search')} />
}

const TitleButton = (props) => {
  const history = useHistory();
  switch (props.title) {
    case '메인':
      return (
        <div className="buttonGroup">
          <RankingButton history={history} />
          <MessageButton />
          <AlarmButton />
        </div>
      )
    case '클립':
      return (
        <div className="buttonGroup">
          <MessageButton />
          <AlarmButton />
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
    case 'MY':
      return (
        <div className="buttonGroup">
          <StoreButton />
          <SearchButton />
          <AlarmButton />
        </div>
      )
  }
}

export default TitleButton;