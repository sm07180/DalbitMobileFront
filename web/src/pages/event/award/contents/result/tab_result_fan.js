import React from 'react'
import {useHistory} from 'react-router-dom'

export default function awardEventResultFan({resultList}) {
  const history = useHistory()

  return (
    <div className="tabFanWrap">
      <ul className="awardFanList">
        {resultList &&
          resultList.map((item, idx) => {
            const {memNo, nickNm, profileImage} = item

            return (
              <li className="awardFanItem" key={idx} onClick={() => history.push(`/profile/${memNo}`)}>
                <div className="thumb">
                  <img src={profileImage.thumb336x336} className="thumb__image" alt={nickNm} />
                  <img src="https://image.dalbitlive.com/event/award/201214/ico-2020-medal.png" className="thumb__medal" />
                </div>
                <p className="nickName">{nickNm}</p>
              </li>
            )
          })}
      </ul>

      <p className="notice">
        ※ 프로필과 닉네임을 포함한 전체 데이터는 수상 시점의
        <br />
        정보로 노출됩니다.
        <br />※ 계정 탈퇴시에도 해당 정보는 노출됩니다.
      </p>
    </div>
  )
}
