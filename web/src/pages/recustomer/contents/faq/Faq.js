import React, {useEffect, useState} from 'react'

import Api from 'context/api'
// global components
import Header from 'components/ui/header/Header'
// components
import './faq.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const Faq = () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const [totalList, setTotalList] = useState({
    cnt: 0,
    normalList: [],
    broadcastList: [],
    paymentList: [],
    accountList: [],
    otherList: []
  });
  const [selectedFaqIdx, setSelectedFaqIdx] = useState(0); //해당하는 질문 faqIdx
  const [answer, setAnswer] = useState(0); //FAQ 답변
  const [searchText, setSearchText] = useState("") //검색에 입력한 text
  const [currentSearch, setCurrentSearch] = useState(""); //검색할 text

  //FAQ 내역 조회
  const fetchData = () => {
    let params = {
      faqType: 0,
      page: 1,
      records: 100,
      searchType: 1,
      searchText: searchText
    }
    Api.faq_list({params}).then((res) => {
      /**
       * faqIdx: FAQ번호, faqType: 1:일반, 2:방송, 3:결제, 5:계정, 98:기타, question: 질문내용, writeDt: FAQ들어온 시간
       */
      if (res.result === 'success') {
        setTotalList({
          cnt: res.data.list.length,
          normalList: listFilter(res.data.list, 1),
          broadcastList: listFilter(res.data.list, 2),
          paymentList: listFilter(res.data.list, 3),
          accountList: listFilter(res.data.list, 98),
          otherList: listFilter(res.data.list, 5)
        })
      } else {
        dispatch(setGlobalCtxMessage({type: "alert", msg: res.message}));
      }
    }).catch((e) => console.log(e));
  }

  //FAQ 상세 내역 조회
  const fetchDataDetail = () => {
    let params = {faqIdx: selectedFaqIdx}
    Api.faq_list_detail({params}).then((res) => {
      if (res.result === 'success') {setAnswer(res.data.answer);}
      else {setAnswer(0);}
    }).catch((e) => console.log(e));
  }

  //faqType -> 해당 FAQ 리스트 나누기
  const listFilter = (arr, type) => {
    const filterList = arr.filter((v) => {return v.faqType === type})
    return filterList
  }

  //질문 클릭시 해당 faqIdx 담아주기
  const answerActive = (e) => {
    if(selectedFaqIdx === parseInt(e.currentTarget.dataset.idx)) {setSelectedFaqIdx(0);}
    else {setSelectedFaqIdx(parseInt(e.currentTarget.dataset.idx));}
  }

  //검색버튼 클릭시 해당 text값으로 검색
  const searchClick = (e) => {
    setCurrentSearch(e.currentTarget.dataset.text)
  }

  //입력된 text값 담아주기
  const searchChange = (e) => {
    setSearchText(e.target.value)
  }

  useEffect(() => {
    fetchData()
  }, [currentSearch])

  useEffect(() => {
    fetchDataDetail();
  }, [selectedFaqIdx])

  return (
    <div id="faq">
      <Header position={'sticky'} title={'FAQ'} type={'back'}/>
      <div className="searchWrap">
          <div className='searchForm'>
            <input type="text" placeholder="궁금한 내용을 검색해보세요." className="searchInput" value={searchText} onChange={searchChange}/>
            <button className="searchBtn" data-text={searchText} onClick={searchClick}/>
          </div>
        </div>
      <div className='subContent'>        
        {currentSearch !== "" &&
        <>
          {totalList.cnt > 0 ?
            <p className="searchResult">'{searchText}'로 검색한 결과예요.</p>
            :
            <p className="searchResult">'{searchText}'의 검색 결과가 없어요.</p>
          }
        </>
        }
        <div className="faqSection">
          {totalList.normalList.length > 0 && <div className="faqTitle">일반</div>}
          <div className="faqWrap">
            {totalList.normalList.map((list, index) => {
              return (
                <div className="faqList" key={index} data-idx={list.faqIdx} onClick={answerActive}>
                  <div className="questionArea">
                    <span className="qmark">Q</span>
                    <span className="question">{list.question}</span>
                    <span className={`arrow ${selectedFaqIdx === list.faqIdx ? 'up' : 'down'}`}/>
                  </div>
                  {selectedFaqIdx === list.faqIdx &&
                  <div className="answerArea">
                    <p dangerouslySetInnerHTML={{__html: answer}}/>
                  </div>
                  }
                </div>
              )
            })}
          </div>
        </div>
        <div className="faqSection">
          {totalList.broadcastList.length > 0 && <div className="faqTitle">방송</div>}
          <div className="faqWrap">
            {totalList.broadcastList.map((list, index) => {
              return (
                <div className="faqList" key={index} data-idx={list.faqIdx} onClick={answerActive}>
                  <div className="questionArea">
                    <span className="qmark">Q</span>
                    <span className="question">{list.question}</span>
                    <span className={`arrow ${selectedFaqIdx === list.faqIdx ? 'up' : 'down'}`}/>
                  </div>
                  {selectedFaqIdx === list.faqIdx &&
                  <div className="answerArea">
                    <p dangerouslySetInnerHTML={{__html: answer}}/>
                  </div>
                  }
                </div>
              )
            })}
          </div>
        </div>
        <div className="faqSection">
          {totalList.paymentList.length > 0 && <div className="faqTitle">결제</div>}
          <div className="faqWrap">
            {totalList.paymentList.map((list, index) => {
              return (
                <div className="faqList" key={index} data-idx={list.faqIdx} onClick={answerActive}>
                  <div className="questionArea">
                    <span className="qmark">Q</span>
                    <span className="question">{list.question}</span>
                    <span className={`arrow ${selectedFaqIdx === list.faqIdx ? 'up' : 'down'}`}/>
                  </div>
                  {selectedFaqIdx === list.faqIdx &&
                  <div className="answerArea">
                    <p dangerouslySetInnerHTML={{__html: answer}}/>
                  </div>
                  }
                </div>
              )
            })}
          </div>
        </div>
        <div className="faqSection">
          {totalList.accountList.length > 0 && <div className="faqTitle">계정</div>}
          <div className="faqWrap">
            {totalList.accountList.map((list, index) => {
              return (
                <div className="faqList" key={index} data-idx={list.faqIdx} onClick={answerActive}>
                  <div className="questionArea">
                    <span className="qmark">Q</span>
                    <span className="question">{list.question}</span>
                    <span className={`arrow ${selectedFaqIdx === list.faqIdx ? 'up' : 'down'}`}/>
                  </div>
                  {selectedFaqIdx === list.faqIdx &&
                  <div className="answerArea">
                    <p dangerouslySetInnerHTML={{__html: answer}}/>
                  </div>
                  }
                </div>
              )
            })}
          </div>
        </div>
        <div className="faqSection">
          {totalList.otherList.length > 0 && <div className="faqTitle">기타</div>}
          <div className="faqWrap">
            {totalList.otherList.map((list, index) => {
              return (
                <div className="faqList" key={index} data-idx={list.faqIdx} onClick={answerActive}>
                  <div className="questionArea">
                    <span className="qmark">Q</span>
                    <span className="question">{list.question}</span>
                    <span className={`arrow ${selectedFaqIdx === list.faqIdx ? 'up' : 'down'}`}/>
                  </div>
                  {selectedFaqIdx === list.faqIdx &&
                  <div className="answerArea">
                    <p dangerouslySetInnerHTML={{__html: answer}}/>
                  </div>
                  }
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Faq;
