/**
 * @file gnb/index.js
 * @brief 헤더에 포함되는 총 4가지 타입의 gnb영역 render 처리 부분
 */
import React, {useContext} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

//components
import GnbSearch from './search'
import GnbMypage from './mypage'
import GnbNotice from './notice'
import GnbMenu from './menu'

export default props => {
  const NoticeInfo = [
    {id: 1, title: '해롱해롱해요', url: 'https://img.gqkorea.co.kr/gq/2018/12/style_5c1af11a0c4bf.jpg'},
    {id: 2, title: '하늘에서 비가와요~', url: 'https://newsimg.sedaily.com/2019/03/29/1VGS0VWD74_1.jpg'},
    {id: 3, title: '하늘에서 비가와요~', url: 'https://img.gqkorea.co.kr/gq/2018/12/style_5c1af11a0c4bf.jpg'},
    {id: 4, title: '하늘에서 비가와요~', url: 'https://img.gqkorea.co.kr/gq/2018/12/style_5c1af11a0c4bf.jpg'},
    {id: 5, title: '하늘에서 비가와요~', url: 'https://img.gqkorea.co.kr/gq/2018/12/style_5c1af11a0c4bf.jpg'},
    {id: 6, title: '하늘에서 비가와요~', url: 'https://img.gqkorea.co.kr/gq/2018/12/style_5c1af11a0c4bf.jpg'},
    {id: 7, title: '하늘에서 비가와요~', url: 'https://img.gqkorea.co.kr/gq/2018/12/style_5c1af11a0c4bf.jpg'},
    {id: 8, title: '하늘에서 비가와요~', url: 'https://img.gqkorea.co.kr/gq/2018/12/style_5c1af11a0c4bf.jpg'},
    {id: 9, title: '하늘에서 비가와요~', url: 'https://img.gqkorea.co.kr/gq/2018/12/style_5c1af11a0c4bf.jpg'},
    {id: 10, title: '하늘에서 비가와요~', url: 'https://img.gqkorea.co.kr/gq/2018/12/style_5c1af11a0c4bf.jpg'}
  ]
  const MenuInfo = [
    {id: 1, title: '해롱해롱해요', url: 'https://www.city.kr/files/attach/images/164/023/751/004/0370b36693077e678e52244fbadea4d2.jpg'},
    {id: 2, title: '하늘에서 비가와요~', url: 'https://newsimg.sedaily.com/2019/03/29/1VGS0VWD74_1.jpg'},
    {id: 3, title: '하늘에서 비가와요~', url: 'https://img.gqkorea.co.kr/gq/2018/12/style_5c1af11a0c4bf.jpg'},
    {id: 4, title: '하늘에서 비가와요~', url: 'https://img.gqkorea.co.kr/gq/2018/12/style_5c1af11a0c4bf.jpg'},
    {id: 5, title: '하늘에서 비가와요~', url: 'https://img.gqkorea.co.kr/gq/2018/12/style_5c1af11a0c4bf.jpg'},
    {id: 6, title: '하늘에서 비가와요~', url: 'https://img.gqkorea.co.kr/gq/2018/12/style_5c1af11a0c4bf.jpg'},
    {id: 7, title: '하늘에서 비가와요~', url: 'https://img.gqkorea.co.kr/gq/2018/12/style_5c1af11a0c4bf.jpg'},
    {id: 8, title: '하늘에서 비가와요~', url: 'https://img.gqkorea.co.kr/gq/2018/12/style_5c1af11a0c4bf.jpg'},
    {id: 9, title: '하늘에서 비가와요~', url: 'https://img.gqkorea.co.kr/gq/2018/12/style_5c1af11a0c4bf.jpg'},
    {id: 10, title: '하늘에서 비가와요~', url: 'https://img.gqkorea.co.kr/gq/2018/12/style_5c1af11a0c4bf.jpg'}
  ]
  const LoginInfo = {id: 1, name: '내 고유 ID', title: '떠오르는 아침 햇살', url: `${IMG_SERVER}/images/api/profileLogin.png`}

  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)

  //GNB메뉴 타입 4가지 만들기
  function makeGnbType() {
    switch (context.gnb_state) {
      case 'search': //검색
        return <GnbSearch {...props} />
        break
      case 'mypage': //마이페이지
        return <GnbMypage {...props} LoginInfo={LoginInfo} />
        break
      case 'notice': //알람
        return <GnbNotice NoticeInfo={NoticeInfo} />
        break
      case 'menu': //기본 메뉴
        return <GnbMenu {...props} MenuInfo={MenuInfo} />
        break
      default:
        break
    }
    return
  }
  //---------------------------------------------------------------------
  return <>{makeGnbType()}</>
}
//---------------------------------------------------------------------
//styled
