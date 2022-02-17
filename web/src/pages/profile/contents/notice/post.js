import React, {useEffect, useState, useContext, useRef} from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'
// global components
import ListRow from 'components/ui/listRow/ListRow'
// components
import PostDetail from './postDetail'

const Post = (props) => {
  const {data} = props
  const [postInfo, setPostInfo] = useState([]);
  const [postNoticeIdx, setPostNoticeIdx] = useState(0);

  // 조회 API
  const fetchPostInfo = () => {
    Api.notice_list({
      params: {
        noticeType: 0,
        page: 1,
        records: 5 // 9999
      }
    }).then((res) => {
      if (res.result === 'success') {
        setPostInfo(res.data.list)
      }
    })
  }

  // postDetail
  const openDetailPage = (e) => {
    const {targetIdx} = e.currentTarget.dataset

    setPostNoticeIdx(postInfo[targetIdx].noticeIdx)
  }

  useEffect(() => {
    fetchPostInfo()
  },[])

  // 페이지 시작
  return (
    <div className="post">
      {postInfo.map((list,index) => {
        return (
          <div data-target-idx={index} onClick={openDetailPage} key={index}>
            <ListRow photo={data.profImg.thumb88x88}>
              <div className="listContent">
                <div className="title">{list.title}</div>
                <div className="text">내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용</div>
                <div className="date">{list.writeDt.slice(2,8)}</div>
              </div>
              <button className='listViewBtn'></button>
            </ListRow>
          </div>
        )
      })}
      {postNoticeIdx !== 0 && <PostDetail noticeIdx={postNoticeIdx} />}
    </div>
  )
}

export default Post
