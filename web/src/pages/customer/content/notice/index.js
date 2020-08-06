/**
 * @file notice.js
 * @brief 고객센터 공지사항 컨텐츠
 *
 */
import React, {useState, useContext, useEffect} from 'react'
import {Switch, Route} from 'react-router-dom'
import {useParams} from 'react-router-dom'
//context
import {Store} from '../index'
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import {useHistory} from 'react-router-dom'
//styled component
import styled from 'styled-components'
import NewIcon from '../static/ic_new.svg'
//ui
import SelectBoxs from 'components/ui/selectBox.js'
//scss

import Detail from './detail'
import List from './list'

// //components
// let timer
// let currentPage = 1
// let moreState = false
// ////////////////////////////////////////////////////////////////////////////////////
// function Notice(props) {
//   //context
//   let {memNo, num} = useParams()
//   const context = useContext(Context)
//   const history = useHistory()

//   //notice state
//   const [noticeList, setNoticeList] = useState([])
//   const [noticeDetail, setNoticeDetail] = useState([])
//   const [noticeNum, setNoticeNum] = useState(0)
//   const [listPage, setListPage] = useState([])
//   const [nextListPage, setNextListPage] = useState([])

//   const details = Store().noticePage.noticeIdx
//   //----------------------------------------------------------

//   //
//   //api----공지사항리스트
//   async function fetchData(next) {
//     currentPage = next ? ++currentPage : currentPage
//     const res = await Api.notice_list({
//       params: {
//         noticeType: noticeNum,
//         page: currentPage,
//         records: 20
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
//   async function fetchDataDetail() {
//     const res = await Api.notice_list_detail({
//       params: {
//         noticeIdx: details
//       }
//     })
//     if (res.result === 'success') {
//       setNoticeDetail(res.data)
//     } else if (res.result === 'fail') {
//     }
//   }
//   //function---------------------------------------
//   const GoNotice = () => {
//     Store().action.updatenoticePage('')
//   }

//   const NoticeUrl = () => {
//     const index = Store().noticePage.noticeIdx

//     if (index !== '') {
//       history.push(`/customer/notice/${index}`)

//       fetchDataDetail()
//     }
//   }

//   //date format
//   const timeFormat = strFormatFromServer => {
//     let date = strFormatFromServer.slice(0, 8)
//     date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join('.')
//     let time = strFormatFromServer.slice(8)
//     time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(':')
//     return `${date} ${time}`
//   }
//   const detailDate = () => {
//     if (noticeDetail.writeDt !== undefined) {
//       timeFormat(noticeDetail.writeDt)
//       return timeFormat(noticeDetail.writeDt)
//     }
//   }
//   detailDate()
//   //--------------------------------------------------------
//   useEffect(() => {
//     currentPage = 1
//     fetchData()
//   }, [noticeNum])
//   //--------------------------------------------------------
//   useEffect(() => {
//     if (Store().noticePage !== '') {
//       NoticeUrl()
//     }
//   }, [Store().noticePage])

//   const timestamp = String(new Date().getTime()).substr(0, 10)
//   const IntTime = parseInt(timestamp)

//   useEffect(() => {
//     async function fetchDataDetail() {
//       const res = await Api.notice_list_detail({
//         params: {
//           noticeIdx: num
//         }
//       })
//       if (res.result === 'success') {
//         setNoticeDetail(res.data)

//         Store().action.updatenoticePage(num)
//         setTimeout(() => {
//           history.push(`/customer/notice/${num}`)
//         }, 10)
//       } else if (res.result === 'fail') {
//       }
//     }

//     fetchDataDetail()
//   }, [context.noticeIndexNum])

//   ////////////////////////////////
//   // useEffect(() => {
//   //   if (Store().noticePage !== undefined) {
//   //     window.onpopstate = e => {
//   //       window.history.back()
//   //     }
//   //   }
//   // }, [])
//   useEffect(() => {
//     if (history.location.pathname.split('/')[4] === 'undefined') {
//       history.push(`/customer`)
//     }
//   }, [Store().noticePage])

//   const showMoreList = () => {
//     if (moreState) {
//       setListPage(listPage.concat(nextListPage))
//       fetchData('next')
//     }
//   }

//   //----------------------------------------------------------
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

