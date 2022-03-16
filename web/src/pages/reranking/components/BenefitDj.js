import React, {useEffect, useState} from 'react'

import {IMG_SERVER} from 'context/config'

//static
import pointIcon from '../static/ico_point_red.svg'

import './benefit.scss'

let wepbSrc
export default () => {
  const [effectPop, setEffectPop] = useState(false)

  return (
    <>
      <div className="benefitTop">
        <p className="mainText">TOP DJ에 도전해보세요!</p>
        <p className="subText">청취자들의 기대에 부응할 수 있습니다.</p>
      </div>

      <div className="tableBox">
        <p className="title">타임 DJ 랭킹 TOP3</p>

        <table>
          <colgroup>
            <col width="*" />
            <col width="27%" />
            <col width="27%" />
            <col width="27%" />
          </colgroup>

          <thead>
            <tr>
              <th>타임</th>
              <th>1위</th>
              <th>2위</th>
              <th>3위</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="rank">달</td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 50
              </td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 30
              </td>
              <td>
                <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 20
              </td>
            </tr>
            <tr className="special">
              <td className="rank">
                스페셜DJ
                <br />
                가산점
              </td>
              <td>
                <img src={pointIcon} alt="포인트" /> +1.5점
              </td>
              <td>
                <img src={pointIcon} alt="포인트" /> +0.5점
              </td>
              <td>
                <img src={pointIcon} alt="포인트" /> +0.3점
              </td>
            </tr>
          </tbody>
        </table>
        <div className='infoWrap'>
          <p className='mainInfo'>획득한 가산점은 스페셜DJ 선발 점수 (일반 100점 만점)에 추가됩니다.</p>
          <p className='subInfo'>예) 일반 점수 95점 + 가산점 10점 = 총 <span>105</span>점</p>
        </div>
      </div>

      <div className="tableBox">
        <p className="title">일간 DJ 랭킹 TOP3</p>
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
                  <img src={`${IMG_SERVER}/badge/dalla/symbol/daily_dj-1.png`} width={15} height={14} />
                  일간 DJ 1
                </span>
              </td>
              <td>
                <span className="badge">
                  <img src={`${IMG_SERVER}/badge/dalla/symbol/daily_dj-2.png`} width={15} height={14} />
                  일간 DJ 2
                </span>
              </td>
              <td>
                <span className="badge">
                  <img src={`${IMG_SERVER}/badge/dalla/symbol/daily_dj-3.png`} width={15} height={14} />
                  일간 DJ 3
                </span>
              </td>
            </tr>

            <tr>
              <td className="rank">입장효과</td>
              <td>
                <img src={`${IMG_SERVER}/ranking/djd1@2x.png`} width={80} alt="입장효과" />
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/djd2@2x.png`} width={80} alt="입장효과" />
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/djd3@2x.png`} width={80} alt="입장효과" />
              </td>
            </tr>

            <tr className="animationFrame">
              <td className="rank">애니메이션<br />프레임</td>
              <td>
                <img src={`${IMG_SERVER}/ranking/ic_ddj01@2x.png`} width={40} height={51.7} />
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/ic_ddj02@2x.png`} width={40} height={51.7} />
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/ic_ddj03@2x.png`} width={40} height={51.7} />
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

            <tr>
              <td className="rank">인사말<br />효과</td>
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
      </div>

      <div className="tableBox">
        <p className="title">주간 DJ 랭킹 TOP3</p>

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
                  <img src={`${IMG_SERVER}/badge/dalla/symbol/weekly_dj-1.png`} width={15} height={14} />주간 DJ 1
                </span>
              </td>
              <td>
                <span className="badge djWeek">
                  <img src={`${IMG_SERVER}/badge/dalla/symbol/weekly_dj-2.png`} width={15} height={14} />주간 DJ 2
                </span>
              </td>
              <td>
                <span className="badge djWeek">
                  <img src={`${IMG_SERVER}/badge/dalla/symbol/weekly_dj-3.png`} width={15} height={14} />주간 DJ 3
                </span>
              </td>
            </tr>

            <tr>
              <td className="rank">입장효과</td>
              <td>
                <img src={`${IMG_SERVER}/ranking/djw1@2x.png`} width={80} alt="입장효과" />
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/djw2@2x.png`} width={80} alt="입장효과" />
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/djw3@2x.png`} width={80} alt="입장효과" />
              </td>
            </tr>

            <tr className="animationFrame">
              <td className="rank">애니메이션<br />프레임</td>
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
              <td className="rank">경험치<br />랜덤박스</td>
              <td colSpan="3">
                <img src={`${IMG_SERVER}/images/api/ic_gift@2x.png`} width={20} height={20} /> EXP 50, 100, 200, 400, 500 중
              </td>
            </tr>

            <tr>
              <td className="rank">인사말<br />효과</td>
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

      <div className='tableBox'>
        <p className="title">월간 DJ 랭킹 TOP5</p>
        <p className="text">랭킹 5위까지 선정된 DJ는 전체 회원 대상 푸시를 1회 보낼 수 있습니다. 1:1문의를 통해 신청해주세요!</p>
      </div>
    </>
  )
}
