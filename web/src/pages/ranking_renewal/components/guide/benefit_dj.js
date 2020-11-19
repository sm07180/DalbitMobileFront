import React, {useEffect, useState} from 'react'

import {IMG_SERVER} from 'context/config'

//static
import crownIcon from '../../static/ic_crown_y.svg'
import pointIcon from '../../static/ico_point_red.svg'

export default () => {
  return (
    <>
      <div className="benefitTop">
        <p className="benefitTop__title">
          <img src={crownIcon} /> TOP DJ에 도전해보세요!
        </p>
        <p>청취자들의 기대에 부응할 수 있습니다.</p>
      </div>

      <div className="tableBox">
        <p className="tableBox__title">
          일간 DJ 랭킹 TOP3
          <span className="tableBox__title--sub">
            일간 랭킹배지, 스페셜DJ 신청 시 가산점, 달 보상,
            <br />
            경험치 랜덤박스, 인사말 효과지급
          </span>
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
              <td className="rank">배지</td>
              <td>
                <span className="badge">
                  <img src={`${IMG_SERVER}/ranking/ic_topdd01_l@2x.png`} width={20.4} height={19.7} />
                  일간 DJ 1
                </span>
              </td>
              <td>
                <span className="badge">
                  <img src={`${IMG_SERVER}/ranking/ic_topdd02_l@2x.png`} width={20.4} height={19.7} />
                  일간 DJ 2
                </span>
              </td>
              <td>
                <span className="badge">
                  <img src={`${IMG_SERVER}/ranking/ic_topdd03_l@2x.png`} width={20.4} height={19.7} />
                  일간 DJ 3
                </span>
              </td>
            </tr>

            <tr className="special">
              <td className="rank">
                스페셜DJ
                <br />
                가산점
              </td>
              <td>
                <img src={pointIcon} alt="포인트" /> +2점
              </td>
              <td>
                <img src={pointIcon} alt="포인트" /> +1점
              </td>
              <td>
                <img src={pointIcon} alt="포인트" /> +0.5점
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
              <td className="rank">
                경험치
                <br />
                랜덤박스
              </td>
              <td colSpan="3">
                <img src={`${IMG_SERVER}/images/api/ic_gift@2x.png`} width={20} height={20} /> EXP 50, 100, 200, 400, 500 중
              </td>
            </tr>

            <tr>
              <td className="rank">
                인사말
                <br />
                효과
              </td>
              <td colSpan="3">
                <div className="effect">
                  <p>
                    안녕하세요. 운영자 더미입니다.
                    <br /> 자리하고 룰렛 응모권 챙기셔야-죠?
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <p className="tableBox__notice">
          ※ 스페셜DJ 가산점은 선발 총점 100점 기준 월 누적 최대
          <br />
          10점까지만 인정
        </p>
      </div>

      <div className="tableBox">
        <p className="tableBox__title">
          주간 DJ 랭킹 TOP3
          <span className="tableBox__title--sub">
            주간 랭킹배지, 애니메이션 프레임, 달 보상, 경험치 랜덤박스,
            <br />
            인사말 효과 지급
          </span>
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
                <span className="badge djWeek">
                  <img src={`${IMG_SERVER}/ranking/ic_topwd01_l@2x.png`} width={20.4} height={19.7} />
                  주간 DJ 1
                </span>
              </td>
              <td>
                <span className="badge djWeek">
                  <img src={`${IMG_SERVER}/ranking/ic_topwd02_l@2x.png`} width={20.4} height={19.7} />
                  주간 DJ 2
                </span>
              </td>
              <td>
                <span className="badge djWeek">
                  <img src={`${IMG_SERVER}/ranking/ic_topwd03_l@2x.png`} width={20.4} height={19.7} />
                  주간 DJ 3
                </span>
              </td>
            </tr>

            <tr className="frame">
              <td className="rank">
                애니메이션
                <br />
                프레임
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/djrf1_t@2x.png`} width={40} height={51.7} />
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/djrf2_t@2x.png`} width={40} height={51.7} />
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/djrf3_t@2x.png`} width={40} height={51.7} />
              </td>
            </tr>

            <tr>
              <td className="rank">달</td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 300
              </td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 200
              </td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 100
              </td>
            </tr>

            <tr>
              <td className="rank">
                경험치
                <br />
                랜덤박스
              </td>
              <td colSpan="3">
                <img src={`${IMG_SERVER}/images/api/ic_gift@2x.png`} width={20} height={20} /> EXP 50, 100, 200, 400, 500 중
              </td>
            </tr>

            <tr>
              <td className="rank">
                인사말
                <br />
                효과
              </td>
              <td colSpan="3">
                <div className="effect">
                  <p>
                    안녕하세요. 운영자 더미입니다.
                    <br /> 입컷하면 미워요!
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