//   //--------------------------------------------------------
//   return (
//     <>
//       <div className='noticeList'>
//         {/* 컨텐츠 : 게시판 스타일 */}
//         {/* <ContentInfo>
//           <h2>
//             {noticeNum === 0 ? '전체' : ''}
//             {noticeNum === 1 ? '공지사항' : ''}
//             {noticeNum === 2 ? '이벤트' : ''}
//           </h2>
//           <h3>{noticeList.length}</h3>
//           <div className="category">
//             <button onClick={typeActive} value="0" className={noticeNum === 0 ? 'on' : ''}>
//               전체
//             </button>
//             <button onClick={typeActive} value="1" className={noticeNum === 1 ? 'on' : ''}>
//               공지사항
//             </button>
//             <button onClick={typeActive} value="2" className={noticeNum === 2 ? 'on' : ''}>
//               이벤트
//             </button>
//           </div>
//           <div className="m-catecory">
//             <SelectBoxs boxList={selectBoxData} onChangeEvent={setType} inlineStyling={{right: 0, top: 0, zIndex: 8}} />
//           </div>
//         </ContentInfo> */}

//         <div>
//           <dl>
//             {listPage.map((item, index) => {
//               const {noticeType, writeDt, title, noticeIdx, writeTs} = item
//               //console.log((IntTime - writeTs) / 3600)

//               if (listPage === null) return
//               return (
//                 <div key={index}>
//                   {noticeType === noticeNum && (
//                     <div className="tableWrap" onClick={() => Store().action.updatenoticePage(item)}>
//                       {/* <dt>
//                         {noticeType === 1 ? '공지사항' : ''}
//                         {noticeType === 2 ? '이벤트' : ''}
//                       </dt> */}
//                       <dd>
//                         {(IntTime - writeTs) / 3600 < 3 && <em></em>}
//                         {noticeType !== 0 && (
//                           <span>
//                             {noticeType === 1 ? '공지사항 ' : ''}
//                             {noticeType === 2 ? '이벤트 ' : ''}
//                             {noticeType === 3 ? '정기정검 ' : ''}
//                             {noticeType === 4 ? '업데이트 ' : ''}
//                             {noticeType === 5 ? '언론보도 ' : ''}
//                           </span>
//                         )}

//                         <em></em>
//                         {title}
//                       </dd>
//                       <dd>{timeFormat(writeDt)}</dd>
//                     </div>
//                   )}
//                   {noticeNum === 0 && (
//                     <div className="tableWrap" onClick={() => Store().action.updatenoticePage(item)}>
//                       {/* <dt>
//                         {noticeType === 1 ? '공지사항' : ''}
//                         {noticeType === 2 ? '이벤트' : ''}
//                       </dt> */}
//                       <dd>
//                         {(IntTime - writeTs) / 3600 < 3 && <em></em>}
//                         {noticeType !== 0 && (
//                           <span>
//                             {noticeType === 1 ? '공지사항 ' : ''}
//                             {noticeType === 2 ? '이벤트 ' : ''}
//                             {noticeType === 3 ? '정기정검 ' : ''}
//                             {noticeType === 4 ? '업데이트 ' : ''}
//                             {noticeType === 5 ? '언론보도 ' : ''}
//                           </span>
//                         )}
//                         {title}
//                       </dd>
//                       <dd>{timeFormat(writeDt)}</dd>
//                     </div>
//                   )}
//                 </div>
//               )
//             })}
//           </dl>
//         </div>
//         {/* 페이지네이션 */}
//         {/* <PageNumber>
//           <button onClick={() => (page > 1 ? setPage(page - 1) : null)} className="prev" />
//           {numberPages.map((item, index) => {
//             return (
//               <button onClick={() => setPage(item + 1)} className={page === item + 1 ? 'on' : ''} key={index}>
//                 {item + 1}
//               </button>
//             )
//           })}
//           <button onClick={() => (page + 1 <= numberPages.length ? setPage(page + 1) : null)} className="next" />
//         </PageNumber> */}
//       </div>
//       <div className="detail">
//       <header onClick={GoNotice}>
//         <span>{noticeDetail.title}</span>
//         <span>{detailDate()}</span>
//       </header>
//       <div>
//         <p dangerouslySetInnerHTML={{__html: noticeDetail.contents}}></p>
//       </div>
//       <button onClick={GoNotice}>목록보기</button>
//     </div>
//     </>
//   )
// }
// export default Notice

export default function Notice() {
  return (
    <Switch>
      <Route path="/customer/notice" exact component={List}></Route>
      <Route path="/customer/notice/:number" exact component={Detail}></Route>
    </Switch>
  )
}
