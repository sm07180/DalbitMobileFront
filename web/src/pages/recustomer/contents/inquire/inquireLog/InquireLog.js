import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'
import ListNone from 'components/ui/listNone/ListNone'

// components
import './inquireLog.scss'

const InquireLog = () => { 
  let history = useHistory()
  const [inquireLogList , setInquireLogList] = useState([]);

  async function fetchInquireLog() {
    const res = await Api.center_qna_list({
      params: {
        page: 1,
        records: 100
      }
    })
    if (res.result === 'success') {
      if (res.data.list.length !== 0) {
        setInquireLogList(res.data.list)
      }
    }
  }

  const timeFormat = (writeDt) => {
    let date = writeDt.slice(0, 8)
    date = [date.slice(2, 4), date.slice(4, 6), date.slice(6)].join('.')
    return `${date}`
  }

  const golink = (path) => {
    history.push("/customer/inquire/" + path);
  }

  useEffect(() => {
    fetchInquireLog()
  }, [])

  return (
    <div id='inquireLog'>
      {
        inquireLogList.length > 0 ? 
          <div className='inquireLogWrap'>
            {
              inquireLogList.map((list, index) => {
                return (
                  <div className='inquireLogList' key={index} onClick={() => golink(list.qnaIdx)}>
                    <div className='inquireLogState'>
                      {list.state === 1 ? <span className='complete'>답변완료</span> : <span className='ing'>답변중</span>}
                    </div>
                    <div className='inquireLogTitle'>
                      {list.title}
                    </div>
                    <div className='inquireLogDate'>
                      {timeFormat(list.writeDt)}
                    </div>
                  </div>
                )
              })
            }
          </div>
        :
          <ListNone text="문의 내역이 없어요." height="375px"/>
      }      
    </div>
  )
}

export default InquireLog
