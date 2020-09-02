/**
 * @file /mypage/content/my-profile.js
 * @brief 마이페이지 상단에 보이는 내 프로필 component
 */
import React, {useContext} from 'react'
import {Context} from 'context'

import ProfileDetail from './profile_detail'

const myProfile = (props) => {
  const {webview, profile, locHash} = props
  //context
  const context = useContext(Context)
  const myProfileNo = context.profile.memNo
  if (myProfileNo === profile.memNo) return null
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
