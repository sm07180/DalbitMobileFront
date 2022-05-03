import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'
import Utility from 'components/lib/utility'
import {useDispatch, useSelector} from "react-redux";

export default function TabFan(props) {
  const {
    eachFan: {joinDt, listenTime, goodPoint, memNo, profImg, nickNm, fanTitle}
  } = props
  const history = useHistory()
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const renderList = [
    {
      title: '가입 일자',
      data: Utility.dateFormatter(joinDt, 'slash')
    },
    {
      title: '청취 시간',
      data: `${Utility.addComma(listenTime)}분`
    },
    {
      title: '좋아요 수',
      data: `${Utility.addComma(goodPoint)}개`
    }
  ]

  const directUser = () => {
    !globalState.token.isLogin
      ? history.push({
          pathname: '/login',
          state: {state: 'event/award/2020'}
        })
      : history.push(`/profile/${memNo}`)
  }

  return (
    <div className="fanBox">
      <div className="fanBox__item">
        <div className="thumbnailBox" onClick={directUser}>
          <img src={profImg['thumb336x336']} alt="프로필 이미지" />
          <p className="nickName">{nickNm}</p>
        </div>
        <div className="textBox">
          <ul className="textBox__list">
            {renderList.map(({title, data}, idx) => (
              <li key={idx}>
                {title} : {data}
              </li>
            ))}
          </ul>

          <div className="introduce">
            <span>{fanTitle}</span>
            <img src="https://image.dallalive.com/event/award_rank/fan_bg_box.png" alt="소개 배경" />
          </div>
        </div>
      </div>
    </div>
  )
}
