import React from 'react'
import {useHistory} from 'react-router-dom'

export default function awardEventResultDj({resultList}) {
  const history = useHistory()
  return (
    <div className="tabDjWrap">
      <ul className="awardDjList">
        {resultList &&
          resultList.map((item, idx) => {
            const {
              memNo,
              nickNm,
              profileImage,
              fan1_memNo,
              fan1_nickNm,
              fan1_profileImage,
              fan2_memNo,
              fan2_nickNm,
              fan2_profileImage,
              fan3_memNo,
              fan3_nickNm,
              fan3_profileImage
            } = item

            return (
              <li className="awardDjItem" key={idx}>
                <div className="djThumbBox" onClick={() => history.push(`/profile/${memNo}`)}>
                  <img src={profileImage.thumb336x336} alt={nickNm} />
                  <p className="nickName">{nickNm}</p>
                </div>

                <ul className="bestFanList">
                  {fan1_nickNm && (
                    <li className="bestFanItem" onClick={() => history.push(`/profile/${fan1_memNo}`)}>
                      <div className="thumb">
                        <img src={fan1_profileImage.thumb62x62} alt={fan1_nickNm} className="thumb__image" />
                        <img src="https://image.dalbitlive.com/event/award/201214/ico_medal1.png" className="thumb__medal" />
                      </div>
                      <span>{fan1_nickNm}</span>
                    </li>
                  )}

                  {fan2_nickNm && (
                    <li className="bestFanItem" onClick={() => history.push(`/profile/${fan2_memNo}`)}>
                      <div className="thumb">
                        <img src={fan2_profileImage.thumb62x62} alt={fan2_nickNm} className="thumb__image" />
                        <img src="https://image.dalbitlive.com/event/award/201214/ico_medal2.png" className="thumb__medal" />
                      </div>
                      <span>{fan2_nickNm}</span>
                    </li>
                  )}

                  {fan3_nickNm && (
                    <li className="bestFanItem" onClick={() => history.push(`/profile/${fan3_memNo}`)}>
                      <div className="thumb">
                        <img src={fan3_profileImage.thumb62x62} alt={fan3_nickNm} className="thumb__image" />
                        <img src="https://image.dalbitlive.com/event/award/201214/ico_medal3.png" className="thumb__medal" />
                      </div>
                      <span>{fan3_nickNm}</span>
                    </li>
                  )}
                </ul>
              </li>
            )
          })}
      </ul>

      <p className="notice">
        ※ 프로필과 닉네임은 수상 시점의 정보로 노출됩니다.
        <br />
        ※ 1, 2, 3위 팬은 어워즈 수상 시점의 팬 순위 입니다
        <br />※ 계정 탈퇴시에도 해당 정보는 노출됩니다.
      </p>
    </div>
  )
}
