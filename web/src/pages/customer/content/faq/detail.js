import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'
import Utility from 'components/lib/utility'

import './detail.scss'
export default function Detail() {
  const history = useHistory()
  if (history.action === 'POP') {
    history.goBack()
  }
  const {faqIdx, question} = history.location.state
  const [faqDetail, setFaqDetail] = useState(false)

  async function fetchData() {
    const res = await Api.faq_list_detail({
      params: {
        faqIdx: faqIdx
      }
    })
    if (res.result === 'success') {
      setFaqDetail(res.data)
    } else if (res.result === 'fail') {
    }
  }

  const routeingBack = () => {
    history.goBack()
  }

  useEffect(() => {
    fetchData()
  }, [])
  return (
    <div className="faqDetail">
      <div className="faqDetail__title">{question}</div>
      <div>
        {faqDetail && faqDetail.answer && (
          <p
            dangerouslySetInnerHTML={{__html: faqDetail.answer.replace(/class/gi, 'className')}}
            onClick={Utility.contentClickEvent}></p>
        )}
      </div>
      <span className="faqDetail__buttonWrap">
        <button onClick={routeingBack}>목록보기</button>
      </span>
    </div>
  )
}
