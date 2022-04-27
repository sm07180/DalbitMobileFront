import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import '../../../customer/content/notice/detail'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";
//static

export default function secondDetail() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()
  const secondIdx = history.location.search.split('idx=')[1];
  const [detail, setDetail] = useState([]);

  async function getDetailData() {
    const {result, data, message} = await Api.getMarketingDetail({
      idx: secondIdx
    })
    if (result === 'success') {
      setDetail(data.detail)
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: message,
      }))
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
