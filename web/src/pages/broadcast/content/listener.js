/**
 * @title 404페이지
 */
import React, {useEffect} from 'react'
import styled from 'styled-components'
import Live from './live'
//pages

// import Guide from ' pages/common/layout/guide.js'
const LiveInfo = [
  {
    title: '포근한 아침 라디오입니다.',
    name: '★하늘하늘이에요'
  }
]

export default () => {
  return <Live Info={LiveInfo}></Live>
}
