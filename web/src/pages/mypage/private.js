import React, {useState, useContext, useEffect} from 'react'
import styled from 'styled-components'

//layout

import Api from 'context/api'

import {Context} from 'context'

export default props => {
  const ctx = useContext(Context)
  const {memNo} = props.match.params
  const {profile} = ctx

  useEffect(() => {
    ;(async () => {
      if (!ctx.profile) {
        const profileInfo = await Api.profile({params: {type: 'private', memNo: memNo}})
        ctx.action.updateProfile(profileInfo.data)
      }
    })()
  }, [])

  if (profile) {
    console.log(profile)
    return (
      <PrivatePage>
        <img src={profile.profImg['thumb80x80']} />
        <div>{profile.nickNm}</div>
        <div>fan{profile.fanCnt}</div>
        <div>star{profile.starCnt}</div>
      </PrivatePage>
    )
  } else {
    return <div></div>
  }
}

const PrivatePage = styled.div`
  width: 400px;
  margin: 0 auto;
`
