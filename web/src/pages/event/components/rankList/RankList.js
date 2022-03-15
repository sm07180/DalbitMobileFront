import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'

// static
import './rankList.scss'
import {useDispatch, useSelector} from "react-redux";

const EventRankList = (props) => {
  const {
		type,
    rankList,
    photoSize,
		listNum,
		index
  } = props
  const history = useHistory()
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const dispatch = useDispatch();
  // 프로필 이동 이벤트
  const goProfile = (memNo) => {
    if (memNo !== undefined && memNo > 0) {
      history.push(`/profile/${memNo}`)
    }
  }

  return (
		<div className={`eventRankList ${type === 'my' && globalState.token.isLogin ? 'my' : ''}`} key={index} onClick={() => {goProfile(rankList.mem_no)}}>
			<div className="rankNum">
				{type === 'my' && globalState.token.isLogin ? <span className='tit'>내순위</span> : <></>}
				{type === 'my' ?
					<span className="num">
						{rankList && rankList.my_rank_no != 0 ? rankList.my_rank_no : '-'}
						{rankList && rankList.rankNo != 0 ? rankList.rankNo : '-'}
					</span>
					:
					<span className="num">{listNum + 1}</span>
				}
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
			<div className={`photo size${photoSize}`}>
				{rankList && rankList.profImg &&
					<img src={rankList && rankList.profImg && rankList.profImg.thumb292x292} alt={rankList && rankList.mem_nick} />
				}
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
