import React from 'react'
import Utility from 'components/lib/utility'

export default function AwardsScore(props) {
  const {
    selectedDJ: {day, djNickNm, goodPoint, joinDt, listenerPoint}
  } = props

  const renderLists = [
    {
      title: '만난 청취자',
      className: 'people',
      value: Utility.addComma(listenerPoint)
    },
    {
      title: '받은 사랑',
      className: 'heart',
      value: Utility.printNumber(goodPoint)
    },
    {
      title: '함께한 날',
      className: 'days',
      value: `${day}days`
    }
  ]

  return (
    <div className="scoreTotal">
      <div className="scoreTotal__item">
        <p className="scoreTotal__title">
          <span>{djNickNm}</span> 님과
          <br />
          2020년 달라에서
        </p>

        <ul className="scoreTotal__infoBox">
          {renderLists.map(({title, className, value}, idx) => (
            <li key={idx}>
              <span>{title}</span>
              <div className={className}>
                <p>{value}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="dayText">
          <p>{djNickNm}</p> 님과
          <br />
          {joinDt && <span>{Utility.dateFormatterKor(joinDt.toString(), '')}</span>} 부터 함께해서 행복했어요!
        </div>
      </div>

      <img src="https://image.dalbitlive.com/event/award_rank/awards_dj_info_bg@2.jpg" alt="유저 토탈 내용 뒷배경" />
    </div>
  )
}
