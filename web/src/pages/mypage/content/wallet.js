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
    <WalletPage>
      <Header>
        <h2 className="header-title">내지갑</h2>
        <div className="current-value" onClick={() => {history.push('/pay/store')}}>
          {totalCoin !== null && Number(totalCoin).toLocaleString()}
        </div>
      </Header>
      <section className="tabWrap">
        <div className="tabBox">
          <button
            className={formState.coinType === 'dal' ? 'active' : ''}
            onClick={() => {
              changeCoinTypeClick('dal')
            }}>
            달 내역
          </button>
          <button
            className={formState.coinType === 'byeol' ? 'active' : ''}
            onClick={() => {
              changeCoinTypeClick('byeol')
            }}>
            별 내역
          </button>
          <button
            className="exchange"
            onClick={() => {
              checkSelfAuth()
            }}>
            환전
          </button>
        </div>
      </section>
      <List
        walletData={listDetailed}
        returnCoinText={returnCoinText}
        isFiltering={isFiltering}
        setShowFilter={setShowFilter}
        totalCnt={totalCnt}
        formState={formState}
        setCancelExchange={setCancelExchange}
      />
      {showFilter && formState.filterList.length > 0 && (
        <div
          id="wallet_layer"
          onClick={() => {
            setShowFilter(false)
          }}>
          <WalletPop formState={formState} formDispatch={formDispatch} setShowFilter={setShowFilter} />
        </div>
      )}
    </WalletPage>
  )
}
//styled-------------------------------------------------------------------------------
const WalletPage = styled.div`
  position: relative;
  min-height: 100vh;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  color:#000;
  background:#fff;
  section{
    position:relative;
  }
  .current-value {
    position:absolute;
    right:16px;
    top:50%;
    transform:translateY(-50%);
    height:26px;
    line-height:26px;
    font-size: 12px;
    font-weight: 400;
    border:1px solid #d6d6d6;
    border-radius:13px;
    padding:0 9px 0 15px;
  }
  .tabBox{
    display: flex;
    align-items: center;
    width:100%;
    height:42px;
    margin-bottom: 8px;
    padding:0 16px;
    button{
      position: relative;
      width: 100%;
      height: 100%;
      text-align: center;
      font-size: 16px;
      color: #acacac;
      background-color: #ffffff;
      border-bottom:2px solid #f2f2f2;
      &.active {
        font-weight:600;
        color:#000;
        border-bottom: solid 2px #202020;
      }
    }
  }
  
`
