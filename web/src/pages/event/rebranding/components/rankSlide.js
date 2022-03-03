import React, {useState} from 'react'
import moment from 'moment'

// global components
import GenderItems from 'components/ui/genderItems/GenderItems'
import PopSlide from 'components/ui/popSlide/PopSlide'
// components
import RankList from '../../components/rankList/RankList'
// contents
// css
import '../style.scss'

const DallaguersPopSlide = (props) => {
  const {setPopRankSlide,rankInfo,eventInfo,eventDate} = props

  return (
    <PopSlide setPopSlide={setPopRankSlide}>
      <section className="rebrandingRank">
        <h3>달라져스 : {eventInfo.seq_no} 라운드<span>{`${moment(eventDate.start).format('YY.MM.DD')} - ${moment(eventDate.end).format('MM.DD')}`}</span></h3>
        <div className="rankWrap">
          {rankInfo.map((data,idx) => {
            return (
              <div key={`rankInfo-${idx}`}>
                <RankList photoSize={55} listNum={idx} rankList={data}>
                  <div className="listContent">
                    <div className="listItem">
                      <GenderItems data={data.mem_sex} />
                      <div className="nick">{data.mem_nick}</div>
                    </div>
                  </div>
                  <div className="listBack">
                    <span>{data.dalla_cnt}</span>
                  </div>
                </RankList>
              </div>
            )
          })}
        </div>
      </section>
    </PopSlide>
  )
}

export default DallaguersPopSlide