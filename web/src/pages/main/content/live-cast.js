/**
 * @file /content/context-list.js
 * @brief 메인 라이브, 캐스트 리스트 component
 */
import React from 'react'
import styled from 'styled-components'
import Select from '../../../components/ui/select'

//context
import {WIDTH_TABLET} from 'Context/config'

//components
const SelectInfo = {
  id: '1',
  selectName: '셀렉트네임',
  option1: '인기순',
  option2: '좋아요수',
  option3: '시청자수'
}

export default props => {
  return (
    <>
      <p>메인 라이브, 캐스트 리스트</p>
      <Select Info={SelectInfo} />
    </>
  )
}
