import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import {IMG_SERVER} from 'context/config'

// global components
import ListColumn from 'components/ui/listColumn/ListColumn'

const ClipSection = (props) => {
  //context
  const context = useContext(Context)
  const {token, profile} = context

  const data = profile

  return (
    <div className="clipSection">
      <div className="subArea">
        <div className="title">내클립</div>
        <button className='filter'>최신순</button>
      </div>
      <div className="clipContent">
        <ListColumn photo={data.profImg.thumb336x336}>
          <div className="title">제목</div>
          <div className="info">
            <i className='like'></i>
            <span>123</span>
            <i className='comment'></i>
            <span>321</span>
          </div>
        </ListColumn>
        <ListColumn photo={data.profImg.thumb336x336}>
          <div className="title">제목</div>
          <div className="info">
            <i className='like'></i>
            <span>123</span>
            <i className='comment'></i>
            <span>321</span>
          </div>
        </ListColumn>
        <ListColumn photo={data.profImg.thumb336x336}>
          <div className="title">제목</div>
          <div className="info">
            <i className='like'></i>
            <span>123</span>
            <i className='comment'></i>
            <span>321</span>
          </div>
        </ListColumn>
      </div>
    </div>
  )
}

export default ClipSection
