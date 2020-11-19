// import React from 'react'

// //static
// import hintIcon from '../static/hint_b_s.svg'

// export default (props) => {
//   return (
//     <div className="rankGuideWrap">
//       <div className="tableBox">
//         <p className="tableBox__title">DJ 랭킹</p>

//         <table>
//           <colgroup>
//             <col width="20%" />
//             <col width="20%" />
//             <col width="20%" />
//             <col width="20%" />
//             <col width="20%" />
//           </colgroup>
//           <thead>
//             <tr>
//               <th>구분</th>
//               <th>
//                 받은
//                 <br />
//                 선물
//               </th>
//               <th>
//                 받은
//                 <br />
//                 좋아요
//               </th>
//               <th>
//                 누적
//                 <br />
//                 청취자
//               </th>
//               <th>
//                 방송
//                 <br />
//                 시간
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td className="category">비율(%)</td>
//               <td>30%</td>
//               <td>20%</td>
//               <td>20%</td>
//               <td>30%</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//       <div className="tableBox">
//         <p className="tableBox__title">FAN 랭킹</p>

//         <table>
//           <colgroup>
//             <col width="33.3333%" />
//             <col width="33.3333%" />
//             <col width="33.3333%" />
//           </colgroup>
//           <thead>
//             <tr>
//               <th>구분</th>
//               <th>보낸 선물</th>
//               <th>청취 시간</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td className="category">비율(%)</td>
//               <td>60%</td>
//               <td>40%</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       {/* <div className="tableBox">
//         <p className="tableBox__title">LEVEL 랭킹 조건</p>

//         <div className="conditionBox">
//           <div className="conditionItem">
//             <p className="conditionItem__title">조건 1</p>
//             <p className="conditionItem__content">
//               최고 레벨 순<br />
//               TOP 200
//             </p>
//           </div>
//           <div className="conditionItem">
//             <p className="conditionItem__title">조건 2</p>
//             <p className="conditionItem__content">
//               최근 7일 간<br />
//               접속 기록 존재
//             </p>
//           </div>
//           <div className="conditionItem">
//             <p className="conditionItem__title">조건 3</p>
//             <p className="conditionItem__content">팬랭킹 존재</p>
//           </div>
//         </div>
//       </div> */}

//       <div className="noticeBox">
//         <p className="noticeBox__title">
//           <img src={hintIcon} /> DJ / FAN 랭킹 집계 및 갱신
//         </p>

//         <ul>
//           <li className="noticeBox__item">· 종료된 방송 기준 데이터 (부스터로 인한 좋아요 제외) 집계</li>
//           <li className="noticeBox__item">· DJ / FAN 오늘: 00시~현재 시간 데이터 집계 및 실시간 갱신</li>
//           <li className="noticeBox__item">· DJ / FAN 어제(일간): 전일(당일) 데이터 집계 및 00시 갱신</li>
//           <li className="noticeBox__item">· DJ / FAN 이번주: 월요일~현재 시간 데이터 집계 및 실시간 갱신</li>
//           <li className="noticeBox__item">· DJ / FAN 지난주(주간): 지난주(해당 주) 월~일 데이터 집계 및 월 00시 갱신</li>
//           <li className="noticeBox__item">· DJ / FAN 이번달: 1일~현재 시간 데이터 집계 및 실시간 갱신</li>
//           <li className="noticeBox__item">· DJ / FAN 지난달(월간): 지난달(해당 달) 1일~마지막 일 데이터 집계 및 1일 00시 갱신</li>
//         </ul>
//       </div>

//       <div className="noticeBox">
//         <p className="tableBox__title tableBox__title--lastTitle">LEVEL 랭킹</p>
//         <ul className="">
//           <li className="noticeBox__item">· 조건) 최근 7일 간 접속 기록 존재</li>
//           <li className="noticeBox__item">· 최고 레벨 순 TOP 200</li>
//           <li className="noticeBox__item">· 매일 데이터 집계 및 00시 갱신</li>
//         </ul>
//       </div>
//     </div>
//   )
// }
