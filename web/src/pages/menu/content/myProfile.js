/**
 * @file /mypage/content/my-profile.js
 * @brief 2.5v 마이페이지 상단에 보이는 내 프로필 component.
 */
import React, {useContext} from 'react'
import ProfileDetail from '../../mypage/content/profile_detail'

const myProfile = (props) => {
  const {webview, profile} = props
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
