import React, { useContext } from "react";
import { IMG_SERVER } from "constant/define";

import Layout from "common/layout";
import Header from "common/ui/header";

import crownIcon from "../static/ic_crown_y.svg";

function RankBenefit() {
  return (
    <>
      <Header title="랭킹 혜택" />
      <div id="ranking-pageModal">
        <div className="rankGuideWrap">
          <div className="benefitTop">
            <p className="benefitTop__title">
              <img src={crownIcon} /> DJ / FAN / 좋아요 TOP 3에 도전해보세요!
            </p>
            <p>랭커만을 위한 스페셜한 혜택을 받게 됩니다.</p>
          </div>

          <div className="tableBox">
            <p className="tableBox__title">
              TOP 랭킹 배지 지급<span className="tableBox__title--sub">프로필과 방송방에서 랭킹 배지를 자랑하세요!</span>
            </p>

            <table>
              <colgroup>
                <col width="10%" />
                <col width="18%" />
                <col width="18%" />
                <col width="18%" />
                <col width="18%" />
                <col width="18%" />
              </colgroup>

              <thead>
                <tr>
                  <th>랭킹</th>
                  <th>DJ 일간</th>
                  <th>DJ 주간</th>
                  <th>FAN 일간</th>
                  <th>FAN 주간</th>
                  <th>좋아요 주간</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="rank">1</td>
                  <td>
                    <img src={`${IMG_SERVER}/ranking/ic_pc_topdd01@3x.png`} width={36} height={26} />
                  </td>
                  <td>
                    <img src={`${IMG_SERVER}/ranking/ic_pc_topwd01@3x.png`} width={36} height={26} />
                  </td>
                  <td>
                    <img src={`${IMG_SERVER}/ranking/ic_pc_topdf01@3x.png`} width={36} height={26} />
                  </td>
                  <td>
                    <img src={`${IMG_SERVER}/ranking/ic_pc_topwf01@3x.png`} width={36} height={26} />
                  </td>
                  <td>
                    <img src={`${IMG_SERVER}/ranking/pc_heart01_l@3x.png`} width={36} height={26} />
                  </td>
                </tr>

                <tr>
                  <td className="rank">2</td>
                  <td>
                    <img src={`${IMG_SERVER}/ranking/ic_pc_topdd02@3x.png`} width={36} height={26} />
                  </td>
                  <td>
                    <img src={`${IMG_SERVER}/ranking/ic_pc_topwd02@3x.png`} width={36} height={26} />
                  </td>
                  <td>
                    <img src={`${IMG_SERVER}/ranking/ic_pc_topdf02@3x.png`} width={36} height={26} />
                  </td>
                  <td>
                    <img src={`${IMG_SERVER}/ranking/ic_pc_topwf02@3x.png`} width={36} height={26} />
                  </td>
                  <td>
                    <img src={`${IMG_SERVER}/ranking/pc_heart02_l@3x.png`} width={36} height={26} />
                  </td>
                </tr>

                <tr>
                  <td className="rank">3</td>
                  <td>
                    <img src={`${IMG_SERVER}/ranking/ic_pc_topdd03@3x.png`} width={36} height={26} />
                  </td>
                  <td>
                    <img src={`${IMG_SERVER}/ranking/ic_pc_topwd03@3x.png`} width={36} height={26} />
                  </td>
                  <td>
                    <img src={`${IMG_SERVER}/ranking/ic_pc_topdf03@3x.png`} width={36} height={26} />
                  </td>
                  <td>
                    <img src={`${IMG_SERVER}/ranking/ic_pc_topwf03@3x.png`} width={36} height={26} />
                  </td>
                  <td>
                    <img src={`${IMG_SERVER}/ranking/pc_heart03_l@3x.png`} width={36} height={26} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="tableBox">
            <p className="tableBox__title">달과 경험치 지급</p>

            <table>
              <colgroup>
                <col width="10%" />
                <col width="22.5%" />
                <col width="22.5%" />
                <col width="22.5%" />
                <col width="22.5%" />
              </colgroup>

              <thead>
                <tr>
                  <th>랭킹</th>
                  <th>DJ / FAN 일간</th>
                  <th>DJ / FAN 주간</th>
                  <th>좋아요 일간</th>
                  <th>좋아요 주간</th>
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
                  <td>
                    <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 100
                  </td>
                  <td>
                    <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 200
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
                  <td>
                    <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 50
                  </td>
                  <td>
                    <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 100
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
                  <td>
                    <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 30
                  </td>
                  <td>
                    <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 50
                  </td>
                </tr>

                <tr>
                  <td colSpan={5} className="random">
                    DJ / FAN 랭커에게는 경험치 랜덤 박스가 추가 지급됩니다.
                    <br />
                    <span>경험치 랜덤 박스 (EXP 50, 100, 200, 400, 500)</span>
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
                  <td rowSpan={3} className="note">
                    스페셜DJ 총점 100점 기준
                    <br />
                    <i>월 누적 최대 10점</i>까지만 인정
                    <br />※ 가산점은 DJ 일간 랭킹만 반영됩니다.
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
          </div>
        </div>
      </div>
    </>
  );
}
export default React.memo(RankBenefit);
