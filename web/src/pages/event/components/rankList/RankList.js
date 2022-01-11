import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'

//context
import {Context} from 'context'

// static
import './rankList.scss'

const EventRankList = (props) => {
  const {
		type,
    rankList,
    photoSize,
  } = props
  const globalCtx = useContext(Context)
  const history = useHistory()

  // 프로필 이동 이벤트
  const goProfile = (e) => {
    const {targetMemNo} = e.currentTarget.dataset

    if (targetMemNo !== undefined && targetMemNo > 0) {
      history.push(`/mypage/${targetMemNo}`)
    }
  }

  return (
		<div className={`rankList ${type === 'my' && globalCtx.token.isLogin ? 'my' : ''}`}>
			<div className="rankNum">
				{type === 'my' && globalCtx.token.isLogin ? <span className='tit'>내순위</span> : <></>}
				<span className="num">{rankList && rankList.rank_no}</span>
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
