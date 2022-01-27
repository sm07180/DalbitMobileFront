import React, { useEffect, useState } from "react";

import { IMG_SERVER } from "constant/define";
import EffectPop from "./effect_pop";

//static
import crownIcon from "../../static/ic_crown_y.svg";
import pointIcon from "../../static/ico_point_red.svg";

let wepbSrc;
export default () => {
  const [effectPop, setEffectPop] = useState(false);
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
          타임 DJ 랭킹 TOP3
          {/* <span className="tableBox__title--sub">
            달 보상, 차기 스페셜 DJ 신청 시 <br />
            가산점(월 최대 10점까지 가능) 지급
          </span> */}
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
      </div>

      <div className="tableBox">
        <p className="tableBox__title">
          일간 DJ 랭킹 TOP3
          {/* <span className="tableBox__title--sub">
            일간 랭킹배지, 입장효과, 애니메이션 프레임, 달 보상, <br />
            경험치 랜덤박스, 인사말 효과지급
          </span> */}
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

            <tr>
              <td className="rank">입장효과</td>
              <td
              // onClick={() => {
              //   setEffectPop(true);
              //   wepbSrc = "https://image.dalbitlive.com/ranking/webp/dj_day1.webp";
              // }}
              >
                <img src={`${IMG_SERVER}/ranking/djd1@2x.png`} width={87} alt="입장효과" />
              </td>
              <td
              // onClick={() => {
              //   setEffectPop(true);
              //   wepbSrc = "https://image.dalbitlive.com/ranking/webp/dj_day2.webp";
              // }}
              >
                <img src={`${IMG_SERVER}/ranking/djd2@2x.png`} width={87} alt="입장효과" />
              </td>
              <td
              // onClick={() => {
              //   setEffectPop(true);
              //   wepbSrc = "https://image.dalbitlive.com/ranking/webp/dj_day3.webp";
              // }}
              >
                <img src={`${IMG_SERVER}/ranking/djd3@2x.png`} width={87} alt="입장효과" />
              </td>
            </tr>

            <tr className="frame">
              <td className="rank">
                애니메이션
                <br />
                프레임
              </td>
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
              <td className="rank">
                경험치
                <br />
                랜덤박스
              </td>
              <td colSpan={3}>
                <img src={`${IMG_SERVER}/images/api/ic_gift@2x.png`} width={20} height={20} /> EXP 50, 100, 200, 400, 500 중
              </td>
            </tr>

            <tr>
              <td className="rank">
                인사말
                <br />
                효과
              </td>
              <td colSpan={3}>
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
        <p className="tableBox__title">
          주간 DJ 랭킹 TOP3
          {/* <span className="tableBox__title--sub">
            주간 랭킹배지, 입장효과, 애니메이션 프레임, 달 보상, <br />
            경험치 랜덤박스, 인사말 효과지급
          </span> */}
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

            <tr>
              <td className="rank">입장효과</td>
              <td
              // onClick={() => {
              //   setEffectPop(true);
              //   wepbSrc = "https://image.dalbitlive.com/ranking/webp/dj_week1.webp";
              // }}
              >
                <img src={`${IMG_SERVER}/ranking/djw1@2x.png`} width={87} alt="입장효과" />
              </td>
              <td
              // onClick={() => {
              //   setEffectPop(true);
              //   wepbSrc = "https://image.dalbitlive.com/ranking/webp/dj_week2.webp";
              // }}
              >
                <img src={`${IMG_SERVER}/ranking/djw2@2x.png`} width={87} alt="입장효과" />
              </td>
              <td
              // onClick={() => {
              //   setEffectPop(true);
              //   wepbSrc = "https://image.dalbitlive.com/ranking/webp/dj_week3.webp";
              // }}
              >
                <img src={`${IMG_SERVER}/ranking/djw3@2x.png`} width={87} alt="입장효과" />
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
              <td colSpan={3}>
                <img src={`${IMG_SERVER}/images/api/ic_gift@2x.png`} width={20} height={20} /> EXP 50, 100, 200, 400, 500 중
              </td>
            </tr>

            <tr>
              <td className="rank">
                인사말
                <br />
                효과
              </td>
              <td colSpan={3}>
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
      {effectPop && <EffectPop setEffectPop={setEffectPop} webpImg={wepbSrc} />}
    </>
  );
};
