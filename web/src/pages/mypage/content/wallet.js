import React, {useState, useEffect, useContext, useReducer, useCallback} from 'react'
import styled from 'styled-components'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'

// context
import {Context} from 'context'
import {OS_TYPE} from 'context/config.js'

// component
import List from '../component/wallet/list.js'

// static
import dalCoinIcon from '../component/images/ic_moon_l@2x.png'
import byeolCoinIcon from '../component/images/ic_star_l@2x.png'
import Header from '../component/header.js'
import WalletPop from '../component/wallet/wallet_pop'

import '../index.scss'

// concat

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
  const [listDetailed, setListDetailed] = useState([]) // listDetailed: false -> Not found case
  const [showFilter, setShowFilter] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)
  const [totalCnt, setTotalCnt] = useState(0)
  const [cancelExchange, setCancelExchange] = useState(null)

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

  return (
    <WalletPage>
      <Header>
        <h2 className="header-title">내지갑</h2>
        <div className="currentValue" onClick={() => {history.push('/pay/store')}}>
          <i className='iconDal'></i>
          {/* <i className='iconStar'></i> */}
          1,234
        </div>
      </Header>
      <section className="tabWrap">
        <div className="tabBox">
          <button className="active">
            달 내역
          </button>
          <button className="">
            별 내역
          </button>
          <button className=""
            onClick={() => {
              history.push('/money_exchange')
            }}>
            환전
          </button>
        </div>
      </section>
      <List
        setShowFilter={setShowFilter}
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
  .currentValue {
    display:flex;
    align-items:center;
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
    padding:0 9px 0 7px;
    .iconDal{
      display: block;
      width: 18px;
      height: 18px;
      background: url('https://image.dalbitlive.com/mypage/dalla/icon_dal.png') no-repeat center / 10px 10px;
    }
    .iconStar{
      display: block;
      width: 18px;
      height: 18px;
      background: url('https://image.dalbitlive.com/mypage/dalla/icon_star.png') no-repeat center / contain;
    }
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
