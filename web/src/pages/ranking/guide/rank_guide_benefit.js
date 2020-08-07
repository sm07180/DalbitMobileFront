import React from 'react'

import {IMG_SERVER} from 'context/config'

//static
import crownIcon from '../static/ic_crown_y.svg'

export default (props) => {
  return (
    <div className="rankGuideWrap">
      <div className="benefitTop">
        <p className="benefitTop__title">
          <img src={crownIcon} /> DJ / FAN TOP 3에 도전해보세요!
        </p>
        <p>랭커만을 위한 스페셜한 혜택을 받게 됩니다.</p>
      </div>

      <div className="tableBox">
        <p className="tableBox__title">
          TOP 랭킹 배지 지급<span className="tableBox__title--sub">프로필과 방송방에서 랭킹 배지를 자랑하세요!</span>
        </p>

        <table>
          <colgroup>
            <col width="20%" />
            <col width="20%" />
            <col width="20%" />
            <col width="20%" />
            <col width="20%" />
          </colgroup>

          <thead>
            <tr>
              <th>랭킹</th>
              <th>DJ 일간</th>
              <th>DJ 주간</th>
              <th>FAN 일간</th>
              <th>FAN 주간</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="rank">1</td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_topdd01@2x.png`} width={36} height={24} />
              </td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_topwd01@2x.png`} width={36} height={24} />
              </td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_topfd01@2x.png`} width={36} height={24} />
              </td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_topwf01@2x.png`} width={36} height={24} />
              </td>
            </tr>

            <tr>
              <td className="rank">2</td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_topdd02@2x.png`} width={36} height={24} />
              </td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_topwd02@2x.png`} width={36} height={24} />
              </td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_topfd02@2x.png`} width={36} height={24} />
              </td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_topwf02@2x.png`} width={36} height={24} />
              </td>
            </tr>

            <tr>
              <td className="rank">3</td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_topdd03@2x.png`} width={36} height={24} />
              </td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_topwd03@2x.png`} width={36} height={24} />
              </td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_topfd03@2x.png`} width={36} height={24} />
              </td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_topwf03@2x.png`} width={36} height={24} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="tableBox">
        <p className="tableBox__title">달과 경험치 지급</p>

        <table>
          <colgroup>
            <col width="20%" />
            <col width="40%" />
            <col width="40%" />
          </colgroup>

          <thead>
            <tr>
              <th>랭킹</th>
              <th>DJ / FAN 일간</th>
              <th>DJ / FAN 주간</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="rank">1</td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 200
              </td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 300
              </td>
            </tr>

            <tr>
              <td className="rank">2</td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 100
              </td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 200
              </td>
            </tr>

            <tr>
              <td className="rank">3</td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 50
              </td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 100
              </td>
            </tr>

            <tr>
              <td colSpan="3" className="random">
                <img src={`${IMG_SERVER}/images/api/ic_gift@2x.png`} width={28} height={28} /> 경험치 랜덤 박스 (EXP 50, 100, 200,
                400, 500)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="tableBox">
        <p className="tableBox__title">스페셜DJ 신청 시 가산점 부여</p>

        <table>
          <colgroup>
            <col width="20%" />
            <col width="20%" />
            <col width="60%" />
          </colgroup>

          <thead>
            <tr>
              <th>랭킹</th>
              <th>DJ 일간</th>
              <th>유의사항</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="rank">1</td>
              <td>+ 2 점</td>
              <td rowSpan="3" className="note">
                스페셜DJ 총점 100점 기준
                <br />
                <i>월 누적 최대 15점</i>까지만 인정
              </td>
            </tr>

            <tr>
              <td className="rank">2</td>
              <td>+ 1 점</td>
            </tr>

            <tr>
              <td className="rank">3</td>
              <td>+ 0.5 점</td>
            </tr>
          </tbody>
        </table>

        <div className="tableNotice">※ 월간 랭킹은 제외됩니다.</div>
      </div>
    </div>
  )
}
