import React, {useState, useEffect, useContext, useReducer, useCallback} from 'react'
import styled from 'styled-components'
import {useHistory} from 'react-router-dom'
import {Hybrid} from 'context/hybrid'
import Api from 'context/api'

// context
import {Context} from 'context'
import {OS_TYPE} from 'context/config.js'

// component
import Paging from 'components/ui/paging.js'
import List from '../component/wallet/list.js'

// static
import dalCoinIcon from '../component/images/ic_moon_l@2x.png'
import byeolCoinIcon from '../component/images/ic_star_l@2x.png'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P, PHOTO_SERVER} from 'context/color'
import {WIDTH_MOBILE, IMG_SERVER} from 'context/config'
import Header from '../component/header.js'
import paging from 'components/ui/paging.js'
import WalletPop from '../component/wallet/wallet_pop'

import '../index.scss'

// concat

let timer
const reducer = (state, action) => {
  switch (action.type) {
    case 'page':
      return {
        ...state,
        currentPage: action.val
      }
    case 'filter':
      if (
        action.val.every((v) => {
          return !v.checked
        })
      ) {
        return {
          ...state,
          currentPage: 1,
          filterList: action.val,
          allChecked: true
        }
      } else {
        return {
          ...state,
          currentPage: 1,
          filterList: action.val,
          allChecked: false
        }
      }

    case 'type':
      return {
        coinType: action.val,
        currentPage: 1,
        filterList: [],
        allChecked: true
      }
  }
}

