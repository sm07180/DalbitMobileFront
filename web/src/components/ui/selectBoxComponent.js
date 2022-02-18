// import React from 'react'
// import styled from 'styled-components'

// const list = []

// export default function SelectBoxComponent(props) {
//   const {state, dispatch, linked} = props

//   const handleClick = (idx) => {
//     dispatch({type: 'open'})
//     dispatch({type: 'select', idx: idx})
//     if (linked && linked.use === true) {
//       linked.dispatch({type: linked.type, idx: idx})
//     }
//   }

//   return (
//     <SelectBoxWrap>
//       <Selected className={`options ${state.isOpen ? 'open' : 'close'}`} onClick={() => dispatch({type: 'open'})}>
//         {state.boxList[state.selectIdx || 0].text}
//       </Selected>
//       <SelectListWrap className={`${state.isOpen ? 'open' : 'close'}`}>
//         {state.boxList.map((item, index) => {
//           return (
//             <div className="box-list" key={index} onClick={() => handleClick(index)}>
//               {item.text}
//             </div>
//           )
//         })}
//       </SelectListWrap>
//     </SelectBoxWrap>
//   )
// }

// const SelectListWrap = styled.div`
//   border: 1px solid #FF3C7B;
//   border-top: none;
//   /* animation-duration: 0.1s;
//   animation-iteration-count: 1;
//   animation-fill-mode: forwards;
//   animation-timing-function: ease-in; */

//   &.open {
//     margin-top: -1px;
//     opacity: 1;
//     transform: translateY(0);
//   }

//   &.close {
//     opacity: 0;
//     height: 0;
//     transform: translateY(-10px);
//     transform: scale(0);
//   }

//   &.init {
//     display: none;
//   }

//   .box-list {
//     padding: 11px 10px;
//     color: #424242;
//     font-size: 16px;
//     background-color: #fff;
//     box-sizing: border-box;
//     transform: skew(-0.03deg);
//     letter-spacing: -0.5px;
//     &:hover {
//       color: #FF3C7B;
//       background-color: #f8f8f8;
//     }
//   }
// `

// const Selected = styled.div`
//   position: relative;
//   width: 136px;

//   box-sizing: border-box;
//   border: 1px solid #FF3C7B;
//   font-size: 16px;
//   color: #FF3C7B;
//   outline: none;
//   letter-spacing: -0.5px;
//   line-height: 36px;
//   height: 36px;
//   padding-left: 10px;
//   &.open {
//     &::before {
//       transform: rotate(135deg);
//     }
//     &::after {
//       transform: rotate(-135deg);
//     }
//   }

//   &::before {
//     position: absolute;
//     content: '';
//     width: 12px;
//     height: 2px;
//     top: 16px;
//     right: 20px;
//     background-color: #FF3C7B;
//     transform: rotate(45deg);
//     transition-property: transform;
//     /* transition-duration: 0.1s;
//     transition-timing-function: ease-in; */
//   }

//   &::after {
//     position: absolute;
//     content: '';
//     width: 12px;
//     height: 2px;
//     top: 16px;
//     right: 12px;
//     background-color: #FF3C7B;
//     transform: rotate(-45deg);
//     transition-property: transform;
//     /* transition-duration: 0.1s;
//     transition-timing-function: ease-in; */
//   }
// `

// const SelectBoxWrap = styled.div`
//   position: absolute;
//   cursor: pointer;
//   user-select: none;
//   -webkit-tap-highlight-color: transparent;
// `
