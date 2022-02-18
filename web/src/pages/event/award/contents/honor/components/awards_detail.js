import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

export default function AwardsDetail(props) {
  const {
    selectedDJ: {djMemNo, djNickNm, djMsg, djProfImg, djTitle}
  } = props
  const history = useHistory()

  const context = useContext(Context)

  const directUser = () => {
    !context.token.isLogin
      ? history.push({
          pathname: '/login',
          state: {state: 'event/award/2020'}
        })
      : history.push(`/profile/${djMemNo}`)
  }

  return (
    <div className="detailView">
      <div className="userItem">
        <div className="userItem__userInfo" onClick={directUser}>
          <div className="infoThumbnail">
            <img src={djProfImg['thumb190x190']} alt={djNickNm} className=" userThumbnail" />
            <img
              src="https://image.dalbitlive.com/event/award_rank/awards_dj_frame@2x.png"
              className=" userFrame"
              alt="프레임 이미지"
            />
          </div>

          <div className="infoText">
            <span className="userNickName">{djNickNm}</span>
            <p className="userTitle">{djTitle}</p>
          </div>
        </div>

        <div className="userItem__textBox">
          <div className="impression">
            <img
              src="https://image.dalbitlive.com/event/award_rank/dj_impression.png"
              alt="수상 소감"
              className="impressionPoint"
            />

            <div className="textScroll">{djMsg}</div>
          </div>
        </div>
      </div>

      <img src="https://image.dalbitlive.com/event/award_rank/awards_dj_speech_bg@2x.jpg" alt="어워즈 수상자 배경" />
    </div>
  )
}
