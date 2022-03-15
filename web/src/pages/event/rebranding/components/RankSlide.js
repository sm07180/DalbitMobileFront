import React from 'react';
import moment from 'moment';

// global components
import GenderItems from 'components/ui/genderItems/GenderItems';
import PopSlide from 'components/ui/popSlide/PopSlide';
// components
import RankList from '../../components/rankList/RankList';
// contents
// css
import '../style.scss';

const DallaguersPopSlide = (props) => {
  const {rankInfo,eventDate,tabmenuType} = props;

  return (
    <PopSlide>
      <section className="rebrandingRank">
        <h3>
          달라져스 : {tabmenuType !== 3 ? tabmenuType : '스페셜'} 라운드
          <span>{tabmenuType !== 3 && `${moment(eventDate.start).format('YY.MM.DD')} - ${moment(eventDate.end).format('MM.DD')}`}</span>
          <span className='text'>전체 순위는 100위까지 확인할 수 있습니다.</span>
        </h3>
        <div className="scrollRankWrap">
          {rankInfo.map((data,idex) => {
            return (
              <RankList key={idex} photoSize={55} listNum={idex} rankList={data} index={idex}>
                <div className="listContent">
                  <div className="listItem">
                    <GenderItems data={data.mem_sex} />
                    <div className="nick">{data.mem_nick}</div>
                  </div>
                </div>
                {/* <div className="listBack">
                  <span>{data.dalla_cnt}</span>
                </div> */}
              </RankList>
            )
          })}
        </div>
      </section>
    </PopSlide>
  )
}

export default DallaguersPopSlide