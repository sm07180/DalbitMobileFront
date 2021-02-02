import React from 'react'
import '../../index.scss'
import {IMG_SERVER} from 'context/config'

const Guidance = () => {
  return (
    <>
      <div id="benefitsDetail">
        <h3 className="title">
          👑 주간 클립 TOP 랭커에 도전해 보세요!
          <p>청취자들의 연예인이 될 수 있습니다.</p>
        </h3>
        <div className="datailContent">
          <ul className="pointCount">
            <li>
              청취 1분 이상 <span>1점</span>
            </li>
            <li>
              선물 1달 당 <span>2점</span>
            </li>
            <li>
              좋아요 1번 당 <span>3점</span>
            </li>
          </ul>

          <ul className="noticeList">
            <li>· 주간 클립 TOP3 회원에게는 배지 혜택을 드립니다.</li>
            <li>· 클립 등록 후 공개된 클립만 랭킹 대상이 될 수 있습니다.</li>
            <li>· 좋아요 점수는 일주일 간 매일 1회 1건에 대한 점수가 반영됩니다.</li>
          </ul>

          <div className="tableBox">
            {/*<p className="tableBox__title">일간 클립랭킹 TOP3 혜택</p>*/}

            {/*<table>*/}
            {/*  <colgroup>*/}
            {/*    <col width="*" />*/}
            {/*    <col width="28%" />*/}
            {/*    <col width="28%" />*/}
            {/*    <col width="28%" />*/}
            {/*  </colgroup>*/}

            {/*  <thead>*/}
            {/*    <tr>*/}
            {/*      <th>일간</th>*/}
            {/*      <th>1위</th>*/}
            {/*      <th>2위</th>*/}
            {/*      <th>3위</th>*/}
            {/*    </tr>*/}
            {/*  </thead>*/}

            {/*  <tbody>*/}
            {/*    <tr>*/}
            {/*      <td>달</td>*/}
            {/*      <td>*/}
            {/*        <img src={`${IMG_SERVER}/svg/ic_moon_s.svg`} className="dal" /> 달 100*/}
            {/*      </td>*/}
            {/*      <td>*/}
            {/*        <img src={`${IMG_SERVER}/svg/ic_moon_s.svg`} className="dal" /> 달 50*/}
            {/*      </td>*/}
            {/*      <td>*/}
            {/*        <img src={`${IMG_SERVER}/svg/ic_moon_s.svg`} className="dal" /> 달 30*/}
            {/*      </td>*/}
            {/*    </tr>*/}
            {/*  </tbody>*/}
            {/*</table>*/}

            <p className="tableBox__title">주간 클립 TOP3 회원 혜택</p>

            <table>
              <colgroup>
                <col width="*" />
                <col width="28%" />
                <col width="28%" />
                <col width="28%" />
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
                  <td>배지</td>
                  <td>
                    <span className="badge">
                      <img src={`${IMG_SERVER}/svg/ic_topclip_w01.svg`} />
                      클립 주간1
                    </span>
                  </td>
                  <td>
                    <span className="badge">
                      <img src={`${IMG_SERVER}/svg/ic_topclip_w02.svg`} />
                      클립 주간2
                    </span>
                  </td>
                  <td>
                    <span className="badge">
                      <img src={`${IMG_SERVER}/svg/ic_topclip_w03.svg`} />
                      클립 주간3
                    </span>
                  </td>
                </tr>
                {/*<tr>*/}
                {/*  <td>달</td>*/}
                {/*  <td>*/}
                {/*    <img src={`${IMG_SERVER}/svg/ic_moon_s.svg`} className="dal" /> 달 200*/}
                {/*  </td>*/}
                {/*  <td>*/}
                {/*    <img src={`${IMG_SERVER}/svg/ic_moon_s.svg`} className="dal" /> 달 100*/}
                {/*  </td>*/}
                {/*  <td>*/}
                {/*    <img src={`${IMG_SERVER}/svg/ic_moon_s.svg`} className="dal" /> 달 50*/}
                {/*  </td>*/}
                {/*</tr>*/}
              </tbody>
            </table>
            <div className="tableBox__notice">
              ※ 주간 클립 TOP3 회원에게 적용되는 배지는
              <br /> <strong>랭킹페이지와 마이 프로필에서 확인이 가능합니다.</strong>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Guidance
