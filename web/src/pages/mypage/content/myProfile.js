/**
 * @file /mypage/content/my-profile.js
 * @brief 마이페이지 상단에 보이는 내 프로필 component
 */
import React, {useContext, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import ProfileDetail from './profile_detail'

const myProfile = (props) => {
  const {webview, profile, locHash} = props

  let history = useHistory()
  //context
  const context = useContext(Context)
  const myProfileNo = context.profile.memNo
  // console.log(profile, myProfileNo, profile.memNo)

  // loading
  if (profile === null) {
    return <div style={{minHeight: '300px'}}></div>
  }

  return (
    <>
      <div className="profile-info" webview={webview}>
        <ProfileDetail {...props} />
      </div>
    </>
  )
}
export default myProfile
