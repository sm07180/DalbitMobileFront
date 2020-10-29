import React, {useState, useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'
import Utility from 'components/lib/utility'

import './detail.scss'
import {Context} from "context";
export default function Detail() {
  const history = useHistory()
  if (history.action === 'POP') {
    history.goBack()
  }
  const {faqIdx, question} = history.location.state
  const [faqDetail, setFaqDetail] = useState(false)
  const context = useContext(Context)

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

  const contentsClicked = (event) => {
    Utility.contentClickEvent(event, context)
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
            onClick={contentsClicked}></p>
        )}
      </div>
      <span className="faqDetail__buttonWrap">
        <button onClick={routeingBack}>목록보기</button>
      </span>
    </div>
  )
}
