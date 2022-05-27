import React, {useEffect, useState} from 'react'

import {IMG_SERVER} from 'context/config'

import '../../scss/Benefit.scss'

export default () => {
  return (
    <>
      <div className="benefitTop">
        <p className="mainText">TOP TEAM에 도전해보세요!</p>
        <p className="subText">혜택은 멤버 모두에게 각각 지급됩니다.</p>
      </div>

      <div className="tableBox">
        <p className="title">주간 TEAM 랭킹 TOP3</p>
        {/* <p className='subText'>달 보상 지급</p> */}
        <table>
          <colgroup>
            <col width="*" />
            <col width="27%" />
            <col width="27%" />
            <col width="27%" />
          </colgroup>

          <thead>
            <tr>
              <th>일간</th>
              <th>1위</th>
              <th>2위</th>
              <th>3위</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="rank">달</td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 200
              </td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 100
              </td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 50
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="benefitMore">
        <img src={`${IMG_SERVER}/ranking/dalla/benefit-gift.png`} alt="" />
        <p className="mainText">더 많은 혜택을 준비하고 있어요.</p>
        <p className="subText">혜택이 늘어나면 공지사항을 통해<br/>
        안내드릴게요!</p>
      </div>
    </>
  )
}
