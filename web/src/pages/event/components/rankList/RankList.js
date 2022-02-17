import React from 'react'
import {useHistory} from 'react-router-dom'

//context

// static
import './rankList.scss'
import {useDispatch, useSelector} from "react-redux";

const EventRankList = (props) => {
  const {
    type,
    rankList,
    photoSize,
    listNum
  } = props;
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory()

  // 프로필 이동 이벤트
  const goProfile = (e) => {
    const {targetMemNo} = e.currentTarget.dataset

    if (targetMemNo !== undefined && targetMemNo > 0) {
      history.push(`/mypage/${targetMemNo}`)
    }
  }

  return (
    <div className={`eventRankList ${type === 'my' && globalState.token.isLogin ? 'my' : ''}`}>
      <div className="rankNum">
        {type === 'my' && globalState.token.isLogin ? <span className='tit'>내순위</span> : <></>}
        {type === 'my' ?
          <span className="num">{rankList && rankList.my_rank_no != 0 ? rankList.my_rank_no : '-'}</span> :
          <span className="num">{listNum + 1}</span>}
        {rankList && rankList.upDown && <p className="rankChange">
          {rankList && rankList.upDown === 'new' ? (
            <span className="new">NEW</span>
          ) : rankList && rankList.upDown > 0 ? (
            <span className="up">{Math.abs(rankList && rankList.upDown)}</span>
          ) : rankList && rankList.upDown < 0 ? (
            <span className="down">{Math.abs(rankList && rankList.upDown)}</span>
          ) : (
            <span>{rankList && rankList.upDown}</span>
					)}
				</p>}
			</div>
			<div className={`photo size${photoSize}`} onClick={goProfile} data-target-mem-no={rankList && rankList.mem_no}>
				<img src={rankList && rankList.profImg && rankList.profImg.thumb62x62} alt={rankList && rankList.mem_nick} />
			</div>
			{props.children}
		</div>
  )
}

EventRankList.defaultProps = {
  type: '',
	rankList: [],
	photoSize: 50,
}

export default EventRankList
