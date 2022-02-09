import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import Api from 'context/api'
// global components
import Header from 'components/ui/header/Header'
// components
import './faq.scss'

const Faq = (props) => { 
  const [normalList, setNormalList] = useState([]) // faqType = 1
  const [broadcastList, setBroadcastList] = useState([]) // faqType = 2
  const [paymentList, setPaymentList] = useState([]) // faqType = 3
  const [accountList, setAccountList] = useState([]) // faqType = 5
  const [otherList, setOtherList] = useState([]) // faqType = 98

  const [selectedFaqIdx, setSelectedFaqIdx] = useState(0);
  const [answer, setAnswer] = useState(0);

  const [searchText, setSearchText] = useState("")

  const fetchFaqList = async () => {
    const res = await Api.faq_list({
      params: {
        faqType: 0, // 0 - 전체
        page: 1,
        records: 100,
        searchType: 1,
        searchText: searchText
      }
    })
    if (res.result === 'success') {
      setNormalList(listFilter(res.data.list, 1))
      setBroadcastList(listFilter(res.data.list, 2))
      setPaymentList(listFilter(res.data.list, 3))
      setOtherList(listFilter(res.data.list, 98))
      setAccountList(listFilter(res.data.list, 5))
    }
  }

  async function fetchAnswer() {
    const res = await Api.faq_list_detail({
      params: {
        faqIdx: selectedFaqIdx
      }
    })
    if (res.result === 'success') {
      setAnswer(res.data.answer);
    }
  }

  const listFilter = function (arr, type) {
    const filterList = arr.filter((v) => {
      return v.faqType === type
    })
    return filterList
  }  

  const answerActive = (index) => {
    if(selectedFaqIdx === index) {
      setSelectedFaqIdx(0);
    } else {
      setSelectedFaqIdx(index);
    }
  }

  const searching = (e) => {
    setSearchText(e.target.value)
  }

  useEffect(() => {
    fetchFaqList()
  }, [searchText])

  useEffect(() => {
    fetchAnswer();
  }, [selectedFaqIdx])

  return (
    <div id="faq">
      <Header position={'sticky'} title={'FAQ'} type={'back'}/>
      <div className='subContent'>
        <div className="searchWrap">
          <div className='searchForm'>
            <input
              type="text"
              placeholder="궁금한 내용을 검색해보세요."
              className="searchInput"
              value={searchText}
              onChange={searching}
            />
            <button className="searchBtn" onClick={() => fnSearch(searchText)}/>
          </div>          
        </div>
        {searchText !== "" && 
          <>
            {
              normalList.length + broadcastList.length + paymentList.length + accountList.length + otherList.length > 0 ?
              <p className="searchResult">'{searchText}'로 검색한 결과예요.</p>
              :              
              <p className="searchResult">'{searchText}'의 검색 결과가 없어요.</p>
            }
          </>
        }
        {
          normalList.length > 0 &&
            <div className="faqSection">
              <div className="faqTitle">일반</div>
              <div className="faqWrap">
                {
                  normalList.map((list, index) => {
                    const {question} = list
                    let letter = ''
                    if (searchText !== '') {
                      letter = question.split(searchText).join('<span>' + searchText + '</span>')
                    } else {
                      letter = question
                    }
                    return (
                      <div className="faqList" key={index} onClick={() => answerActive(list.faqIdx)}>
                        <div className="questionArea">
                          <span className="qmark">Q</span>
                          {letter.length === 1 ? <span className="question">{list.question}</span> : <span className="question" dangerouslySetInnerHTML={{__html: letter}}></span>}
                          <span className={`arrow ${selectedFaqIdx === list.faqIdx ? 'up' : 'down'}`}></span>                      
                        </div>
                        {
                          selectedFaqIdx === list.faqIdx && 
                          <div className="answerArea">
                            <p dangerouslySetInnerHTML={{__html: answer}}></p>
                          </div>
                        }                    
                      </div>
                    )
                  })
                }            
              </div>
            </div>
        }
        {
          broadcastList.length > 0 &&
            <div className="faqSection">
              <div className="faqTitle">방송</div>
              <div className="faqWrap">
                {
                  broadcastList.map((list, index) => {
                    const {question} = list
                    let letter = ''
                    if (searchText !== '') {
                      letter = question.split(searchText).join('<span>' + searchText + '</span>')
                    } else {
                      letter = question
                    }
                    return (
                      <div className="faqList" key={index} onClick={() => answerActive(list.faqIdx)}>
                        <div className="questionArea">
                          <span className="qmark">Q</span>
                          {letter.length === 1 ? <span className="question">{list.question}</span> : <span className="question" dangerouslySetInnerHTML={{__html: letter}}></span>}
                          <span className={`arrow ${selectedFaqIdx === list.faqIdx ? 'up' : 'down'}`}></span>                      
                        </div>
                        {
                          selectedFaqIdx === list.faqIdx && 
                          <div className="answerArea">
                            <p dangerouslySetInnerHTML={{__html: answer}}></p>
                          </div>
                        }                    
                      </div>
                    )
                  })
                }            
              </div>
            </div>
        }
        {
          paymentList.length > 0 &&
            <div className="faqSection">
              <div className="faqTitle">결제</div>
              <div className="faqWrap">
                {
                  paymentList.map((list, index) => {
                    const {question} = list
                    let letter = ''
                    if (searchText !== '') {
                      letter = question.split(searchText).join('<span>' + searchText + '</span>')
                    } else {
                      letter = question
                    }
                    return (
                      <div className="faqList" key={index} onClick={() => answerActive(list.faqIdx)}>
                        <div className="questionArea">
                          <span className="qmark">Q</span>
                          {letter.length === 1 ? <span className="question">{list.question}</span> : <span className="question" dangerouslySetInnerHTML={{__html: letter}}></span>}
                          <span className={`arrow ${selectedFaqIdx === list.faqIdx ? 'up' : 'down'}`}></span>                      
                        </div>
                        {
                          selectedFaqIdx === list.faqIdx && 
                          <div className="answerArea">
                            <p dangerouslySetInnerHTML={{__html: answer}}></p>
                          </div>
                        }                    
                      </div>
                    )
                  })
                }            
              </div>
            </div>
        }
        {
          accountList.length > 0 &&
            <div className="faqSection">
              <div className="faqTitle">계정</div>
              <div className="faqWrap">
                {
                  accountList.map((list, index) => {
                    const {question} = list
                    let letter = ''
                    if (searchText !== '') {
                      letter = question.split(searchText).join('<span>' + searchText + '</span>')
                    } else {
                      letter = question
                    }
                    return (
                      <div className="faqList" key={index} onClick={() => answerActive(list.faqIdx)}>
                        <div className="questionArea">
                          <span className="qmark">Q</span>
                          {letter.length === 1 ? <span className="question">{list.question}</span> : <span className="question" dangerouslySetInnerHTML={{__html: letter}}></span>}
                          <span className={`arrow ${selectedFaqIdx === list.faqIdx ? 'up' : 'down'}`}></span>                      
                        </div>
                        {
                          selectedFaqIdx === list.faqIdx && 
                          <div className="answerArea">
                            <p dangerouslySetInnerHTML={{__html: answer}}></p>
                          </div>
                        }                    
                      </div>
                    )
                  })
                }            
              </div>
            </div>
        }
        {
          otherList.length > 0 &&
            <div className="faqSection">
              <div className="faqTitle">기타</div>
              <div className="faqWrap">
                {
                  otherList.map((list, index) => {
                    const {question} = list
                    let letter = ''
                    if (searchText !== '') {
                      letter = question.split(searchText).join('<span>' + searchText + '</span>')
                    } else {
                      letter = question
                    }
                    return (
                      <div className="faqList" key={index} onClick={() => answerActive(list.faqIdx)}>
                        <div className="questionArea">
                          <span className="qmark">Q</span>
                          {letter.length === 1 ? <span className="question">{list.question}</span> : <span className="question" dangerouslySetInnerHTML={{__html: letter}}></span>}
                          <span className={`arrow ${selectedFaqIdx === list.faqIdx ? 'up' : 'down'}`}></span>                      
                        </div>
                        {
                          selectedFaqIdx === list.faqIdx && 
                          <div className="answerArea">
                            <p dangerouslySetInnerHTML={{__html: answer}}></p>
                          </div>
                        }                    
                      </div>
                    )
                  })
                }            
              </div>
            </div>
        }        
      </div>
    </div>
  )
}

export default Faq
