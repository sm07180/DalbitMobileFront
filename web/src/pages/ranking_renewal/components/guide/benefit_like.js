import React, {useEffect, useState} from 'react'

import {IMG_SERVER} from 'context/config'

//static
import crownIcon from '../../static/ic_crown_y.svg'

export default () => {
  return (
    <>
      <div className="benefitTop">
        <p className="benefitTop__title">
          <img src={crownIcon} /> TOP 좋아요에 도전해보세요!
        </p>
        <p>심쿵유발자의 든든한 사랑꾼이 될 수 있습니다.</p>
      </div>

      <div className="tableBox">
        <p className="tableBox__title">
          일간 좋아요 랭킹 TOP3
          {/* <span className="tableBox__title--sub">달 보상 지급</span> */}
        </p>

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
                <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 100
              </td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 50
              </td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 30
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="tableBox">
        <p className="tableBox__title">
          주간 좋아요 랭킹 TOP3
          {/* <span className="tableBox__title--sub">주간 랭킹 배지, 달 보상, 사랑꾼 효과 지급</span> */}
        </p>

        <table>
          <colgroup>
            <col width="*" />
            <col width="27%" />
            <col width="27%" />
            <col width="27%" />
          </colgroup>

          <thead>
            <tr>
              <th>주간</th>
              <th>1위</th>
              <th>2위</th>
              <th>3위</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="rank">배지</td>
              <td>
                <span className="badge likeWeek">
                  <img src={`${IMG_SERVER}/ranking/heartr1@2x.png`} width={25} height={23} />
                  지독한사랑꾼
                </span>
              </td>
              <td>
                <span className="badge likeWeek">
                  <img src={`${IMG_SERVER}/ranking/heartr2@2x.png`} width={25} height={23} />
                  정열의사랑꾼
                </span>
              </td>
              <td>
                <span className="badge likeWeek">
                  <img src={`${IMG_SERVER}/ranking/heartr3@2x.png`} width={25} height={23} />
                  은은한사랑꾼
                </span>
              </td>
            </tr>

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

            <tr>
              <td className="effect">
                방송 청취중
                <br />
                좋아요 효과
              </td>
              <td>
                좋아요 시<br />
                +10 효과
              </td>
              <td>
                좋아요 시<br />
                +5 효과
              </td>
              <td>
                좋아요 시<br />
                +3 효과
              </td>
            </tr>

            <tr>
              <td className="effect">
                방송 청취중
                <br />
                메인 효과
              </td>
              <td colSpan={3}>
                <img src="https://image.dalbitlive.com/ranking/effect_like_info.png" alt="like_info" className="likeInfo" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
