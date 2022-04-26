// /**
//  * @file notice.js
//  * @brief 고객센터 공지사항 컨텐츠
//  *
//  */
// import React, {useState, useContext, useEffect} from 'react'
// //context
// import {Store} from './index'
// import Api from 'context/api'
// import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
// import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
// //styled component
// import styled from 'styled-components'
// //----------------------------------------------------------

// let timer
// let currentPage = 1
// let moreState = false

// function Faq(props) {
//   //context
//   const context = useContext(Context)
//   //faq state
//   const [faqList, setFaqList] = useState([])
//   const [faqDetail, setFaqDetail] = useState([])
//   const [faqNum, setfaqNum] = useState(0)
//   const [listhide, SetListhide] = useState('')

//   const [listPage, setListPage] = useState([])
//   const [nextListPage, setNextListPage] = useState([])

//   const details = Store().faqPage

//   //api----faq리스트
//   async function fetchData(next) {
//     currentPage = next ? ++currentPage : currentPage
//     const res = await Api.faq_list({
//       params: {
//         faqType: faqNum,
//         page: currentPage,
//         records: 15
//       }
//     })
//     if (res.result === 'success') {
//       //setNoticeList(res.data.list)
//       if (res.code === '0') {
//         //if (!next) setListPage(0)
//         moreState = false
//       } else {
//         if (next) {
//           setNextListPage(res.data.list)
//           moreState = true
//         } else {
//           setListPage(res.data.list)
//           fetchData('next')
//         }
//       }
//     } else if (res.result === 'fail') {
//     }
//   }
//   //api----디테일스
//   async function fetchData2() {
//     const res = await Api.faq_list_detail({
//       params: {
//         faqIdx: details
//       }
//     })
//     if (res.result === 'success') {
//       //console.log(res.data)
//       setFaqDetail(res.data)
//     } else if (res.result === 'fail') {
//       console.log(res)
//     }
//   }
//   //function---------------------------------------
//   /**
//    *
//    * @func 토글 패치
//    */
//   const FaqToggle = () => {
//     fetchData2()
//   }

//   /**
//    *
//    * @func 클릭 조건 실행
//    */
//   //const [reset, setReset] = useState(true)
//   const clickEvent = faqIdx => {
//     Store().action.updatefaqPage(faqIdx)
//     SetListhide(faqIdx)

//     if (Store().faqPage === faqIdx && listhide !== '') {
//       Store().action.updatefaqPage('')
//       SetListhide('')
//     }
//   }
//   //--------------------------------------------------------
//   useEffect(() => {
//     currentPage = 1
//     fetchData()
//   }, [faqNum])
//   //--------------------------------------------------------
//   useEffect(() => {
//     if (Store().faqPage !== '') {
//       FaqToggle()
//     }
//   }, [Store().faqPage])
//   //--------------------------------------------------------

//   const showMoreList = () => {
//     if (moreState) {
//       setListPage(listPage.concat(nextListPage))
//       fetchData('next')
//     }
//   }

//   const scrollEvtHdr = event => {
//     if (timer) window.clearTimeout(timer)
//     timer = window.setTimeout(function() {
//       //스크롤
//       const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
//       const body = document.body
//       const html = document.documentElement
//       const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
//       const windowBottom = windowHeight + window.pageYOffset
//       //스크롤이벤트체크
//       /*
//        * @가속처리
//        */
//       if (windowBottom >= docHeight - 200) {
//         showMoreList()
//       } else {
//       }
//     }, 10)
//   }
//   useEffect(() => {
//     //reload
//     window.addEventListener('scroll', scrollEvtHdr)
//     return () => {
//       window.removeEventListener('scroll', scrollEvtHdr)
//     }
//   }, [nextListPage])

//   //
//   const clickFocus = index => {
//     setTimeout(() => {
//       const height = document.querySelector(`.idx${index}`).offsetTop - 60
//       window.scrollTo(0, height)
//     }, 10)
//   }
//   return (
//     <>
//       <PageWrap>
//         <dl>
//           {listPage.map((item, index) => {
//             const {faqType, writeDt, question, faqIdx} = item

