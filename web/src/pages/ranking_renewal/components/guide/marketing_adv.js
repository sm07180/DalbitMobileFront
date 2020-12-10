import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import {Context} from 'context'

import {IMG_SERVER} from 'context/config'
import '../../../customer/content/notice/detail'
//static

export default function secondDetail() {

  const history = useHistory()
  const context = useContext(Context)
  const secondIdx = history.location.search.split('idx=')[1];
  const [detail, setDetail] = useState([]);

  async function getDetailData() {
    const {result, data, message} = await Api.getMarketingDetail({
      idx: secondIdx
    })
    if(result === 'success') {
      setDetail(data.detail)
    } else {
      context.action.alert({
        msg: message,
      })
    }
  }

  useEffect(() => {
    getDetailData()
  }, []);

  return (
    <>
      <div className="noticeDetailWrap">
        <div className="noticeDetailWrap__header">
          <div className="noticeDetailWrap__header--title">{detail.title}</div>
          <div className="noticeDetailWrap__header--date">{detail.regDate}</div>
        </div>
        <div className="noticeDetailWrap__contents" dangerouslySetInnerHTML={{__html:detail.contents}}>
        </div>
      </div>
    </>
  )
}
