import React, {useState, useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'

import {Store} from '../index'

import './list.scss'

export default function List(props) {
  const history = useHistory()

  // const [faqList, setFaqList] = useState([]);
  // const [filteredList, setFilteredList] = useState([]);
  // let normalList = [], broadcastList = [], paymentList = [], otherList = [];

  const [normalList, setNormalList] = useState([]) // faqType = 1
  const [broadcastList, setBroadcastList] = useState([]) // faqType = 2
  const [paymentList, setPaymentList] = useState([]) // faqType = 3
  const [otherList, setOtherList] = useState([]) // faqType = 4
  const [accountList, setAccountList] = useState([]) // faqType = 5
  // const [search, setSearch] = useState("");
  // const [currentSearch, setCurrentSearch] = useState("");
  // const [searching, setSearching] = useState(false);
  const fetchData = async function () {
    const res = await Api.faq_list({
      params: {
        faqType: 0,
        page: 1,
        records: 100000,
        searchType: 0,
        searchText: Store().search
      }
    })

    const {result, data} = res

    console.log(res)
    if (result === 'success') {
      if (data.list.length > 0) {
        setNormalList(filterList(data.list, 1))
        setBroadcastList(filterList(data.list, 2))
        setPaymentList(filterList(data.list, 3))
        setOtherList(filterList(data.list, 4))
        setAccountList(filterList(data.list, 5))
      }
    } else if (result === 'fail') {
    }
  }

  const filterList = function (arr, type) {
    const filterList = arr.filter((v) => {
      return v.faqType === type
    })

    return filterList
  }

  const fnSearch = function () {
    if (Store().search === '') {
      Store().action.updateSearching(false)
    } else {
      Store().action.updateSearching(true)
    }
    Store().action.updateCurrentSearch(Store().search)
    // setCurrentSearch(search);
    fetchData()
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

  const maketableWrap = (array) => {
    return array.map((item, index) => {
      const {question} = item
      const test = question.split(Store().currentSearch).join('<span>' + Store().currentSearch + '</span>')
      return (
        <div className="tableWrap" key={index} onClick={() => routeHistory(item)}>
          {Store().searching === false || test.length === 1 ? (
            <dd>{question}</dd>
          ) : (
            <dd dangerouslySetInnerHTML={{__html: test}}></dd>
          )}
          <dd></dd>
        </div>
      )
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="faqWrap">
      <div className="searchWrap">
        <input
          type="text"
          id="search"
          value={Store().search}
          placeholder="검색어를 입력해 보세요"
          onChange={(e) => Store().action.updateSearch(e.target.value)}
        />
        <button className="searchBtn" onClick={fnSearch} />
      </div>
      {Store().searching && <span className="searchResult">'{Store().currentSearch}'으로 검색된 결과입니다.</span>}
      {normalList.length > 0 && (
        <div className="listWrap">
          <span className="listWrap__category">일반</span>
          {maketableWrap(normalList)}
        </div>
      )}
      {broadcastList.length > 0 && (
        <div className="listWrap">
          <span className="listWrap__category">방송</span>
          {maketableWrap(broadcastList)}
        </div>
      )}
      {paymentList.length > 0 && (
        <div className="listWrap">
          <span className="listWrap__category">결제</span>
          {maketableWrap(paymentList)}
        </div>
      )}
      {accountList.length > 0 && (
        <div className="listWrap">
          <span className="listWrap__category">계정</span>
          {maketableWrap(accountList)}
        </div>
      )}
      {otherList.length > 0 && (
        <div className="listWrap">
          <span className="listWrap__category">기타</span>
          {maketableWrap(otherList)}
        </div>
      )}
    </div>
  )
}
