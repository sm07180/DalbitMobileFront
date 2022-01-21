import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import Swiper from 'react-id-swiper'
// components
import SocialList from '../components/socialList'

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
      <SocialList data={data} />
    </div>
  )
}

export default ClipSection
