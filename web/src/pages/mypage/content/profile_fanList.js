import React, {useEffect, useState, useContext, useRef} from 'react'
import qs from 'query-string'
//styled
import styled from 'styled-components'
//context
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import {COLOR_MAIN} from 'context/color'
import Api from 'context/api'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
//scroll
import {Scrollbars} from 'react-custom-scrollbars'
import CloseBtn from '../../menu/static/ic_closeBtn.svg'

export default (props) => {
  console.log(props)
  const {webview} = qs.parse(location.search)
  const {name} = props
  //context------------------------------------------
  const context = useContext(Context)
  const ctx = useContext(Context)
  let history = useHistory()
  //pathname
  const urlrStr = props.location.pathname.split('/')[2]
  const {profile} = props
  const myProfileNo = ctx.profile.memNo
  const MyMemNo = context.profile && context.profile.memNo
  //state
  const [rankInfo, setRankInfo] = useState('')
  const [starInfo, setStarInfo] = useState('')
  const [fanInfo, setFanInfo] = useState('')
  const [select, setSelect] = useState('')
  const [allFalse, setAllFalse] = useState(false)
  //scroll
  const scrollbars = useRef(null)
  const area = useRef()
  //api
  const fetchData = async () => {
    const res = await Api.mypage_fan_ranking({
      params: {
        memNo: profile.memNo,
        page: 1,
        records: 100
      }
    })
    if (res.result === 'success') {
      setRankInfo(res.data.list)
    } else {
      console.log(res)
    }
    return
  }

  const fetchDataStar = async () => {
    const res = await Api.mypage_star_list({
      params: {
        memNo: urlrStr
      }
    })
    if (res.result === 'success') {
      // console.log(res.data)
      setStarInfo(res.data)
      //console.log(res)
    } else {
      //console.log(res)
    }
    return
  }

  const fetchDataHoleFan = async () => {
    const res = await Api.mypage_fan_list({
      params: {
        memNo: urlrStr
      }
    })
    if (res.result === 'success') {
      // console.log(res.data)
      setFanInfo(res.data.list)
      //console.log(res)
    } else {
      context.action.alert({
        callback: () => {},
        msg: res.message
      })
    }
    return
  }

  //scroll function
  const scrollOnUpdate = () => {
    const thisHeight = document.querySelector('.scrollWrap').offsetHeight + 18
    // console.log(thisHeight)
    document.querySelector('.scroll-box').children[0].style.maxHeight = `calc(${400}px)`
  }
  //등록,해제
  const Regist = (memNo) => {
    async function fetchDataFanRegist(memNo) {
      const res = await Api.fan_change({
        data: {
          memNo: memNo
        }
      })
      if (res.result === 'success') {
        context.action.alert({
          callback: () => {
            setSelect(memNo)
          },
          msg: '팬등록에 성공하였습니다.'
        })
      } else if (res.result === 'fail') {
        context.action.alert({
          callback: () => {},
          msg: res.message
        })
      }
    }
    fetchDataFanRegist(memNo)
  }

  const Cancel = (memNo, isFan) => {
    async function fetchDataFanCancel(memNo, isFan) {
      const res = await Api.mypage_fan_cancel({
        data: {
          memNo: memNo
        }
      })
      if (res.result === 'success') {
        context.action.alert({
          callback: () => {
            setSelect(memNo + 1)
          },
          msg: '팬등록을 해제하였습니다.'
        })
      } else if (res.result === 'fail') {
        context.action.alert({
          callback: () => {},
          msg: res.message
        })
      }
    }
    fetchDataFanCancel(memNo)
  }
  const closePopup = () => {
    if (name === '팬 랭킹') {
      context.action.updateClose(false)
    } else if (name === '팬') {
      context.action.updateCloseFanCnt(false)
    } else if (name === '스타') {
      context.action.updateCloseStarCnt(false)
    }
  }

  //------------------------------------------------------------
  useEffect(() => {
    if (name === '스타') {
      fetchDataStar()
    } else if (name === '팬 랭킹') {
      fetchData()
    } else if (name === '팬') {
      fetchDataHoleFan()
    }
  }, [select])

  useEffect(() => {
    window.onpopstate = (e) => {
      if (name === '팬 랭킹') {
        context.action.updateClose(false)
      } else if (name === '팬') {
        context.action.updateCloseFanCnt(false)
      } else if (name === '스타') {
        context.action.updateCloseStarCnt(false)
      }
    }
  }, [])

  useEffect(() => {
    if (rankInfo === null) {
      return <div style={{minHeight: '300px'}}></div>
    }
  }, [])

  const ClickUrl = (link) => {
    context.action.updateClose(false)
    context.action.updateCloseFanCnt(false)
    context.action.updateCloseStarCnt(false)

    history.push(link, {
      hash: window.location.hash
    })
  }
  return (
    <div id="mainLayerPopup" onClick={closePopup}>
      <div className="popup popup-fanlist">
        <div className="popup__wrap">
          <div className="popbox active">
            <div className="popup__box popup__text">
              <div className="popup__inner" onClick={(e) => e.stopPropagation()}>
                <div className="popup__title">
                  <h3 className="h3-tit">{name}</h3>
                  <button className="close-btn" onClick={() => closePopup()}>
                    <img src={CloseBtn} alt="닫기" />
                  </button>
                </div>
                <div className="scrollWrap">
                  <div className="scrollWrap-inner">
                    <Scrollbars
                      className="scroll-box inner"
                      ref={scrollbars}
                      autoHeight
                      autoHeightMax={'100%'}
                      onUpdate={scrollOnUpdate}
                      autoHide>
                      {/* <div className="reportTitle"></div> */}
                      {rankInfo !== '' &&
                        name === '팬 랭킹' &&
                        rankInfo.map((item, index) => {
                          const {title, id, profImg, nickNm, isFan, memNo} = item
                          let link = ''
                          if (webview) {
                            link = ctx.token.memNo !== memNo ? `/mypage/${memNo}?webview=${webview}` : `/menu/profile`
                          } else {
                            link = ctx.token.memNo !== memNo ? `/mypage/${memNo}` : `/menu/profile`
                          }
                          return (
                            <div key={index} className={`fan-list ${urlrStr === memNo ? 'none' : ''}`}>
                              <a onClick={() => ClickUrl(link)}>
                                <span
                                  className="thumb"
                                  style={{backgroundImage: `url(${profImg.thumb62x62})`}}
                                  bg={profImg.thumb62x62}></span>
                                <span className="nickNm">{nickNm}</span>
                              </a>
                              {isFan === false && memNo !== ctx.token.memNo && (
                                <button onClick={() => Regist(memNo)} className="plusFan">
                                  +팬등록
                                </button>
                              )}
                              {isFan === true && memNo !== ctx.token.memNo && (
                                <button onClick={() => Cancel(memNo, isFan)}>팬</button>
                              )}
                            </div>
                          )
                        })}
                      {starInfo !== '' &&
                        name === '스타' &&
                        starInfo.map((item, index) => {
                          const {title, id, profImg, nickNm, isFan, memNo} = item
                          let link = ''
                          if (webview) {
                            link = ctx.token.memNo !== memNo ? `/mypage/${memNo}?webview=${webview}` : `/menu/profile`
                          } else {
                            link = ctx.token.memNo !== memNo ? `/mypage/${memNo}` : `/menu/profile`
                          }
                          return (
                            <div key={index} className={`fan-list ${urlrStr === memNo ? 'none' : ''}`}>
                              <a onClick={() => ClickUrl(link)}>
                                <span
                                  className="thumb"
                                  style={{backgroundImage: `url(${profImg.thumb62x62})`}}
                                  bg={profImg.thumb62x62}></span>
                                <span className="nickNm">{nickNm}</span>
                              </a>
                              {isFan === false && memNo !== ctx.token.memNo && (
                                <button onClick={() => Regist(memNo)} className="plusFan">
                                  +팬등록
                                </button>
                              )}
                              {isFan === true && memNo !== ctx.token.memNo && (
                                <button onClick={() => Cancel(memNo, isFan)}>팬</button>
                              )}
                            </div>
                          )
                        })}
                      {fanInfo !== '' &&
                        name === '팬' &&
                        fanInfo.map((item, index) => {
                          const {title, id, profImg, nickNm, isFan, memNo} = item
                          let link = ''
                          if (webview) {
                            link = ctx.token.memNo !== memNo ? `/mypage/${memNo}?webview=${webview}` : `/menu/profile`
                          } else {
                            link = ctx.token.memNo !== memNo ? `/mypage/${memNo}` : `/menu/profile`
                          }
                          return (
                            <div key={index} className={`fan-list ${urlrStr === memNo ? 'none' : ''}`}>
                              <a onClick={() => ClickUrl(link)}>
                                <span
                                  className="thumb"
                                  style={{backgroundImage: `url(${profImg.thumb62x62})`}}
                                  bg={profImg.thumb62x62}></span>
                                <span className="nickNm">{nickNm}</span>
                              </a>
                              {isFan === false && memNo !== ctx.token.memNo && (
                                <button onClick={() => Regist(memNo)} className="plusFan">
                                  +팬등록
                                </button>
                              )}
                              {isFan === true && memNo !== ctx.token.memNo && (
                                <button onClick={() => Cancel(memNo, isFan)}>팬</button>
                              )}
                            </div>
                          )
                        })}
                    </Scrollbars>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // <>
    //   <HoleWrap>
    //     <FixedBg className={allFalse === true ? 'on' : ''} ref={area}>
    //       <div className="wrapper">
    //         <div className="scrollWrap">
    //           <Container>
    //             <button className="closeBtn-layer" onClick={() => CancelBtn()}></button>
    //             <h2>{name}</h2>
    //             <Scrollbars
    //               className="scroll-box"
    //               ref={scrollbars}
    //               autoHeight
    //               autoHeightMax={'100%'}
    //               onUpdate={scrollOnUpdate}
    //               autoHide>
    //               <div className="reportTitle"></div>
    //               {rankInfo !== '' &&
    //                 name === '팬 랭킹' &&
    //                 rankInfo.map((item, index) => {
    //                   const {title, id, profImg, nickNm, isFan, memNo} = item
    //                   let link = ''
    //                   if (webview) {
    //                     link = ctx.token.memNo !== memNo ? `/mypage/${memNo}?webview=${webview}` : `/menu/profile`
    //                   } else {
    //                     link = ctx.token.memNo !== memNo ? `/mypage/${memNo}` : `/menu/profile`
    //                   }
    //                   return (
    //                     <List key={index} className={urlrStr === memNo ? 'none' : ''}>
    //                       <a onClick={() => ClickUrl(link)}>
    //                         <Photo bg={profImg.thumb62x62}></Photo>
    //                         <span>{nickNm}</span>
    //                       </a>
    //                       {isFan === false && memNo !== ctx.token.memNo && (
    //                         <button onClick={() => Regist(memNo)} className="plusFan">
    //                           +팬등록
    //                         </button>
    //                       )}
    //                       {isFan === true && memNo !== ctx.token.memNo && (
    //                         <button onClick={() => Cancel(memNo, isFan)}>팬</button>
    //                       )}
    //                     </List>
    //                   )
    //                 })}
    //               {starInfo !== '' &&
    //                 name === '스타' &&
    //                 starInfo.map((item, index) => {
    //                   const {title, id, profImg, nickNm, isFan, memNo} = item
    //                   let link = ''
    //                   if (webview) {
    //                     link = ctx.token.memNo !== memNo ? `/mypage/${memNo}?webview=${webview}` : `/menu/profile`
    //                   } else {
    //                     link = ctx.token.memNo !== memNo ? `/mypage/${memNo}` : `/menu/profile`
    //                   }
    //                   return (
    //                     <List key={index} className={urlrStr === memNo ? 'none' : ''}>
    //                       <a onClick={() => ClickUrl(link)}>
    //                         <Photo bg={profImg.thumb62x62}></Photo>
    //                         <span>{nickNm}</span>
    //                       </a>
    //                       {isFan === false && memNo !== ctx.token.memNo && (
    //                         <button onClick={() => Regist(memNo)} className="plusFan">
    //                           +팬등록
    //                         </button>
    //                       )}
    //                       {isFan === true && memNo !== ctx.token.memNo && (
    //                         <button onClick={() => Cancel(memNo, isFan)}>팬</button>
    //                       )}
    //                     </List>
    //                   )
    //                 })}
    //               {fanInfo !== '' &&
    //                 name === '팬' &&
    //                 fanInfo.map((item, index) => {
    //                   const {title, id, profImg, nickNm, isFan, memNo} = item
    //                   let link = ''
    //                   if (webview) {
    //                     link = ctx.token.memNo !== memNo ? `/mypage/${memNo}?webview=${webview}` : `/menu/profile`
    //                   } else {
    //                     link = ctx.token.memNo !== memNo ? `/mypage/${memNo}` : `/menu/profile`
    //                   }
    //                   return (
    //                     <List key={index} className={urlrStr === memNo ? 'none' : ''}>
    //                       <a onClick={() => ClickUrl(link)}>
    //                         <Photo bg={profImg.thumb62x62}></Photo>
    //                         <span>{nickNm}</span>
    //                       </a>
    //                       {isFan === false && memNo !== ctx.token.memNo && (
    //                         <button onClick={() => Regist(memNo)} className="plusFan">
    //                           +팬등록
    //                         </button>
    //                       )}
    //                       {isFan === true && memNo !== ctx.token.memNo && (
    //                         <button onClick={() => Cancel(memNo, isFan)}>팬</button>
    //                       )}
    //                     </List>
    //                   )
    //                 })}
    //             </Scrollbars>
    //           </Container>
    //         </div>
    //       </div>
    //     </FixedBg>
    //   </HoleWrap>
    //   <Dim onClick={() => DimCancel()}></Dim>
    // </>
  )
}
//----------------------------------------
//styled
const List = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 7px;
  > a {
    display: flex;
    flex: none;
    max-width: 170px;
  }
  a span {
    margin-left: 10px;
    line-height: 40px;
    font-size: 14px;
    display: block;
    color: #424242;
    letter-spacing: -0.35px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  > button {
    flex: none;
    margin-left: auto;
    margin-right: 1px;
    width: 53px;
    height: 26px;
    border: 1px solid ${COLOR_MAIN};
    font-size: 12px;
    line-height: 1.2;
    letter-spacing: -0.3px;
    border-radius: 13px;
    transform: skew(-0.03deg);
    color: ${COLOR_MAIN};
  }
  .plusFan {
    background-color: ${COLOR_MAIN};
    color: #fff;
  }
  &.none {
    display: none;
  }
`
const Photo = styled.div`
  flex: none;
  width: 40px;
  height: 40px;
  background: url(${(props) => props.bg}) no-repeat center center/cover;
  border-radius: 50%;
`
const Container = styled.div`
  position: relative;
  padding: 12px;
  width: 100%;
  margin: 0 auto;
  min-height: 360px;
  display: flex;
  overflow-x: hidden;
  background-color: #fff;
  /* align-items: center; */
  flex-direction: column;
  border-radius: 10px;
  & h2 {
    margin: 2px 0 20px;
    font-size: 20px;
    font-weight: 800;
    text-align: center;
    letter-spacing: -0.4px;
    color: #424242;
    transform: skew(-0.03deg);
    & > span {
      color: ${COLOR_MAIN};
    }
  }
  & p {
    margin: 12px 0 20px 0;
    color: #616161;
    font-size: 14px;
    letter-spacing: -0.35px;
    text-align: left;
    transform: skew(-0.03deg);
  }
  & .scroll-box {
    width: auto !important;
    overflow-x: hidden;
  }
`
const BTN = styled.button`
  display: block;
  width: 100%;
  margin-top: 4px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 8px 0;
  color: #616161;
  font-size: 12px;
  transform: skew(-0.03deg);
  outline: none;
  &.on {
    border: 1px solid ${COLOR_MAIN};
    color: ${COLOR_MAIN};
    font-weight: 600;
  }
`
const SubmitBTN = styled.button`
  display: block;
  width: calc(50% - 4px);
  margin-top: 12px;
  padding: 16px 0;
  border-radius: 10px;
  background-color: #bdbdbd;
  font-size: 14px;
  color: #fff;
  letter-spacing: -0.4px;
  :first-child {
    background-color: #fff;
    border: solid 1px ${COLOR_MAIN};
    color: ${COLOR_MAIN};
  }
  &.on {
    background-color: ${COLOR_MAIN};
  }
`
