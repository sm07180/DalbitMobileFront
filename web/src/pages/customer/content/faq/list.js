import React, {useState, useEffect} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import Api from 'context/api'
import qs from 'query-string'

import searchBtn from '../../../../images/search_purple.png'
import NoResult from 'components/ui/noResult'
import './list.scss'

export default function List() {
  const history = useHistory()
  const location = useLocation()
  const {search} = qs.parse(location.search)
  const [normalList, setNormalList] = useState([]) // faqType = 1
  const [broadcastList, setBroadcastList] = useState([]) // faqType = 2
  const [paymentList, setPaymentList] = useState([]) // faqType = 3
  const [accountList, setAccountList] = useState([]) // faqType = 5
  const [otherList, setOtherList] = useState([]) // faqType = 98
  const [searchText, setSearchText] = useState(search || '')
  const [currentSearch, setCurrentSearch] = useState('')
  const [empty, setEmpty] = useState(false)

  const fetchData = async () => {
    const res = await Api.faq_list({
      params: {
        faqType: 0, // 0 - 전체
        page: 1,
        records: 100,
        searchType: 1,
        searchText: search || ''
      }
    })
    if (res.result === 'success') {
      if (res.data.list.length > 0) {
        setNormalList(filterListFn(res.data.list, 1))
        setBroadcastList(filterListFn(res.data.list, 2))
        setPaymentList(filterListFn(res.data.list, 3))
        setOtherList(filterListFn(res.data.list, 98))
        setAccountList(filterListFn(res.data.list, 5))
        setEmpty(false)
      } else {
        setNormalList([])
        setBroadcastList([])
        setPaymentList([])
        setAccountList([])
        setOtherList([])
        setEmpty(true)
      }
    } else {
      console.log('실패')
    }
  }

  const fnSearch = function (value) {
    if (value !== currentSearch) {
      history.push(`/customer/faq?search=${value}`)
      setCurrentSearch(value)
    } else {
      return
    }
  }

  const enterSearch = (e) => {
    if (e.keyCode === 13) {
      fnSearch(e.target.value)
    }
  }

  const filterListFn = function (arr, type) {
    const filterList = arr.filter((v) => {
      return v.faqType === type
    })
    return filterList
  }

  const routeHistory = (item) => {
    const {faqIdx, question} = item
    history.push({
      pathname: `/customer/faq/${faqIdx}`,
      state: {
        faqIdx: faqIdx,
        question: question
      }
    })
  }

  const makeTableWrap = (array) => {
    return array.map((item, index) => {
      const {question} = item
      let letter = ''
      if (currentSearch !== '') {
        letter = question.split(currentSearch).join('<span class="txt_strong">' + currentSearch + '</span>')
      } else {
        letter = question
      }
      return (
        <div className="tableWrap" key={index} onClick={() => routeHistory(item)}>
          {letter.length === 1 ? <>{question}</> : <span dangerouslySetInnerHTML={{__html: letter}}></span>}
        </div>
      )
    })
  }

  useEffect(() => {
    if (!search) {
      setSearchText('')
      setCurrentSearch('')
    } else {
      setSearchText(search)
      setCurrentSearch(search)
    }

    fetchData()
  }, [search])

  return (
    <div className="faqWrap">
      <div className="searchWrap">
        <input
          type="text"
          placeholder="검색어를 입력해 보세요"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={enterSearch}
        />
        <button className="searchBtn" onClick={() => fnSearch(searchText)} style={{backgroundImage: `url(${searchBtn})`}} />
      </div>
      {currentSearch != '' && <span className="searchResult">'{currentSearch}'으로 검색된 결과입니다.</span>}
      {normalList.length > 0 && (
        <div className="listWrap">
          <span className="listWrap__category">일반</span>
          {makeTableWrap(normalList)}
        </div>
      )}
      {broadcastList.length > 0 && (
        <div className="listWrap">
          <span className="listWrap__category">방송</span>
          {makeTableWrap(broadcastList)}
        </div>
      )}
      {paymentList.length > 0 && (
        <div className="listWrap">
          <span className="listWrap__category">결제</span>
          {makeTableWrap(paymentList)}
        </div>
      )}
      {accountList.length > 0 && (
        <div className="listWrap">
          <span className="listWrap__category">계정</span>
          {makeTableWrap(accountList)}
        </div>
      )}
      {otherList.length > 0 && (
        <div className="listWrap">
          <span className="listWrap__category">기타</span>
          {makeTableWrap(otherList)}
        </div>
      )}
      {empty === true && <NoResult type="default" text="검색 결과가 없습니다." />}
    </div>
  )
}
