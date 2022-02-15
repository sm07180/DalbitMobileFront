import React, {useEffect, useState} from 'react'

import {IMG_SERVER} from 'context/config'

import './benefit.scss'

let wepbSrc
export default () => {
  const [effectPop, setEffectPop] = useState(false)
  return (
    <>
      <div className="benefitTop">
        <p className="mainText">TOP FAN에 도전해보세요!</p>
        <p className="subText">DJ들이 주목하는 청취자가 될 수 있습니다.</p>
      </div>

      <div className="tableBox">
        <p className="title">일간 FAN 랭킹 TOP3</p>
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
                <span className="badge fanDay">
                  <img src={`${IMG_SERVER}/badge/dalla/symbol/daily_fan-1.png`} width={15} height={14} />일간 팬 1
                </span>
              </td>
              <td>
                <span className="badge fanDay">
                  <img src={`${IMG_SERVER}/badge/dalla/symbol/daily_fan-2.png`} width={15} height={14} />일간 팬 2
                </span>
              </td>
              <td>
                <span className="badge fanDay">
                  <img src={`${IMG_SERVER}/badge/dalla/symbol/daily_fan-3.png`} width={15} height={14} />일간 팬 3
                </span>
              </td>
            </tr>

            <tr>
              <td className="rank">입장효과</td>
              <td>
                <img src={`${IMG_SERVER}/ranking/fanw2@2x.png`} width={80} alt="입장효과" />
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/fand2@2x.png`} width={80} alt="입장효과" />
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/fand3@2x.png`} width={80} alt="입장효과" />
              </td>
            </tr>

            <tr className="frame">
              <td className="rank">애니메이션<br />프레임</td>
              <td>
                <img src={`${IMG_SERVER}/ranking/ic_dfan01@2x.png`} width={40} height={51.7} />
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/ic_dfan02@2x.png`} width={40} height={51.7} />
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/ic_dfan03@2x.png`} width={40} height={51.7} />
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
              <td className="rank">경험치<br />랜덤박스</td>
              <td colSpan="3">
                <img src={`${IMG_SERVER}/images/api/ic_gift@2x.png`} width={20} height={20} /> EXP 50, 100, 200, 400, 500 중
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="tableBox">
        <p className="title">주간 FAN 랭킹 TOP3</p>
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
                <span className="badge fanWeek">
                  <img src={`${IMG_SERVER}/badge/dalla/symbol/weekly_fan-1.png`} width={15} height={14} />주간 팬 1
                </span>
              </td>
              <td>
                <span className="badge fanWeek">
                  <img src={`${IMG_SERVER}/badge/dalla/symbol/weekly_fan-2.png`} width={15} height={14} />주간 팬 2
                </span>
              </td>
              <td>
                <span className="badge fanWeek">
                  <img src={`${IMG_SERVER}/badge/dalla/symbol/weekly_fan-3.png`} width={15} height={14} />주간 팬 3
                </span>
              </td>
            </tr>

            <tr>
              <td className="rank">입장효과</td>
              <td>
                <img src={`${IMG_SERVER}/ranking/fanw1@2x.png`} width={80} alt="입장효과" />
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/fand1@2x.png`} width={80} alt="입장효과" />
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/fanw3@2x.png`} width={80} alt="입장효과" />
              </td>
            </tr>

            <tr className="frame">
              <td className="rank">애니메이션<br />프레임</td>
              <td>
                <img src={`${IMG_SERVER}/ranking/fanrf1_c@2x.png`} width={40} height={51.7} />
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/fanrf2_c@2x.png`} width={40} height={51.7} />
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/fanrf4_c@2x.png`} width={40} height={51.7} />
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
              <td className="rank">경험치<br />랜덤박스</td>
              <td colSpan="3">
                <img src={`${IMG_SERVER}/images/api/ic_gift@2x.png`} width={20} height={20} /> EXP 50, 100, 200, 400, 500 중
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
