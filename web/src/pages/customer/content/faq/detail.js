import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'
import Utility from 'components/lib/utility'
import './detail.scss'
import {useDispatch, useSelector} from "react-redux";

export default function Detail() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
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

  const contentsClicked = (event) => {
    Utility.contentClickEvent(event, globalState, dispatch)
  }

  useEffect(() => {
    fetchData()
  }, [])
  return (
    <div className="faqDetail">
      <div className="faqDetail__title">{question}</div>
      <div className="faqDetail__contents">
        {faqDetail && faqDetail.answer && (
          <p dangerouslySetInnerHTML={{__html: faqDetail.answer.replace(/class/gi, 'className')}} onClick={contentsClicked}></p>
        )}
      </div>
      <div className="btnWrap">
        <button className="btn" onClick={routeingBack}>
          목록보기
        </button>
      </div>
    </div>
  )
}
