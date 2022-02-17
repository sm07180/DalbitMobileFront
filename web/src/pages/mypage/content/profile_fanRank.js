import React, {useEffect, useState} from 'react'
import qs from 'query-string'
//styled
import styled from 'styled-components'
//context
import {IMG_SERVER} from 'context/config'
import Api from 'context/api'
import {useHistory} from 'react-router-dom'

//scroll
import NoResult from 'components/ui/new_noResult'
import GuidePopup from './guide_user.js'

import goldMedal from '../static/profile/medal_gold_m@2x.png'
import silverMedal from '../static/profile/medal_silver_m@2x.png'
import bronzeMedal from '../static/profile/medal_bronze_m@2x.png'
import hintIcon from '../static/hint.svg'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxCloseFanRank, setGlobalCtxMessage} from "redux/actions/globalCtx";

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const {webview} = qs.parse(location.search)
  const {type} = props
  let history = useHistory()
  //pathname
  const {profile} = props
  const myProfileNo = globalState.profile.memNo
  const MyMemNo = globalState.profile && globalState.profile.memNo
  //state
  const [rankInfo, setRankInfo] = useState('')
  const [goodInfo, setGoodInfo] = useState('')
  const [select, setSelect] = useState('')
  const [fanListType, setFanListType] = useState(1) //1: 최근, 2: 누적
  const [tabType, setTabType] = useState(type === 'tabGood' ? 'good' : 'recent') //recent, accrue, good
  const [detailPopup, setDetailPopup] = useState(false)

  //api
  const fetchData = async () => {
    const res = await Api.mypage_fan_ranking({
      params: {
        memNo: profile.memNo,
        page: 1,
        records: 100,
        rankType: fanListType
      }
    })
    if (res.result === 'success') {
      setRankInfo(res.data.list)
    } else {
      console.log(res)
    }
    return
  }

  const fetchDataGoodRank = async () => {
    const res = await Api.mypage_good_ranking({
      params: {
        memNo: profile.memNo
      }
    })
    if (res.result === 'success') {
      setGoodInfo(res.data.list)
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        callback: () => {
        },
        msg: res.message
      }))
    }
    return
  }

  //등록,해제
  const Regist = (memNo, nickNm) => {
    async function fetchDataFanRegist(memNo) {
      const res = await Api.fan_change({
        data: {
          memNo: memNo
        }
      })
      if (res.result === 'success') {
        dispatch(setGlobalCtxMessage({
          type: "toast",
          msg: `${nickNm}님의 팬이 되었습니다`
        }))
        setSelect(memNo)
        if (tabType === 'good') {
          fetchDataGoodRank()
        } else {
          fetchData()
        }
      } else if (res.result === 'fail') {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          callback: () => {
          },
          msg: res.message
        }))
      }
    }
    fetchDataFanRegist(memNo)
  }

  const Cancel = (memNo, nickNm) => {
    dispatch(setGlobalCtxMessage({
      type: "confirm",
      msg: `${nickNm} 님의 팬을 취소 하시겠습니까?`,
      callback: () => {
        async function fetchDataFanCancel(memNo) {
          const res = await Api.mypage_fan_cancel({
            data: {
              memNo: memNo
            }
          })
          if (res.result === 'success') {
            dispatch(setGlobalCtxMessage({
              type: "toast",
              msg: res.message
            }))
            setSelect(memNo + 1)
            if (tabType === 'good') {
              fetchDataGoodRank()
            } else {
              fetchData()
            }
          } else if (res.result === 'fail') {
            dispatch(setGlobalCtxMessage({
              type: "alert",
              callback: () => {
              },
              msg: res.message
            }))
          }
        }

        fetchDataFanCancel(memNo)
      }
    }))
  }

  const Link = (memNo) => {
    if (webview && webview === 'new') {
      history.push(`/mypage/${memNo}?webview=new`)
    } else {
      history.push(`/mypage/${memNo}`)
    }
  }

  // #layer pop func
  const popStateEvent = (e) => {
    if (e.state === null) {
      setDetailPopup(false)
    } else if (e.state === 'layer') {
      setDetailPopup(true)
    }
  }
  // #layer pop
  useEffect(() => {
    if (detailPopup) {
      if (window.location.hash === '') {
        window.history.pushState('layer', '', '/#layer')
      }
    } else if (!detailPopup) {
      if (window.location.hash === '#layer') {
        window.history.back()
      }
    }
  }, [detailPopup])

  useEffect(() => {
    /* popup떳을시 scroll 막는 코드 */
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  //------------------------------------------------------------

  useEffect(() => {
    fetchData()
    fetchDataGoodRank()
  }, [tabType])

  useEffect(() => {
    if (rankInfo === null) {
      return <div style={{minHeight: '300px'}}></div>
    }
  }, [])


  return (
    <>
      <HoleWrap>
        <div className="wrapper">
          <button className="close" onClick={() => dispatch(setGlobalCtxCloseFanRank(false))}></button>
          <h2 className="title">랭킹</h2>

          <div className="innerTabWrap">
            <button className="innerTabWrap__guide" onClick={() => setDetailPopup(true)}>
              <img src={hintIcon} />
            </button>
            <div
              className={`innerTabWrap__tab ${tabType === 'recent' ? 'innerTabWrap__tab--active' : ''}`}
              onClick={() => {
                setFanListType(1)
                setTabType('recent')
              }}>
              최근 팬
            </div>
            <div
              className={`innerTabWrap__tab ${tabType === 'accrue' ? 'innerTabWrap__tab--active' : ''}`}
              onClick={() => {
                setFanListType(2)
                setTabType('accrue')
              }}>
              누적 팬
            </div>
            <div
              className={`innerTabWrap__tab ${tabType === 'good' ? 'innerTabWrap__tab--active' : ''}`}
              onClick={() => setTabType('good')}>
              좋아요
            </div>
          </div>

          {tabType === 'recent' || tabType === 'accrue' ? (
            <ul className="rankList scrollWrap">
              {rankInfo.length > 0 ? (
                <>
                  {rankInfo.map((value, idx) => {
                    const {nickNm, giftDal, profImg, isFan, memNo} = value
                    return (
                      <li className="rankitem" key={idx}>
                        <div className="rankitemWrap">
                          <div
                            className="thumbBox"
                            onClick={() => {
                              dispatch(setGlobalCtxCloseFanRank(false));
                              Link(memNo);
                            }}>
                            <img src={profImg.thumb120x120} className="thumbBox__thumb" alt="thumb" />
                            {idx < 5 && (
                              <>
                                {idx < 3 ? (
                                  <img
                                    className="thumbBox__medalIcon"
                                    src={idx === 0 ? goldMedal : idx === 1 ? silverMedal : bronzeMedal}
                                  />
                                ) : (
                                  <span className={`thumbBox__rank thumbBox__rank--${idx + 1}`}>{idx + 1}</span>
                                )}
                              </>
                            )}
                          </div>
                          <div className="textBox">
                            <p className="textBox__nick">{nickNm}</p>
                          </div>
                        </div>

                        {isFan === false && memNo !== globalState.token.memNo && (
                          <button onClick={() => Regist(memNo, nickNm)} className="plusFan">
                            +팬등록
                          </button>
                        )}
                        {isFan === true && memNo !== globalState.token.memNo && (
                          <button onClick={() => Cancel(memNo, nickNm)}>팬</button>
                        )}
                      </li>
                    )
                  })}
                </>
              ) : (
                <NoResult
                  type="default"
                  text={tabType === 'recent' ? '최근 3개월 간 선물한 팬이 없습니다.' : '선물한 팬이 없습니다.'}
                />
              )}
            </ul>
          ) : (
            <ul className="rankList scrollWrap">
              {goodInfo.length > 0 ? (
                <>
                  {goodInfo.map((value, idx) => {
                    const {nickNm, giftDal, profImg, isFan, memNo} = value
                    return (
                      <li className="rankitem" key={idx}>
                        <div className="rankitemWrap">
                          <div
                            className="thumbBox"
                            onClick={() => {
                              dispatch(setGlobalCtxCloseFanRank(false))
                              Link(memNo);
                            }}>
                            <img src={profImg.thumb120x120} className="thumbBox__thumb" alt="thumb" />
                            {idx < 5 && (
                              <>
                                {idx < 3 ? (
                                  <img
                                    className="thumbBox__medalIcon"
                                    src={idx === 0 ? goldMedal : idx === 1 ? silverMedal : bronzeMedal}
                                  />
                                ) : (
                                  <span className={`thumbBox__rank thumbBox__rank--${idx + 1}`}>{idx + 1}</span>
                                )}
                              </>
                            )}
                          </div>
                          <div className="textBox">
                            <p className="textBox__nick">{nickNm}</p>
                            <p className="textBox__dal">
                              {/* <img src={dalIcon} width={20} alt="dal" /> */}
                              {/* {giftDal.toLocaleString()} */}
                            </p>
                          </div>
                        </div>

                        {isFan === false && memNo !== globalState.token.memNo && (
                          <button onClick={() => Regist(memNo, nickNm)} className="plusFan">
                            +팬등록
                          </button>
                        )}
                        {isFan === true && memNo !== globalState.token.memNo && (
                          <button onClick={() => Cancel(memNo, nickNm)}>팬</button>
                        )}
                      </li>
                    )
                  })}
                </>
              ) : (
                <NoResult type="default" text="좋아요를 보낸 회원이 없습니다." />
              )}
            </ul>
          )}
        </div>
        {detailPopup && <GuidePopup setDetailPopup={setDetailPopup} />}
      </HoleWrap>
    </>
  )
}

const HoleWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 60;

  display: flex;
  justify-content: center;
  align-items: center;

  .wrapper {
    width: calc(100% - 32px);
    max-width: 328px;
    border-radius: 12px;
    background-color: #fff;
    position: relative;

    .close {
      display: block;
      position: absolute;
      top: -40px;
      right: 0;
      width: 36px;
      height: 36px;
      background: url(${IMG_SERVER}/images/common/ic_close_m@2x.png) no-repeat center center / cover;
    }

    .title {
      padding: 20px 0 12px;
      font-size: 18px;
      text-align: center;
      border-bottom: 1px solid #e0e0e0;
    }
  }

  .scrollWrap {
    overflow: hidden;
    height: 300px;
    overflow-y: scroll;
  }

  .tabWrap {
    display: flex;

    &__tab {
      width: 50%;
      height: 52px;
      text-align: center;
      line-height: 52px;
      font-size: 18px;
      font-weight: 700;

      &--active {
        color: #632beb;
        border-bottom: 1px solid #632beb;
        font-weight: bold;
      }
    }
  }

  .innerTabWrap {
    position: relative;
    display: flex;
    justify-content: center;
    height: 40px;
    line-height: 40px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;

    &__guide {
      position: absolute;
      top: 8px;
      right: 16px;
    }

    &__tab {
      padding: 0 5px;
      font-size: 16px;

      &--active {
        color: #632beb;
        font-weight: bold;
        border-bottom: 1px solid #632beb;
      }
    }
  }

  .rankitem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;

    .rankitemWrap {
      display: flex;
      align-items: center;
      width: calc(100% - 66px);
    }

    .thumbBox {
      position: relative;
      width: 40px;
      height: 40px;
      margin-right: 12px;

      &__thumb {
        width: 100%;
        border-radius: 50%;
      }

      &__rank {
        position: absolute;
        top: -2px;
        left: -2px;
        width: 16px;
        height: 16px;
        background: rgba(0, 0, 0, 0.3);
        color: #fff;
        font-size: 9px;
        text-align: center;
        border-radius: 50%;
      }

      &__medalIcon {
        width: 20px;
        position: absolute;
        top: -6px;
        left: -6px;
      }
    }

    .textBox {
      width: calc(100% - 52px);

      &__nick {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        word-wrap: normal;
        margin-bottom: 3px;
        font-weight: 800;
        font-size: 14px;
      }

      &__dal {
        font-size: 14px;
        color: #424242;
      }
    }

    button {
      width: 56px;
      height: 26px;
      border: 1px solid #632beb;
      font-size: 12px;
      letter-spacing: -0.3px;
      border-radius: 13px;
      color: #632beb;
    }
    .plusFan {
      background-color: #632beb;
      color: #fff;
    }
  }
`
