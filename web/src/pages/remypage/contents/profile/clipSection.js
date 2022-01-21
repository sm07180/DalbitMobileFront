import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import {IMG_SERVER} from 'context/config'

// global components
import ListColumn from 'components/ui/listColumn/ListColumn'
// components
import SocialList from '../../components/socialList'

const ClipSection = (props) => {
  //context
  const context = useContext(Context)
  const {token, profile} = context

  const data = profile

  return (
    <div className="clipSection">
      <div className="subArea">
        <div className="title">내클립</div>
        <button>최신순</button>
      </div>
      <div className="clipContent">
        <ListColumn list={data}>
          <div className="title">제목</div>
          <div className="info">
            <i><img src={`${IMG_SERVER}/mypage/dalla/like_icon-w.png`} alt="좋아요" /></i>
            <span>123</span>
            <i><img src={`${IMG_SERVER}/mypage/dalla/comment_icon-w.png`} alt="댓글" /></i>
            <span>321</span>
          </div>
        </ListColumn>
        <ListColumn list={data}>
          <div className="title">제목</div>
          <div className="info">
            <i><img src={`${IMG_SERVER}/mypage/dalla/like_icon-w.png`} alt="좋아요" /></i>
            <span>123</span>
            <i><img src={`${IMG_SERVER}/mypage/dalla/comment_icon-w.png`} alt="댓글" /></i>
            <span>321</span>
          </div>
        </ListColumn>
        <ListColumn list={data}>
          <div className="title">제목</div>
          <div className="info">
            <i><img src={`${IMG_SERVER}/mypage/dalla/like_icon-w.png`} alt="좋아요" /></i>
            <span>123</span>
            <i><img src={`${IMG_SERVER}/mypage/dalla/comment_icon-w.png`} alt="댓글" /></i>
            <span>321</span>
          </div>
        </ListColumn>
      </div>
    </div>
  )
}

export default ClipSection
