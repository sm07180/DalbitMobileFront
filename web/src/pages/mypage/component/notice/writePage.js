import React from 'react'
import styled from 'styled-components'

export default props => {
  return (
    <WritePage>
      <Title>공지사항 작성</Title>
      <TitleInput placeholder="글의 제목을 입력하세요." />
      <ContentInput placeholder="작성하고자 하는 글의 내용을 입력해주세요. (최대 10줄)" />
    </WritePage>
  )
}

const ContentInput = styled.textarea`
  color: #616161;
  font-size: 16px;
  letter-spacing: -0.4px;
  border: 1px solid #e0e0e0;
  resize: none;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;

  &::placeholder {
    color: #bdbdbd;
    font-size: 14px;
    letter-spacing: -0.35px;
  }

  &:focus {
    outline: none;
  }
`

const TitleInput = styled.input.attrs({type: 'text'})`
  color: #616161;
  font-size: 16px;
  letter-spacing: -0.4px;
  border: 1px solid #e0e0e0;
`

const Title = styled.div`
  color: #000;
  font-size: 18px;
  letter-spacing: -0.45px;
`

const WritePage = styled.div`
  background-color: #f8f8f8;
`
