import React, {useEffect, useContext, useState} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import Room, {RoomJoin} from 'context/room'
import DalbitCheckbox from 'components/ui/dalbit_checkbox'

import './index.scss'
const currentDate = new Date()
export default function Alert() {
  const [alarmList, setAlarmList] = useState([])
  const [allCheck, setAllCheck] = useState(false)

  const handleClick = (something) => {
    const {notiType, contents, memNo, roomNo, regDt, regTs, profImg, link} = something
    console.log(something)
    switch (notiType) {
      case 1:
        RoomJoin(roomNo + '')
        break
      case 2:
        window.location.href = '/'
        break
      case 5:
        window.location.href = '/'
        break
      case 6:
        break
      case 7:
        window.location.href = `/customer/notice/${roomNo}`
        break
      case 31:
        window.location.href = `/mypage/${memNo}/fanboard`
        break
      case 32:
        window.location.href = `/mypage/${memNo}/wallet`
        break
      case 33:
        break
      case 35:
        window.location.href = '/menu/profile'
        break
      case 36:
        window.location.href = `/mypage/${memNo}`
        break
      case 37:
        window.location.href = '/customer/personal/qnaList'
        break
      case 38:
        window.location.href = `/mypage/${memNo}/notice`
        break
      case 50:
        let mobileLink = link
        try {
          mobileLink = JSON.parse(mobileLink).mobile
        } catch (e) {}
        if (mobileLink !== undefined) window.location.href = mobileLink
      default:
        break
    }
  }

  const convertDate = (something) => {
    if (!something) return ''
    // 공백제거
    something = something.replace(/\s/gi, '')
    const year = something.substr(0, 4)
    const month = something.substr(4, 2)
    const days = something.substr(6, 2)
    const timeForm = something.substr(8, 4)

    if (
      currentDate.getFullYear() === parseInt(year) &&
      currentDate.getMonth() + 1 === parseInt(month) &&
      currentDate.getDate() === parseInt(days)
    ) {
      return timeForm.substr(0, 2) + ':' + timeForm.substr(2, 4)
    } else {
      return year + '.' + month + '.' + days + '  ' + timeForm.substr(0, 2) + ':' + timeForm.substr(2, 4)
    }
  }

  useEffect(() => {
    async function fetchData() {
      const res = await Api.my_notification({
        params: {
          page: 1,
          records: 1000
        }
      })
      console.log(res.data.list)
      if (res.result === 'success') {
        setAlarmList(
          res.data.list.map((v) => {
            v.check = false
            return v
          })
        )
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const a = alarmList.filter((v) => {
      return !v.check
    })

    if (a.length === 0) {
      if (alarmList.length === 0) {
        setAllCheck(false)
      } else {
        setAllCheck(true)
      }
    } else {
      setAllCheck(false)
    }
  }, [alarmList])

  return (
    <div id="alarmWrap">
      <div className="header">
        <div className="header__left">
          <div>알림</div>
          {alarmList.length > 0 && <div className="header__count">{alarmList.length}</div>}
        </div>
        <div className="header__right">
          <div className="deleteIcon"></div>
          <div className="allCheck">
            <DalbitCheckbox
              status={allCheck}
              callback={(e) => {
                setAlarmList(
                  alarmList.map((v) => {
                    v.check = !allCheck
                    return v
                  })
                )
              }}
            />
          </div>
        </div>
      </div>
      <div className="contents">
        {alarmList.length > 0 &&
          alarmList.map((v, idx) => {
            return (
              <div key={idx} className="contents__list" onClick={() => handleClick(v)}>
                <div className="contents__list--img">
                  <img src={v.profImg.url} />
                </div>
                <div className="contents__list--text">
                  <div className="contents__list--title" dangerouslySetInnerHTML={{__html: v.contents}}></div>
                  <div className="contents__list--time">{convertDate(v.regDt)}</div>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                  }}>
                  <DalbitCheckbox
                    status={v.check}
                    callback={() => {
                      setAlarmList(
                        alarmList.map((v2, idx2) => {
                          if (idx === idx2) {
                            v2.check = !v2.check
                          }
                          return v2
                        })
                      )
                    }}
                  />
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

// /**
//  * @title 알림사항
//  */
// import React, {useEffect, useContext, useState} from 'react'
// import styled from 'styled-components'
// import {Link} from 'react-router-dom'
// //context
// import Api from 'context/api'
// import {COLOR_MAIN} from 'context/color'
// import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_MOBILE_S} from 'context/config'
// import {Context} from 'context'
// import Utility from 'components/lib/utility'
// //room
// import Room, {RoomJoin} from 'context/room'
// // component
// import Header from '../component/header.js'
// import NoResult from 'components/ui/noResult'
// //static
// import NeedLoginImg from '../static/profile/need_login.png'
// //icon
// import userIco from 'pages/mypage/component/images/ic_user_normal.svg'
// import moonIco from 'pages/mypage/component/images/ico_moon_s.svg'
// import alarmIco from 'pages/mypage/component/images/ic_alarm.svg'

// let currentPage = 1

// export default (props) => {
//   //---------------------------------------------------------------------
//   //let
//   let timer

//   //context
//   const globalCtx = useContext(Context)
//   const {profile} = globalCtx
//   const {isLogin} = globalCtx.token
//   const myMemNo = isLogin ? globalCtx.profile.memNo : null

//   //useState
//   const [fetch, setFetch] = useState(null)

//   const [listState, setListState] = useState(-1)
//   const [alertList, setAlertList] = useState(false)
//   const [nextList, setNextList] = useState(false)
//   const [moreState, setMoreState] = useState(false)

//   //let
//   let clicked = false

//   //---------------------------------------------------------------------
//   async function getAlertList(next) {
//     currentPage = next ? ++currentPage : currentPage
//     const res = await Api.my_notification({
//       params: {
//         page: currentPage,
//         records: 20
//       }
//     })
//     if (res.result == 'success' && _.hasIn(res, 'data.list')) {
//       if (res.data.list == false) {
//         if (!next) {
//           setAlertList(false)
//           setListState(0)
//         }
//         setMoreState(false)
//       } else {
//         if (next) {
//           setMoreState(true)
//           setNextList(res.data.list)
//         } else {
//           setAlertList(res.data.list)
//           getAlertList('next')
//         }
//         setListState(1)
//       }
//     } else {
//       context.action.alert({
//         msg: res.message
//       })
//     }
//   }

//   const showMoreList = () => {
//     setAlertList(alertList.concat(nextList))
//     getAlertList('next')
//   }

//   const createAlertList = () => {
//     if (alertList == false) return null
//     return (
//       <>
//         <ul className="alert-list">
//           {alertList.map((item, index) => {
//             const {notiType, contents, memNo, roomNo, regDt, regTs, profImg, link} = item
//             const textArea = (
//               <div>
//                 <div dangerouslySetInnerHTML={{__html: contents}}></div>
//                 <span>{Utility.settingAlarmTime(regTs)}</span>
//               </div>
//             )
//             /**
//                  1 : 방송방 [room_no]
//                  2 : 메인
//                  4 : 등록 된 캐스트
//                  5 : 스페셜 DJ 선정 페이지
//                  6 : 이벤트 페이지>해당 이벤트 [board_idx]
//                  7 : 공지사항 페이지 [board_idx]
//                  31 : 마이페이지>팬 보드
//                  32 : 마이페이지>내 지갑
//                  33 : 마이페이지>캐스트>캐스트 정보 변경 페이지
//                  34 : 마이페이지>알림>해당 알림 글
//                  35 : 마이페이지
//                  36 : 레벨 업 DJ 마이페이지 [mem_no]
//                  37 : 1:1 문의 답변
//                  38 : 방송공지
//                  50 : URL 링크이동
//                * */
//             switch (notiType) {
//               case 1: //방송방 알림
//                 return (
//                   <li
//                     key={index}
//                     onClick={() => {
//                       if (clicked) return
//                       clicked = true
//                       RoomJoin(roomNo + '', () => {
//                         clicked = false
//                       })
//                     }}>
//                     <figure
//                       style={{
//                         background: `url(${profImg.thumb80x80}) no-repeat center center/ cover`
//                       }}></figure>
//                     {textArea}
//                   </li>
//                 )
//                 break
//               case 2: // 메인 이동
//                   let icon = (
//                       <figure style={{background: `url(${profImg.thumb80x80}) no-repeat center center/ cover`}}></figure>
//                   )
//                   if(memNo == '10000000000001'){
//                     icon = (
//                         <figure>
//                             <img src={alarmIco} />
//                         </figure>
//                     )
//                   }

//                 return (
//                     <li
//                         key={index}
//                         onClick={() => {
//                             window.location.href = `/`
//                         }}>
//                         {icon}
//                         {textArea}
//                     </li>
//                 )
//                 break
//               case 5: // 스페셜 dj선정
//                 return (
//                   <li
//                     key={index}
//                     onClick={() => {
//                       window.location.href = `/`
//                     }}>
//                     <figure>
//                       <img src={alarmIco} />
//                     </figure>
//                     {textArea}
//                   </li>
//                 )
//                 break
//               case 6: // 이벤트 페이지
//                 return (
//                   <li
//                     key={index}
//                     // onClick={() => {
//                     //   window.location.href = `/customer/notice`
//                     // }}
//                   >
//                     <figure>
//                       <img src={alarmIco} />
//                     </figure>
//                     {textArea}
//                   </li>
//                 )
//                 break
//               case 7: // 공지사항
//                 return (
//                   <li
//                     key={index}
//                     onClick={() => {
//                       window.location.href = `/customer/notice/${roomNo}`
//                     }}>
//                     <figure>
//                       <img src={alarmIco} />
//                     </figure>
//                     {textArea}
//                   </li>
//                 )
//                 break
//               case 31: //팬보드 알림
//                 return (
//                   <li
//                     key={index}
//                     onClick={() => {
//                       window.location.href = `/mypage/${memNo}/fanboard`
//                     }}>
//                     <figure
//                       style={{
//                         background: `url(${profImg.thumb80x80}) no-repeat center center/ cover`
//                       }}></figure>
//                     {textArea}
//                   </li>
//                 )
//                 break
//               case 32: //달 알림//완료
//                 return (
//                   <li
//                     key={index}
//                     onClick={() => {
//                       window.location.href = `/mypage/${memNo}/wallet`
//                     }}>
//                     <figure
//                       style={{
//                         background: `url(${profImg.thumb80x80}) no-repeat center center/ cover`
//                       }}></figure>
//                     {textArea}
//                   </li>
//                 )
//                 break
//               case 33: //캐스트 알림// (미정)
//                 return (
//                   <li key={index}>
//                     <figure>
//                       <img src={alarmIco} />
//                     </figure>
//                     {textArea}
//                   </li>
//                 )
//                 break
//               case 35: // 팬 등록
//                 return (
//                   <li
//                     key={index}
//                     onClick={() => {
//                       // window.location.href = `/mypage/${memNo}`
//                       window.location.href = `/menu/profile`
//                     }}>
//                     {/* <figure>
//                       <img src={alarmIco} />
//                     </figure> */}
//                     <figure
//                       style={{
//                         background: `url(${profImg.thumb80x80}) no-repeat center center/ cover`
//                       }}></figure>
//                     {textArea}
//                   </li>
//                 )
//                 break
//               case 36: //DJ 레벨업(팬)
//                 return (
//                   <li
//                     key={index}
//                     onClick={() => {
//                       window.location.href = `/mypage/${memNo}`
//                     }}>
//                     <figure
//                       style={{
//                         background: `url(${profImg.thumb80x80}) no-repeat center center/ cover`
//                       }}></figure>
//                     {textArea}
//                   </li>
//                 )
//                 break
//               case 37: // 1:1 문의 답변
//                 return (
//                   <li
//                     key={index}
//                     onClick={() => {
//                       window.location.href = `/customer/personal/qnaList`
//                     }}>
//                     <figure>
//                       <img src={alarmIco} />
//                     </figure>
//                     {textArea}
//                   </li>
//                 )
//                 break
//               case 38: //방송공지 상대방//
//                 return (
//                   <li
//                     key={index}
//                     onClick={() => {
//                       window.location.href = `/mypage/${memNo}/notice`
//                     }}>
//                     <figure style={{background: `url(${profImg.thumb80x80}) no-repeat center center/ cover`}}></figure>
//                     {textArea}
//                   </li>
//                 )
//                 break
//                case 50: //직접 입력//
//                  let mobileLink = link
//                  try {
//                      mobileLink = JSON.parse(mobileLink).mobile
//                  }catch(e){}

//                  return (
//                      <li
//                          key={index}
//                          onClick={() => {
//                              if(mobileLink != undefined) {
//                                  window.location.href = mobileLink
//                              }
//                          }}>
//                          <figure>
//                              <img src={alarmIco} />
//                          </figure>
//                          {textArea}
//                      </li>
//                  )
//                  break
//               default:
//                 return (
//                   <li key={index}>
//                     <figure>
//                       <img src={alarmIco} />
//                     </figure>
//                     {textArea}
//                   </li>
//                 )
//                 break
//             }
//           })}
//         </ul>
//       </>
//     )
//   }

//   const createAlertResult = () => {
//     if (listState === -1) {
//       return null
//     } else if (listState === 0) {
//       return <NoResult className="mobile" text="알람이 없습니다." />
//     } else {
//       return createAlertList()
//     }
//   }

//   //---------------------------------------------------------------------
//   //checkScroll
//   const scrollEvtHdr = (event) => {
//     if (timer) window.clearTimeout(timer)
//     timer = window.setTimeout(function () {
//       //스크롤
//       const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
//       const body = document.body
//       const html = document.documentElement
//       const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
//       const windowBottom = windowHeight + window.pageYOffset
//       //스크롤이벤트체크
//       if (windowBottom >= docHeight - 30) {
//         showMoreList()
//       } else {
//       }
//     }, 50)
//   }
//   //---------------------------------------------------------------------

//   //useEffect
//   useEffect(() => {
//     //reload
//     window.addEventListener('scroll', scrollEvtHdr)
//     return () => {
//       window.removeEventListener('scroll', scrollEvtHdr)
//     }
//   }, [nextList])

//   //useEffect
//   useEffect(() => {
//     getAlertList()
//     return () => {
//       currentPage = 1
//     }
//   }, [])
//   //---------------------------------------------------------------------

//   return (
//     <Wrap>
//       <Header>
//         <div className="category-text">알림사항</div>
//       </Header>
//       <Content>
//         {isLogin ? (
//           <>
//             {createAlertResult()}
//             <Room />
//           </>
//         ) : (
//           <div className="log-out">
//             <a href="/login">
//               <img src={NeedLoginImg} />

//               <button className="loginBtn">로그인</button>

//               <div className="text">
//                 <span className="bold">로그인</span> 해주세요
//               </div>
//             </a>
//           </div>
//         )}
//       </Content>
//     </Wrap>
//   )
// }
// //---------------------------------------------------------------------
// //styled
// const Content = styled.div`
//   display: block;
//   margin-top: 20px;

//   .log-out {
//     padding-top: 30px;
//     box-sizing: border-box;

//     img {
//       display: block;
//       margin: 0 auto;
//       width: 100px;
//     }
//     .text {
//       margin-top: 10px;
//       color: #424242;
//       font-size: 20px;
//       text-align: center;
//       letter-spacing: -0.8px;

//       .bold {
//         color: #632beb;
//         font-weight: 800;
//       }
//     }

//     .loginBtn {
//       display: block;
//       width: 288px;
//       height: 50px;
//       margin: 16px auto;
//       background: #632beb;
//       font-size: 18px;
//       font-weight: 600;
//       color: #fff;
//       border-radius: 10px;
//       transform: skew(-0.03deg);
//     }
//   }

//   .alert-list {
//     li {
//       display: flex;
//       margin: 20px 0;
//       figure {
//         flex-basis: 36px;
//         margin-right: 10px;
//         height: 36px;
//         line-height: 34px;
//         border-radius: 50%;
//         background: #f6f6f6;
//         text-align: center;
//         img {
//           vertical-align: middle;
//         }
//       }
//       >div {
//         width: calc(100% - 46px);
//         color: #424242;
//         font-size: 14px;
//         line-height: 18px;
//         font-weight:600;
//         transform: skew(-0.03deg);
//         span {
//           display: block;
//           color: #bdbdbd;
//           font-size: 12px;
//         }
//       }
//     }
//   }
//   .more-btn-wrap {
//     position: relative;
//     &:before {
//       display: block;
//       position: absolute;
//       left: calc(50% - 63px);
//       width: 126px;
//       height: 48px;
//       background: #fff;
//       content: '';
//       z-index: 1;
//     }
//     &:after {
//       position: absolute;
//       right: 0;
//       top: 23px;
//       width: 100%;
//       height: 1px;
//       background: #e0e0e0;
//       content: '';
//     }
//   }
//   .more-btn {
//     display: block;
//     position: relative;
//     width: 113px;
//     margin: 40px auto;
//     /* padding-right: 28px; */
//     border: 1px solid #e0e0e0;
//     border-radius: 46px;
//     background: #fff;
//     color: #616161;
//     font-size: 14px;
//     line-height: 46px;
//     z-index: 1;
//     /* &:after {
//       display: block;
//       position: absolute;
//       right: 24px;
//       top: 11px;
//       width: 12px;
//       height: 12px;
//       border-left: 2px solid ${COLOR_MAIN};
//       border-top: 2px solid ${COLOR_MAIN};
//       transform: rotate(-135deg);
//       content: '';
//     } */
//   }
// `
// const Wrap = styled.div`
//   padding: 0 16px;
//   background-color: #fff;
// `
