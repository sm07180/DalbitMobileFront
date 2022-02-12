import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'
import Utility from 'components/lib/utility'
import {Context} from 'context'
import {ClipPlay} from 'pages/clip_rank/components/clip_play_fn'
import {useSelector} from "react-redux";

const liveDateCheckIdx = 3

export default function ClipRankingList() {
  const context = useContext(Context)
  const history = useHistory()
  const clipRankState = useSelector(({clipRank}) => clipRank);
  const {clipRankList} = clipRankState

  function loginCheck(memNo) {
    if (!context.token.isLogin) {
      history.push(`/login?redirect=/mypage/${memNo}`)
    } else {
      history.push(`/mypage/${memNo}`)
    }
  }

  return (
    <ul className="userRanking bottomList">
      <button
        className="allPlay"
        onClick={() => {
          ClipPlay(clipRankList[0].clipNo, context, history)
        }}>
        전체듣기
      </button>
      {clipRankList.slice(liveDateCheckIdx).map((v, i) => {
        return (
          <li className="rankingList" key={i}>
            <div className="rankingList__item">
              <div className="rankingList__item--ranking">{v.rank}</div>
              <div className="rankingList__item--updown">
                {v.upDown === '-' || v.upDown === '' ? (
                  <span className="rankingList__item--updown">{v.upDown}</span>
                ) : v.upDown.includes('new') ? (
                  <span className="rankingList__item--updown new">{v.upDown}</span>
                ) : v.upDown.includes('+') ? (
                  <span className="rankingList__item--updown up">{Math.abs(parseInt(v.upDown))}</span>
                ) : (
                  <span className="rankingList__item--updown down">{Math.abs(parseInt(v.upDown))}</span>
                )}
              </div>
            </div>

            <div className="rankingList__content">
              <div className="thumbBox" onClick={() => ClipPlay(v.clipNo, context, history)}>
                <img src={v.bgImg.thumb120x120} className="thumbBox__pic" />
              </div>

              <div className="textBox">
                <p className="textBox__subject" onClick={() => ClipPlay(v.clipNo, context, history)}>
                  <span className="subject">{v.subjectName}</span>
                  <span className="title">{v.title}</span>
                </p>
                <strong
                  className="textBox__nickName"
                  onClick={() => {
                    loginCheck(v.memNo)
                  }}>
                  {v.nickName}
                </strong>
                <div className="textBox__detail" onClick={() => ClipPlay(v.clipNo, context, history)}>
                  {/*<span className="textBox__detail--item headsetIcon">{Utility.addComma(v.listenPoint)}</span>*/}
                  <span className="textBox__detail--item giftIcon">{Utility.addComma(v.giftPoint)}</span>
                  <span className="textBox__detail--item heartIcon">{Utility.addComma(v.goodPoint)}</span>
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