export default (props) => {
  let history = useHistory()
  const context = useContext(Context)

  const [formState, formDispatch] = useReducer(reducer, {
    coinType: 'dal',
    currentPage: 1,
    filterList: [],
    allChecked: true
  })
  const [totalPage, setTotalPage] = useState(1)
  const [totalCoin, setTotalCoin] = useState(null)
  const [listDetailed, setListDetailed] = useState([]) // listDetailed: false -> Not found case
  const [showFilter, setShowFilter] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)
  const [totalCnt, setTotalCnt] = useState(0)
  const [cancelExchange, setCancelExchange] = useState(null)
  const [coinType, setCoinType] = useState('dal') // type 'dal', 'byeol'

  const changeCoinTypeClick = (type) => {
    formDispatch({
      type: 'type',
      val: type
    })
  }

  const returnCoinText = useCallback(
    (t) => {
      return t === 'dal' ? '달' : '별'
    },
    [formState.coinType]
  )
  const returnCoinImg = (t) => {
    return t === 'dal' ? dalCoinIcon : byeolCoinIcon
  }
  // async function fetchData(next) {
  //   currentPage = next ? ++currentPage : currentPage
  //   const response = await Api.mypage_wallet_inquire({
  //     coinType,
  //     walletType,
  //     page: currentPage,
  //     records: 15
  //   })
  //   if (response.result === 'success') {
  //     setSearching(false)
  //     const {list, dalTotCnt, byeolTotCnt, paging} = response.data
  //     if (coinType === 'dal') {
  //       setTotalCoin(dalTotCnt)
  //     } else if (coinType === 'byeol') {
  //       setTotalCoin(byeolTotCnt)
  //     }
  //     if (response.code === '0') {
  //       if (next !== 'next') {
  //         setListDetailed(false)
  //       }
  //       moreState = false
  //     } else {
  //       if (next) {
  //         moreState = true
  //         setNextList(response.data.list)
  //       } else {
  //         setListDetailed(response.data.list)
  //         fetchData('next')
  //       }
  //     }
  //   } else {
  //   }
  // }

  //재조회 및 초기조회
  // useEffect(() => {
  //   currentPage = 1
  //   fetchData()
  // }, [coinType, walletType, page])
  //스크롤 콘켓
  // 환전취소
  async function cancelExchangeFetch() {
    const {result, data, message} = await Api.postExchangeCancel({
      exchangeIdx: cancelExchange
    })
    if (result === 'success') {
      context.action.alert({
        title: '환전 취소가 완료되었습니다.',
        className: 'mobile',
        msg: message,
        callback: () => {
          fetchData()
          setCancelExchange(null)
        }
      })
    } else {
      context.action.alert({
        msg: message,
        callback: () => {
          fetchData()
          setCancelExchange(null)
        }
      })
    }
  }
  const checkSelfAuth = async () => {
    //2020_10_12 환전눌렀을때 본인인증 나이 제한 없이 모두 가능
    let myBirth
    const baseYear = new Date().getFullYear() - 11
    const myInfoRes = await Api.mypage()
    if (myInfoRes.result === 'success') {
      myBirth = myInfoRes.data.birth.slice(0, 4)
    }

    async function fetchSelfAuth() {
      const res = await Api.self_auth_check({})
      if (res.result === 'success') {
        if (res.data.company === '기타') {
          return context.action.alert({
            msg: `휴대폰 본인인증을 받지 않은 경우\n환전이 제한되는 점 양해부탁드립니다`
          })
        }
        const {parentsAgreeYn, adultYn} = res.data
        if (parentsAgreeYn === 'n' && adultYn === 'n') return history.push('/selfauth_result')
        if (myBirth > baseYear) {
          return context.action.alert({
            msg: `만 14세 미만 미성년자 회원은\n서비스 이용을 제한합니다.`
          })
        } else {
          history.push('/money_exchange')
        }
      } else if (res.result === 'fail' && res.code === '0') {
        history.push('/selfauth')
      } else {
        context.action.alert({
          msg: res.message
        })
      }
    }
    fetchSelfAuth()
    // history.push('/money_exchange')
  }

  //콘켓 쇼모어 이벤트

  useEffect(() => {
    //스크롤 이벤트
    let fetching = false

    const scrollEvtHdr = (event) => {
      if (timer) window.clearTimeout(timer)
      timer = window.setTimeout(function () {
        //스크롤
        const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
        const body = document.body
        const html = document.documentElement
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
        const windowBottom = windowHeight + window.pageYOffset
        const diff = docHeight / 3
        if (totalPage > formState.currentPage && windowBottom >= docHeight - diff) {
          // showMoreList()
          if (!fetching) {
            formDispatch({
              type: 'page',
              val: formState.currentPage + 1
            })
          }
        }
      }, 50)
    }

    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
      fetching = true
    }
  }, [totalPage, formState])

  async function getMyPageNewWallet() {
    const newFanBoard = await Api.getMyPageNewWallet()
    let mypageNewStg = localStorage.getItem('mypageNew')
    if (mypageNewStg === undefined || mypageNewStg === null || mypageNewStg === '') {
      mypageNewStg = {}
    } else {
      mypageNewStg = JSON.parse(mypageNewStg)
    }
    const dal = newFanBoard.data.dal
    const byeol = newFanBoard.data.byeol
    mypageNewStg.dal = dal === undefined || dal === null || dal === '' ? 0 : dal
    mypageNewStg.byeol = byeol === undefined || byeol === null || byeol === '' ? 0 : byeol
    localStorage.setItem('mypageNew', JSON.stringify(mypageNewStg))
  }

  const fetchPop = useCallback(
    async function () {
      const res = await Api.getMypageWalletPop({
        walletType: formState.coinType === 'dal' ? 1 : 0
      })

      if (res.result === 'success') {
        if (res.data.list instanceof Array && res.data.list.length > 0) {
          let cnt = 0
          res.data.list.forEach((v) => {
            cnt += v.cnt
            v.checked = false
          })
          formDispatch({
            type: 'filter',
            val: res.data.list
          })
          setTotalCnt(cnt)
        }
      }
    },
    [formState.coinType]
  )

  const fetchData = useCallback(
    async function () {
      let walletCode = ''

      if (formState.filterList.length > 0) {
        if (formState.allChecked === true) {
          walletCode = 0
        } else {
          walletCode = formState.filterList
            .filter((v) => {
              return v.checked
            })
            .reduce((acc, cur, idx, self) => {
              if (self.length - 1 === idx) {
                return acc + cur.walletCode
              } else {
                return acc + cur.walletCode + '|'
              }
            }, walletCode)
        }
        const res = await Api.getMypageWalletList({
          walletType: formState.coinType === 'dal' ? 1 : 0,
          walletCode: walletCode,
          page: formState.currentPage,
          records: 15
        })

        if (res.result === 'success') {
          if (formState.currentPage > 1) {
            setListDetailed(listDetailed.concat(res.data.list))
          } else {
            setListDetailed(res.data.list)
          }
          if (formState.coinType === 'dal') {
            setTotalCoin(res.data.dalTotCnt)
          } else {
            setTotalCoin(res.data.byeolTotCnt)
          }

          if (res.data.paging) {
            setTotalPage(res.data.paging.totalPage)
          } else {
            setTotalPage(1)
          }
        } else {
          setListDetailed([])
          setTotalPage(1)
        }
      } else {
      }
    },
    [formState, listDetailed]
  )

  useEffect(() => {
    fetchData()
  }, [formState])

  useEffect(() => {
    fetchPop()
  }, [formState.coinType])

  useEffect(() => {
    getMyPageNewWallet()
  }, [])
  useEffect(() => {
    if (cancelExchange !== null) {
      cancelExchangeFetch()
    }
  }, [cancelExchange])
  useEffect(() => {
    if (formState.filterList instanceof Array && formState.filterList.length > 0) {
      let cnt = 0
      if (formState.allChecked === true) {
        formState.filterList.forEach((v) => {
          cnt += v.cnt
        })
      } else {
        formState.filterList.forEach((v) => {
          if (v.checked) cnt += v.cnt
        })
      }

      setTotalCnt(cnt)

      setIsFiltering(!formState.allChecked)
    }
  }, [formState.filterList, formState.allChecked])

  useEffect(() => {
    if (showFilter) {
      document.body.style.overflowY = 'hidden'
    } else {
      document.body.style.overflowY = ''
    }
  }, [showFilter])

  return (
    <div>
      {showFilter && formState.filterList.length > 0 && (
        <div
          id="wallet_layer"
          onClick={() => {
            setShowFilter(false)
          }}>
          <WalletPop formState={formState} formDispatch={formDispatch} setShowFilter={setShowFilter} />
        </div>
      )}

      {/* 공통타이틀 */}
      <Header title="내 지갑" />
      <Wrap>
        <TitleWrap>
          <CoinTypeBtn
            className={formState.coinType === 'dal' ? 'active' : ''}
            onClick={() => {
              changeCoinTypeClick('dal')
            }}>
            달
          </CoinTypeBtn>
          <CoinTypeBtn
            className={formState.coinType === 'byeol' ? 'active' : ''}
            onClick={() => {
              changeCoinTypeClick('byeol')
            }}>
            별
          </CoinTypeBtn>
        </TitleWrap>

        <CoinCountingView>
          <CoinCurrentStatus className={formState.coinType === 'dal' ? 'active' : ''}>
            <span className="text">{`현재 보유 ${returnCoinText(formState.coinType)}:`}</span>
            <span className="current-value">
              {totalCoin !== null && Number(totalCoin).toLocaleString()}
              {formState.coinType === 'byeol' ? <em>별</em> : <em>달</em>}
            </span>
          </CoinCurrentStatus>

          <div>
            {formState.coinType === 'dal' ? (
              <>
                {context.customHeader['os'] === OS_TYPE['IOS'] ? (
                  <CoinChargeBtn
                    onClick={() => {
                      webkit.messageHandlers.openInApp.postMessage('')
                    }}>
                    충전하기
                  </CoinChargeBtn>
                ) : (
                  <CoinChargeBtn
                    onClick={() => {
                      history.push('/pay/store')
                    }}>
                    충전하기
                  </CoinChargeBtn>
                )}
              </>
            ) : (
              <>
                {
                  <CoinChargeBtn
                    className={context.customHeader['os'] === OS_TYPE['IOS'] ? ' exchange ios' : ' exchange'}
                    onClick={() => {
                      if (context.customHeader['os'] === OS_TYPE['IOS']) {
                        async function fetchTokenShort() {
                          const res = await Api.getTokenShort()
                          if (res.result === 'success') {
                            Hybrid(
                              'openUrl',
                              'https://' + location.hostname + '/mypage/' + res.data.memNo + '/wallet?ppTT=' + res.data.authToken
                            )
                          } else {
                            context.action.alert({
                              msg: res.message
                            })
                          }
                        }
                        fetchTokenShort()
                      } else {
                        history.push('/exchange')
                      }
                    }}>
                    달교환
                  </CoinChargeBtn>
                }
                {context.customHeader['os'] !== OS_TYPE['IOS'] ? (
                  <CoinChargeBtn
                    className="exchange"
                    onClick={() => {
                      checkSelfAuth()
                    }}>
                    환전하기
                  </CoinChargeBtn>
                ) : (
                  context.customHeader['os'] === OS_TYPE['IOS'] &&
                  totalCoin >= 570 && (
                    <CoinChargeBtn
                      className="exchange"
                      onClick={() => {
                        checkSelfAuth()
                      }}>
                      환전하기
                    </CoinChargeBtn>
                  )
                )}
              </>
            )}
          </div>
        </CoinCountingView>
        <List
          walletData={listDetailed}
          returnCoinText={returnCoinText}
          isFiltering={isFiltering}
          setShowFilter={setShowFilter}
          totalCnt={totalCnt}
          formState={formState}
          setCancelExchange={setCancelExchange}
        />
      </Wrap>
    </div>
  )
}
//styled-------------------------------------------------------------------------------
const CoinChargeBtn = styled.button`
  color: #fff;
  background-color: #632beb;
  box-sizing: border-box;
  font-size: 16px;
  width: auto;
  padding: 0 8px;
  height: 36px;
  line-height: 36px;
  border-radius: 12px;
  font-size: 16px;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  &.white-btn {
    border: 1px solid #632beb;
    background-color: #fff;
    color: #632beb;
    margin-right: 12px;
  }
  &.exchange {
    display: inline-block;
    flex-direction: inherit;
    margin-top: 0 !important;
    margin-left: 4px;
    background: #632beb;
  }
  &.gray {
    background-color: #757575;
  }
`
const CoinCurrentStatus = styled.div`
  display: flex;
  justify-content: left;
  align-items: left;
  flex-direction: row;
  user-select: none;
  width: calc(100% - 160px);
  &.active {
    width: calc(100% - 80px);
  }
  .text {
    color: #9e9e9e;
    font-size: 16px;
    letter-spacing: -0.4px;

    @media (max-width: ${WIDTH_MOBILE}) {
      display: none;
    }
  }
  .coin-img {
    width: 44px;
    margin-left: 20px;

    @media (max-width: ${WIDTH_MOBILE}) {
      width: 36px;
      margin-left: 0;
      margin-right: 3px;
    }
  }
  .current-value {
    padding-left: 15px;
    font-size: 22px;
    font-weight: 800;
    line-height: 22px;
    text-align: left;
    color: #000000;
    > em {
      font-size: 20px;
      font-weight: normal;
      font-style: normal;
      letter-spacing: normal;
      color: #9e9e9e;
      margin-left: 6px;
      line-height: 22px;
    }
  }
`
const CoinCountingView = styled.div`
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  padding: 11px 6px;
  background-color: #fff;
  box-sizing: border-box;
`
const CoinTypeBtn = styled.button`
  position: relative;
  width: 80px;
  height: 36px;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  line-height: 36px;
  margin-right: 2px;
  font-size: 16px;
  letter-spacing: normal;
  text-align: center;
  color: #000;
  border: solid 1px #e0e0e0;
  background-color: #ffffff;
  &.active {
    border: solid 1px #632beb;
    background-color: #632beb;
    color: #ffffff;
  }
`
const TitleWrap = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;
  align-items: center;
  /* margin: 20px 0 10px 0; */

  .text {
    font-size: 20px;
    letter-spacing: -0.5px;
    color: #632beb;
  }
`
// 탑 공통 타이틀 스타일
const TopWrap = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid ${COLOR_MAIN};
  align-items: center;
  margin-top: 24px;
  padding-bottom: 12px;
  button:nth-child(1) {
    width: 24px;
    height: 24px;
    background: url(${IMG_SERVER}/images/api/btn_back.png) no-repeat center center / cover;
  }
  .title {
    width: calc(100% - 24px);
    color: ${COLOR_MAIN};
    font-size: 18px;
    font-weight: bold;
    letter-spacing: -0.5px;
    text-align: center;
  }
`
const Wrap = styled.div`
  padding: 12px 16px;
`
