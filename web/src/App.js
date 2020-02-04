/**
 * @file App.js
 * @brief React실행시토큰검증및 필수작업
 * @notice
 */
import React, {useContext} from 'react'

//context
import {Context} from 'context'
/*-Route-*/
import Route from './Route'

export default () => {
  //context
  const context = useContext(Context)

  const obj = {
    locale: 'KR',
    deviceId: '5E5D8EE5-FC84-40BE-84D7-73598ABC9FEB',
    os: '2',
    language: 'ko',
    deviceToken: 'd6ZW5ZHyEUI9qVeLhXyItO:APA91bH4hFV0H4pWv6CIvT2LAUVwfiHKeVos0rbSZE8x4DTmkbxns9XwP6f3t_qXEkaHWxvJtpO6hTAaNzFtY59l5pG1Rv_Rt0zBD5C1paVnrgFavJOGBgeUJ2rDsElEPI9deFVsj2WV'
  }
  console.log(JSON.stringify(obj))
  //---------------------------------------------------------------------방송관련

  return <Route />
}
