/**
 * @file /mypage/content/fan-board.js
 * @brief 마이페이지 팬보드
 */

import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'

// context
import {Context} from 'context'

//layout
import {WIDTH_PC, WIDTH_TABLET} from 'context/config'

export default props => {
  const ctx = useContext(Context)
  const {profile} = ctx
  const placeholderText = '팬 보드에 글을 남겨주세요. 타인에게 불쾌감을 주는 욕설 또는 비하글은 이용약관 및 관련 법률에 의해 제재를 받을 수 있습니다.'

  return (
    <FanBoard className="fanboard">
      <WriteArea>
        <WriteAreaTop>
          <OwnPhoto style={{backgroundImage: `url(${profile.profImg['thumb62x62']})`}} />
          <div style={{fontSize: '16px', letterSpacing: '-0.4px', marginLeft: '10px', fontFamily: 'NanumSquareB'}}>{profile.nickNm}</div>
        </WriteAreaTop>
        <Textarea placeholder={placeholderText} />
        <WriteAreaBottom>
          <TextCount>10 / 200</TextCount>
          <CommentSubmitBtn>등록</CommentSubmitBtn>
        </WriteAreaBottom>
      </WriteArea>
      <ListArea>
        <ListTitle>
          <span>게시글</span>
          <span style={{marginLeft: '4px', fontFamily: 'NanumSquareEB', fontWeight: 'bold'}}>362</span>
        </ListTitle>
      </ListArea>
    </FanBoard>
  )
}

const ListTitle = styled.div`
  font-size: 16px;
  color: #616161;
  padding-bottom: 16px;
  letter-spacing: -0.4px;
  border-bottom: 1px solid #bdbdbd;

  & > span {
    vertical-align: center;
  }
`

const ListArea = styled.div`
  margin: 30px 0;
`

const CommentSubmitBtn = styled.button`
  width: 92px;
  text-align: center;
  font-size: 16px;
  color: #fff;
  padding: 16px 0;
  background-color: #8556f6;
`

const TextCount = styled.div`
  width: calc(100% - 92px);
  font-size: 14px;
  padding: 17px 20px;
  height: 50px;
  box-sizing: border-box;
  border-top: 1px solid #d0d0d0;
`

const WriteAreaBottom = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const Textarea = styled.textarea`
  display: block;
  width: 100%;
  height: 50px;
  padding: 8px;
  resize: none;
  font-family: inherit;
  box-sizing: border-box;
  padding: 18px 20px;

  &::placeholder {
    color: #bdbdbd;
    font-size: 14px;
    letter-spacing: -0.35px;
  }

  &:focus {
    outline: none;
  }
`

const OwnPhoto = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
`

const WriteAreaTop = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 20px 0 20px;
`

const WriteArea = styled.div`
  border: 1px solid #d0d0d0;
`

const FanBoard = styled.div``
