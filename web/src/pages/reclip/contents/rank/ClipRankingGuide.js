import React, {useEffect} from 'react'

//global components
import Header from 'components/ui/header/Header';
import BadgeItems from 'components/ui/badgeItems/BadgeItems';

import './clipRankingGuide.scss';

const TempTableList = (props) => {
  const {data} = props
  return (
    <section className="table">
      <h2 className="title">{data.name}</h2>
      <table>
        <thead>
        <tr>
          {data.thData.map((list,index) => {
            return (
              <th key={index}>{list}</th>
            )
          })}
        </tr>
        </thead>
        <tbody>
        <tr>
          {data.tdData.map((list,index) => {
            return (
              <td key={index}>{list}</td>
            )
          })}
        </tr>
        </tbody>
      </table>
    </section>
  );
};

const ClipRankingGuide = () =>{

  const tempTableData = [{
      name: '점수 집계 방법',
      thData:['기준','청취 1분 이상','선물 1달','좋아요 1번'],
      tdData:['점수','1점','1점','1점'],
    },
  ];

  return(
    <div id="clipRankingGuide">
      <Header title="혜택" type="back"/>
      <section className="table">
        <h2 className="title">주간 클립 랭킹 달성 혜택</h2>
        <table>
          <thead>
          <tr>
            <th>순위</th>
            <th>1위</th>
            <th>2위</th>
            <th>3위</th>
          </tr>
          </thead>
          <tbody>
          <tr className="badge">
            <td>배지</td>
            <td><div><BadgeItems data={{commonBadgeList: [{ icon: 'https://image.dalbitlive.com/badge/dalla/symbol/weekly_clip-1.png', startColor: '#8734CA', endColor: '#8734CA', text: '클립 주간 1' }]}} type='commonBadgeList'/></div></td>
            <td><div><BadgeItems data={{commonBadgeList: [{ icon: 'https://image.dalbitlive.com/badge/dalla/symbol/weekly_clip-2.png', startColor: '#8734CA', endColor: '#8734CA', text: '클립 주간 2' }]}} type='commonBadgeList'/></div></td>
            <td><div><BadgeItems data={{commonBadgeList: [{ icon: 'https://image.dalbitlive.com/badge/dalla/symbol/weekly_clip-3.png', startColor: '#8734CA', endColor: '#8734CA', text: '클립 주간 3' }]}} type='commonBadgeList'/></div></td>
          </tr>
          </tbody>
        </table>
      </section>
      <TempTableList data={tempTableData[0]} />
      <section className="noticeWrap">
        <ul>
          <li>- 뱃지는 마이 프로필에서 확인 가능합니다.</li>
          <li>- 점수는 공개 클립 대상으로 집계됩니다.</li>
          <li>- 한 클립 내 중복 댓글은 점수에 집계되지 않습니다.</li>
          <li>- 최종 좋아요 수와 댓글 수로 랭킹 순위가 결정됩니다.</li>
        </ul>
      </section>
      <section className='bottomWrap'>
        <img src="https://image.dalbitlive.com/clip/dalla/clipBenefitBottom.png" alt="" />
      </section>
    </div>
  )
}

export default ClipRankingGuide;