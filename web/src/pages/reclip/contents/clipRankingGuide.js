import React, {useEffect} from 'react'

//global components
import Header from 'components/ui/header/Header'

import './clipRankingGuide.scss'

const ClipRankingGuide = () =>{

  return(
    <div id="clipRankingGuide">
     <Header title={'혜택'} type={'back'}/>
      <div className="contentBox" >
        <section className="benefitWrap">
          <div className="title">주간 클립 랭킹 달성 혜택</div>
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
              <tr>
                <td>배지</td>
                <td>1</td>
                <td>2</td>
                <td>3</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section className="scoreWrap">
          <div className="title">점수 집계 방법</div>
            <table>
              <tr>
                <th>기준</th>
                <th>청취 1분 이상</th>
                <th>선물 1달</th>
                <th>좋아요 1번</th>
              </tr>
              <tr>
                <td>점수</td>
                <td>1점</td>
                <td>2점</td>
                <td>3점</td>
              </tr>
            </table>
        </section>
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
    </div>
  )
}

export default ClipRankingGuide