//             if (listPage === null) return
//             return (
//               <div key={index} className={`idx${index}`} onClick={() => clickFocus(index)}>
//                 {faqType === faqNum && (
//                   <>
//                     <TableWrap
//                       onClick={() => clickEvent(faqIdx)}
//                       className={Store().faqPage === faqIdx && listhide !== '' ? 'on' : ''}>
//                       <dd>
//                         <span>Q</span>
//                         <em>
//                           {faqType === 0 ? '전체' : ''}
//                           {faqType === 1 ? '일반' : ''}
//                           {faqType === 2 ? '방송' : ''}
//                           {faqType === 3 ? '결제' : ''}
//                           {faqType === 4 ? '기타' : ''}
//                         </em>
//                         {question}
//                       </dd>
//                       <dd className={Store().faqPage === faqIdx && listhide !== '' ? 'on' : ''}></dd>
//                     </TableWrap>
//                     <Detail className={Store().faqPage === faqIdx && listhide !== '' ? 'on' : ''}>
//                       <div>
//                         <span className="icon">A</span>
//                         {faqDetail.answer && (
//                           <p dangerouslySetInnerHTML={{__html: faqDetail.answer.replace(/class/gi, 'className')}}></p>
//                         )}
//                       </div>
//                     </Detail>
//                   </>
//                 )}
//                 {faqNum === 0 && (
//                   <>
//                     <TableWrap
//                       onClick={() => clickEvent(faqIdx)}
//                       className={Store().faqPage === faqIdx && listhide !== '' ? 'on' : ''}>
//                       <dd>
//                         <span>Q</span>
//                         <em>
//                           {faqType === 0 ? '전체' : ''}
//                           {faqType === 1 ? '일반' : ''}
//                           {faqType === 2 ? '방송' : ''}
//                           {faqType === 3 ? '결제' : ''}
//                           {faqType === 4 ? '기타' : ''}
//                         </em>
//                         {question}
//                       </dd>
//                       <dd className={Store().faqPage === faqIdx && listhide !== '' ? 'on' : ''}></dd>
//                     </TableWrap>
//                     <Detail className={Store().faqPage === faqIdx && listhide !== '' ? 'on' : ''}>
//                       <div>
//                         <span className="icon">A</span>
//                         {faqDetail.answer && (
//                           <p dangerouslySetInnerHTML={{__html: faqDetail.answer.replace(/class/gi, 'className')}}></p>
//                         )}
//                       </div>
//                     </Detail>
//                   </>
//                 )}
//               </div>
//             )
//           })}
//         </dl>
//       </PageWrap>

//       {/* 컨텐츠 : 클릭 디테일 */}
//     </>
//   )
// }
// export default Faq
// //styled------------------------------------------------------------------------------------------------------------------
// const Detail = styled.section`
//   opacity: 0;
//   height: 0;
//   overflow: hidden;
//   padding: 0;
//   & > div {
//     display: flex;
//     font-size: 14px;
//     color: #424242;
//     transform: skew(-0.03deg);

//     & .icon {
//       display: inline-block;
//       margin-right: 4px;
//       width: 16px;
//       height: 16px;
//       line-height: 16px;
//       background-color: #ec455f;
//       color: #fff;
//       text-align: center;
//       border-radius: 50%;
//       @media (max-width: ${WIDTH_MOBILE}) {
//         margin-right: 6px;
//       }
//     }
//     & p {
//       width: calc(100% - 44px);
//       @media (max-width: ${WIDTH_MOBILE}) {
//         width: 92%;
//       }
//     }
//   }
//   &.on {
//     opacity: 1;
//     height: auto;
//     padding: 30px 0 30px 120px;
//     transition: padding-top 0.2s ease-in-out;
//     @media (max-width: ${WIDTH_MOBILE}) {
//       padding: 10px 0;
//     }
//   }
// `

