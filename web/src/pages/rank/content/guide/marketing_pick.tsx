import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'

// api
import { getMarketingDetail } from "common/api";

import '../../../customer/content/notice/detail'
//static

export default function WeekPickDetail() {
  const history = useHistory()

  const weeklyIdx = history.location.search.split('idx=')[1];
  const [detail, setDetail] = useState<any>([]);

  async function getDetailData() {
    const {result, data, message} = await getMarketingDetail({idx: weeklyIdx})
    if(result === 'success') {
      setDetail(data.detail)
    } else {

    }
  }

  useEffect(() => {
    getDetailData()
  }, []);

  return (
      <div className="noticeDetailWrap">
        <div className="noticeDetailWrap__header">
          <div className="noticeDetailWrap__header--title">{detail.title}</div>
          <div className="noticeDetailWrap__header--date">{detail.regDate}</div>
        </div>
        <div className="noticeDetailWrap__contents" dangerouslySetInnerHTML={{__html:detail.contents}}>
        </div>
      </div>
  )
}
