/**
 * @file notice.js
 * @brief 공지사항탭 컨텐츠
 *
 */
import React, {useState, useRef} from 'react'
//styled-component
import styled from 'styled-components'
//context
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
//component
import Pagination from './pagination'

export default props => {
  return (
    <>
      {window.location.pathname === '/customer' && <SocketCluster />}
      <Pagination perPage={10} />
    </>
  )
}
//style
//----------------------------------------------------------------------------
//style
//----------------------------------------------------------------------------
const Wrap = styled.div``

const dataSet = [
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '정기점검',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '정기점검',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '정기점검',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '정기점검',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '정기점검',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '정기점검',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '정기점검',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '정기점검',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '정기점검',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '정기점검',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '이벤트',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '이벤트',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '이벤트',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '이벤트',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '이벤트',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  },
  {
    type: '공지사항',
    name: '추천 DJ 신청 접수 안내',
    date: '2020.01.14  11:30'
  }
]
