// /**
//  * @file /components/ui/noResult.js
//  * @brief 결과 값 없을때 쓰는 공통 ui
//  */

// import React, {useState, useEffect, useContext, useRef} from 'react'
// import styled from 'styled-components'

// //context
// import {IMG_SERVER} from 'context/config'
// import _ from 'lodash'
// import NoResultIcon from './ic_noResult.svg'
// export default props => {
//   const {msg} = props
//   const [text, setText] = useState('조회 된 결과가')
//   const [brText, setBrText] = useState('없습니다.')

//   useEffect(() => {
//     if (_.hasIn(props, 'text')) {
//       setText(props.text)
//     }
//   }, [])
//   return (
//     <NoResult className={props.className}>
//       {msg ? (
//         msg
//       ) : (
//         <>
//           <span>{text}</span>
//           <span className="line">{brText}</span>
//         </>
//       )}
//     </NoResult>
//   )
// }

// //---------------------------------------------------------------------
// //styled

// const NoResult = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   width: 100% !important;
//   margin-top: 114.9px;

//   padding-top: 67.4px;
//   background: url(${NoResultIcon}) no-repeat center top;
//   background-size: 81.4px 67.4px !important;

//   & > span {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     width: 282px;
//     height: 26px;
//     font-size: 14px;
//     font-weight: 400;
//     letter-spacing: -0.6px;
//     color: #757575;
//     font-weight: 600;
//     transform: skew(-0.03deg);
//     :nth-child(1) {
//       margin-top: 10px;
//     }
//     &.line {
//       margin-top: -4px;
//     }
//   }

//   &.no-top {
//     margin-top: 20px;
//   }
// `
