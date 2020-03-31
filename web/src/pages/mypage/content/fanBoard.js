/**
 * @file /mypage/content/fan-board.js
 * @brief 마이페이지 팬보드
 */

import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'

// context
import {Context} from 'context'
import Api from 'context/api'

//layout
import {WIDTH_PC, WIDTH_TABLET, IMG_SERVER} from 'context/config'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P, PHOTO_SERVER} from 'context/color'
export default props => {
  const ctx = useContext(Context)
  const context = useContext(Context)
  const {profile} = ctx
  const placeholderText =
    '팬 보드에 글을 남겨주세요. 타인에게 불쾌감을 주는 욕설 또는 비하글은 이용약관 및 관련 법률에 의해 제재를 받을 수 있습니다.'
  //state
  const [comment, setComment] = useState('')
  const MaxCommentLength = 200
  const [fanTotal, setFanTotal] = useState([])
  //api
  async function fetchDataList() {
    const res = await Api.mypage_fanboard_list({
      params: {
        memNo: profile.memNo,
        page: 1,
        records: 1000
      }
    })
    if (res.result === 'success') {
      console.log(res)
      setFanTotal(res.data.list)
    } else if (res.result === 'fail') {
      console.log(res)
    }
  }

  async function fetchDataUpload() {
    const res = await Api.mypage_fanboard_upload({
      data: {
        memNo: profile.memNo,
        depth: 1,
        content: comment
      }
    })
    if (res.result === 'success') {
      console.log(res)
    } else if (res.result === 'fail') {
      console.log(res)
    }
  }

  useEffect(() => {
    fetchDataList()
  }, [])
  /////////////////////
  const commentSubmit = () => {}
  const submitClick = () => {
    commentSubmit()
    fetchDataUpload()
  }

  const textChange = e => {
    const defaultHeight = 36
    const lineBreakHeight = 14
    const target = e.currentTarget
    const lineBreakLenght = target.value.split('\n').length

    if (target.value.length > MaxCommentLength) return
    setComment(target.value)

    if (lineBreakLenght >= 2) {
      target.style.height = `${lineBreakHeight * lineBreakLenght + defaultHeight}px`
    } else {
      target.style.height = `${2 * lineBreakHeight + defaultHeight}px`
    }
  }

  return (
    <FanBoard className="fanboard">
      <WriteArea>
        <WriteAreaTop>
          <OwnPhoto style={{backgroundImage: `url(${profile.profImg['thumb62x62']})`}} />
          <div style={{fontSize: '16px', letterSpacing: '-0.4px', marginLeft: '10px', fontFamily: 'NanumSquareB'}}>
            {profile.nickNm}
          </div>
        </WriteAreaTop>
        <Textarea placeholder={placeholderText} onChange={textChange} value={comment} />
        <WriteAreaBottom>
          <TextCount>
            <span style={{color: '#424242'}}>{`${comment.length}`}</span>
            <span style={{color: '#9e9e9e'}}>{` / ${MaxCommentLength}`}</span>
          </TextCount>
          <CommentSubmitBtn onClick={submitClick}>등록</CommentSubmitBtn>
        </WriteAreaBottom>
      </WriteArea>
      <ListArea>
        <ListTitle>
          <span>게시글</span>
          <span style={{marginLeft: '4px', fontFamily: 'NanumSquareEB', fontWeight: 'bold'}}>{fanTotal.length}</span>
        </ListTitle>
        {fanTotal.map((item, index) => {
          const {profImg, nickNm, writeDt, writerNo, contents, replyCnt} = item
          return (
            <CommentBox key={index}>
              <div className="titlewrap">
                <Imgbox bg={profImg.thumb62x62} />
                <div>
                  <span>{nickNm}</span>
                  <span>{writerNo}</span>
                  <span>{writeDt}</span>
                </div>
                <button></button>
              </div>
              <div className="content">{contents}</div>
              <button className="reply">
                답글 <span>{replyCnt}</span>
              </button>
            </CommentBox>
          )
        })}
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
  border-top: 1px solid #ededed;
  border-bottom: 1px solid #d0d0d0;
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
  height: 64px;
  resize: none;
  font-family: inherit;
  padding: 18px 20px;
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
  border-bottom: none;
`
//mother
const FanBoard = styled.div`
  margin-top: 48px;
`
const CommentBox = styled.div`
  width: 100%;
  border-bottom: 1px solid #eeeeee;
  & .titlewrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    div:nth-child(2) {
      display: flex;
      flex-wrap: wrap;
      width: calc(100% - 88px);
      span:nth-child(1) {
        display: block;
        max-width: 60.56%;
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #424242;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: -0.35px;
        transform: skew(-0.03deg);
        line-height: 1.43;
        margin-right: 4px;
      }
      span:nth-child(2) {
        display: block;
        width: calc(39.44% - 4px);
        color: ${COLOR_MAIN};
        font-size: 12px;
        line-height: 1.8;
        letter-spacing: -0.03px;
        transform: skew(-0.03deg);
      }
      span:nth-child(3) {
        display: block;
        width: 100%;
        margin-top: 6px;
        color: #9e9e9e;
        font-size: 12px;
        letter-spacing: -0.3px;
        transform: skew(-0.03deg);
      }
    }

    button {
      display: block;
      width: 36px;
      height: 36px;
      background: url(${IMG_SERVER}/images/api/ic_more.png) no-repeat center center / cover;
    }
  }
  .content {
    width: 100%;
    margin: 16px 0;
    font-size: 14px;
    color: #424242;
    line-height: 1.57;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
  }
  .reply {
    display: block;
    width: 61px;
    height: 28px;
    margin-bottom: 12px;
    border: solid 1px #e0e0e0;
    font-size: 14px;
    color: #424242;
    transform: skew(-0.03deg);
    > span {
      color: ${COLOR_MAIN};
    }
  }
`
const Imgbox = styled.div`
  width: 32px;
  height: 32px;
  background: url(${props => props.bg}) no-repeat center center / cover;
`
