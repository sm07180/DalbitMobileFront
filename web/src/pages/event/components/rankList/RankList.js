import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'

//context
import {Context} from 'context'

// static
import './rankList.scss'
import {IMG_SERVER} from "context/config";

const EventRankList = (props) => {
  const {
		type,
    rankList,
    photoSize,
		listNum,
		index
  } = props
  const globalCtx = useContext(Context)
  const history = useHistory()

  // 프로필 이동 이벤트
  const goProfile = (memNo) => {
    if (memNo !== undefined && memNo > 0) {
      history.push(`/profile/${memNo}`)
    }
  }

  return (
		<div className={`eventRankList ${type === 'my' && globalCtx.token.isLogin ? 'my' : ''}`} key={index} onClick={() => {goProfile(rankList.mem_no)}}>
			<div className="rankNum">
				{type === 'my' && globalCtx.token.isLogin ? <span className='tit'>내순위</span> : <></>}
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
				{rankList && rankList.profImg && rankList.profImg.thumb292x292 ?
					<img src={rankList.profImg.thumb292x292} alt={rankList && rankList.mem_nick} />
          :
          <img src={`${IMG_SERVER}/common/photoNone-2.png`} alt="기본 이미지" />
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
