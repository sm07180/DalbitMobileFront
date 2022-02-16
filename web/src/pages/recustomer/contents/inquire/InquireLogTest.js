import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'
import ListNone from 'components/ui/listNone/ListNone'

// components
import './inquireLog.scss'
import moment from "moment";

const InquireLog = () => {
  const history = useHistory()
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

  const changeDay = (date) => {
    return moment(date, "YYYYMMDDHHmmss").format("YYYY.MM.DD.HH:mm:ss");
  }

  const golink = (e) => {
    const path = e.currentTarget.dataset.idx
    history.push("/customer/inquire/" + path);
  }

  useEffect(() => {
    fetchInquireLog()
  }, [])

  return (
    <div id='inquireLog'>
      {inquireLogList.length > 0 ?
        <div className='inquireLogWrap'>
          {inquireLogList.map((list, index) => {
            return (
              <div className='inquireLogList' key={index} data-Idx={list.qnaIdx} onClick={golink}>
                <div className='inquireLogState'>
                  {list.state === 1 ? <span className='complete'>답변완료</span> : <span className='ing'>답변중</span>}
                </div>
                <div className='inquireLogTitle'>
                  {list.title}
                </div>
                <div className='inquireLogDate'>
                  {changeDay(list.writeDt)}
                </div>
              </div>
            )
          })}
        </div>
        :
        <ListNone imgType="ui02" text="문의 내역이 없어요." height="375px"/>
      }
    </div>
  )
}

export default InquireLog
