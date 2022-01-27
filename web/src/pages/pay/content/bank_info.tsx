import React from "react";

import Layout from "common/layout";
import Header from "common/ui/header";
import { IMG_SERVER } from "constant/define";

import hint from "../static/ico_hint_b_s@2x.png";

export default function bankInfo() {
  return (
    <Layout>
      <Header title="은행별 시스템 점검시간" />

      <div id="pay">
        <div className="bankInfoWrap">
          <table>
            <colgroup>
              <col width="45%" />
              <col width="55%" />
            </colgroup>

            <thead>
              <tr>
                <th>은행명</th>
                <th>시스템 점검시간</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <img src={`${IMG_SERVER}/store/charge/201124/ico_bank01@2x.png`} /> 농협
                </td>
                <td>00:00 ~ 00:30</td>
              </tr>

              <tr>
                <td>
                  <img src={`${IMG_SERVER}/store/charge/201124/ico_bank02@2x.png`} /> 국민은행
                </td>
                <td>00:00 ~ 00:05</td>
              </tr>

              <tr>
                <td>
                  <img src={`${IMG_SERVER}/store/charge/201124/ico_bank03@2x.png`} /> 카카오뱅크
                </td>
                <td>23:57 ~ 00:03</td>
              </tr>

              <tr>
                <td>
                  <img src={`${IMG_SERVER}/store/charge/201124/ico_bank04@2x.png`} /> 신한은행
                </td>
                <td>23:50 ~ 00:10</td>
              </tr>

              <tr>
                <td>
                  <img src={`${IMG_SERVER}/store/charge/201124/ico_bank05@2x.png`} /> 기업은행
                </td>
                <td>00:00 ~ 00:10</td>
              </tr>

              <tr>
                <td>
                  <img src={`${IMG_SERVER}/store/charge/201124/ico_bank06@2x.png`} /> 우리은행
                </td>
                <td>
                  23:55 ~ 00:05
                  <br />
                  매월 두번째 일요일 02:00 ~ 06:00
                </td>
              </tr>

              <tr>
                <td>
                  <img src={`${IMG_SERVER}/store/charge/201124/ico_bank07@2x.png`} /> 하나은행
                </td>
                <td>23:40 ~ 00:20, 16:30 ~ 16:35</td>
              </tr>

              <tr>
                <td>
                  <img src={`${IMG_SERVER}/store/charge/201124/ico_bank08@2x.png`} /> 한국씨티은행
                </td>
                <td>23:30 ~ 00:30</td>
              </tr>

              <tr>
                <td>
                  <img src={`${IMG_SERVER}/store/charge/201124/ico_bank09@2x.png`} /> SC제일은행
                </td>
                <td>23:40 ~ 00:30</td>
              </tr>

              <tr>
                <td>
                  <img src={`${IMG_SERVER}/store/charge/201124/ico_bank10@2x.png`} /> 산업은행
                </td>
                <td>23:55 ~ 00:10</td>
              </tr>

              <tr>
                <td>
                  <img src={`${IMG_SERVER}/store/charge/201124/ico_bank11@2x.png`} /> 전북은행
                </td>
                <td>23:55 ~ 00:05</td>
              </tr>

              <tr>
                <td>
                  <img src={`${IMG_SERVER}/store/charge/201124/ico_bank04@2x.png`} /> 제주은행
                </td>
                <td>23:55 ~ 00:10</td>
              </tr>

              <tr>
                <td>
                  <img src={`${IMG_SERVER}/store/charge/201124/ico_bank13@2x.png`} /> 새마을금고중앙회
                </td>
                <td>23:50 ~ 00:15</td>
              </tr>

              <tr>
                <td>
                  <img src={`${IMG_SERVER}/store/charge/201124/ico_bank14@2x.png`} /> 대구은행
                </td>
                <td>23:30 ~ 01:00</td>
              </tr>

              <tr>
                <td>
                  <img src={`${IMG_SERVER}/store/charge/201124/ico_bank15@2x.png`} /> 우체국
                </td>
                <td>23:50 ~ 00:10</td>
              </tr>

              <tr>
                <td>
                  <img src={`${IMG_SERVER}/store/charge/201124/ico_bank11@2x.png`} /> 광주은행
                </td>
                <td>23:55 ~ 00:20</td>
              </tr>

              <tr>
                <td>
                  <img src={`${IMG_SERVER}/store/charge/201124/ico_bank17@2x.png`} /> 신협
                </td>
                <td>00:00 ~ 00:10</td>
              </tr>

              <tr>
                <td>
                  <img src={`${IMG_SERVER}/store/charge/201124/ico_bank18@2x.png`} /> 경남은행
                </td>
                <td>23:00 ~ 00:00</td>
              </tr>

              <tr>
                <td>
                  <img src={`${IMG_SERVER}/store/charge/201124/ico_bank19@2x.png`} /> 케이뱅크
                </td>
                <td>23:50 ~ 00:10</td>
              </tr>

              <tr>
                <td>
                  <img src={`${IMG_SERVER}/store/charge/201124/ico_bank20@2x.png`} /> 수협은행
                </td>
                <td>23:50 ~ 00:30</td>
              </tr>

              <tr>
                <td>
                  <img src={`${IMG_SERVER}/store/charge/201124/ico_bank21@2x.png`} /> 저축은행
                </td>
                <td>23:50 ~ 00:10</td>
              </tr>
            </tbody>
          </table>

          <div className="notice">
            <p>
              <img src={hint} width={12} alt="유의사항" />
              유의사항
            </p>

            <ul>
              <li>점검시간은 각 은행 별 시스템 일자전환 및 금융결제원 자금정산 시간으로 결제 및 달 충전이 제한될 수 있습니다.</li>
              <li>휴일거래량, 당행 시스템 환경 등에 따라 다소 지연될 수 있습니다.</li>
              <li>정기점검 일정은 당행 사정에 따라 변경될 수 있습니다. </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
