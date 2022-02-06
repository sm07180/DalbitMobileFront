import React, {useEffect, useState, useContext, useRef} from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'
import Utility from 'components/lib/utility'
// global components
import Header from 'components/ui/header/Header'
// components

const PostDetail = (props) => {
  const {noticeIdx} = props
  const [postDetailInfo, setPostDetailInfo] = useState([]);
  
  const fetchPostDetailInfo = () => {
    Api.notice_list_detail({
      params: {
        noticeIdx: noticeIdx
      }
    }).then((res) => {
      if (res.result === 'success') {
        setPostDetailInfo(res.data)
      }
    })
  }

  useEffect(() => {
    fetchPostDetailInfo()
  },[])

  const data = postDetailInfo

  // 페이지 시작
  return (
    <div className="postDetail">
      <Header title={'공지사항'} type={'back'} />
      <section className="detailView">
        <div className="titleWrap">
          <div className="title">{data.title}</div>
          <div className="date">{data.writeDt}</div>
        </div>
        <div className="detailContent">
          <p dangerouslySetInnerHTML={{__html: data.contents}}></p>
        </div>
      </section>
    </div>
  )
}

export default PostDetail