// const PageWrap = styled.div`
//   & dl {
//     width: 100%;
//   }
// `
// const PageNumber = styled.nav`
//   display: flex;
//   justify-content: center;
//   margin: 20px 0 100px 0;
//   & > button {
//     display: block;
//     width: 36px;
//     height: 36px;
//     margin-right: 8px;
//     border: solid 1px #e0e0e0;
//     border-radius: 8px;
//     color: #e0e0e0;
//     font-size: 14px;
//     transform: skew(-0.03deg);
//     &.on {
//       background-color: ${COLOR_MAIN};
//       border: solid 1px ${COLOR_MAIN};
//       color: #fff;
//     }
//     &.next {
//       border: none;
//       background: url(${IMG_SERVER}/images/api/Layer.png) no-repeat center center / 8.9px 17.7px;
//     }
//     &.prev {
//       border: none;
//       background: url(${IMG_SERVER}/images/api/Layerleft.png) no-repeat center center / 8.9px 17.7px;
//     }
//   }
// `

// const TableWrap = styled.div`
//   display: flex;
//   border-bottom: 1px solid #e0e0e0;
//   padding: 10px 0;
//   cursor: pointer;
//   @media (max-width: ${WIDTH_MOBILE}) {
//     position: relative;
//     flex-wrap: wrap;
//   }
//   & dt {
//     width: 120px;
//     color: ${COLOR_MAIN};
//     font-size: 12px;
//     transform: skew(-0.03deg);
//     @media (max-width: ${WIDTH_MOBILE}) {
//       width: 100%;
//     }
//   }
//   & dd {
//     position: relative;
//     width: calc(100% - 144px);
//     font-size: 16px;
//     color: #000;
//     font-weight: 600;
//     transform: skew(-0.03deg);

//     @media (max-width: ${WIDTH_MOBILE}) {
//       width: 92%;
//       margin: 4px 0 2px 0;
//       line-height: 1.4;
//     }
//   }
//   & dd:first-child {
//     padding-left: 56px;
//   }
//   & dd:last-child {
//     width: 24px;
//     height: 24px;
//     background: url(${IMG_SERVER}/images/api/ico-prevmy.png) no-repeat center center/cover;
//     &.on {
//       background: url(${IMG_SERVER}/images/api/ico-selectup-g.png) no-repeat center center / 17px 9px;
//     }

//     @media (max-width: ${WIDTH_MOBILE}) {
//       position: absolute;
//       right: 0;
//       top: 50%;
//       transform: translateY(-50%);
//     }
//   }
//   & span {
//     display: inline-block;
//     position: absolute;
//     left: 0;
//     top: 3px;
//     margin-right: 4px;
//     width: 16px;
//     height: 16px;
//     line-height: 16px;
//     font-size: 13px;
//     background-color: ${COLOR_MAIN};
//     color: #fff;
//     text-align: center;
//     border-radius: 50%;
//     font-weight: 400;
//     @media (max-width: ${WIDTH_MOBILE}) {
//       margin-right: 3px;
//     }
//   }
//   & em {
//     position: absolute;
//     left: 20px;
//     top: 0;
//     margin-right: 3px;
//     color: ${COLOR_MAIN};
//     font-style: normal;
//   }
//   &.on {
//     border-bottom: none;
//   }
// `

// const ContentInfo = styled.div`
//   margin-top: 40px;
//   position: relative;
//   &:after {
//     content: '';
//     clear: both;
//     display: block;
//   }
//   & h2 {
//     display: inline-block;
//     font-size: 20px;
//     color: ${COLOR_MAIN};
//     line-height: 42px;
//   }
//   & h3 {
//     display: inline-block;
//     font-size: 20px;
//     color: #757575;
//     margin-left: 10px;
//   }
//   & .category {
//     display: block;
//     float: right;
//     @media (max-width: ${WIDTH_MOBILE}) {
//       display: none;
//     }
//     & button {
//       padding: 11px 20px;
//       margin-right: 4px;
//       border-radius: 20px;
//       border: 1px solid #e0e0e0;
//       &.on {
//         color: ${COLOR_MAIN};
//         border: 1px solid ${COLOR_MAIN};
//       }
//     }
//   }
//   & .m-catecory {
//     @media (max-width: ${WIDTH_MOBILE}) {
//       display: block;
//     }
//   }
// `
