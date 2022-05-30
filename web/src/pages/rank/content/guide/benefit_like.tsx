import React, { useEffect, useState } from "react";

import { IMG_SERVER } from "constant/define";

//static
import crownIcon from "../../static/ic_crown_y.svg";

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
          <span className="tableBox__title--sub">달 보상 지급</span>
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
              <td className="rank">입장효과</td>
              <td
              // onClick={() => {
              //   setEffectPop(true);
              //   wepbSrc = "https://image.dallalive.com/ranking/webp/fan_day1.webp";
              // }}
              >
                <img src={`${IMG_SERVER}/ranking/liked1@2x.png`} width={87} alt="입장효과" />
              </td>
              <td
              // onClick={() => {
              //   setEffectPop(true);
              //   wepbSrc = "https://image.dallalive.com/ranking/webp/fan_day2.webp";
              // }}
              >
                <img src={`${IMG_SERVER}/ranking/liked2@2x.png`} width={87} alt="입장효과" />
              </td>
              <td
              // onClick={() => {
              //   setEffectPop(true);
              //   wepbSrc = "https://image.dallalive.com/ranking/webp/fan_day3.webp";
              // }}
              >
                <img src={`${IMG_SERVER}/ranking/likew3@2x.png`} width={87} alt="입장효과" />
              </td>
            </tr>

            <tr className="frame">
              <td className="rank">
                애니메이션
                <br />
                프레임
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/likewf1@2x.png`} width={40} height={51.7} />
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/likewf2@2x.png`} width={40} height={51.7} />
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/likewf3@2x.png`} width={40} height={51.7} />
              </td>
            </tr>
            <tr className="signature">
              <td>
                시그니쳐
                <br />
                좋아요
                <br />
                애니메이션
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/like_signature1@2x.png`} width={54} />
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/like_signature2@2x.png`} width={56} />
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/like_signature3@2x.png`} width={63} />
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
              <td>
                방송 청취중 <br />
                메인 리스트 <br />
                효과
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/like_gold@2x.png`} width={40} />
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/like_silver@2x.png`} width={40} />
              </td>
              <td>
                <img src={`${IMG_SERVER}/ranking/like_bronze@2x.png`} width={40} />
              </td>
            </tr>
          </tbody>
        </table>

        <p className="memo">※ 방송 청취 중 좋아요 및 메인 리스트 효과는 해당 방송방 퇴장 시 사라집니다.</p>
      </div>
    </>
  );
};
