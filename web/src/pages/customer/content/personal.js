/**
 * @file notice.js
 * @brief 공지사항탭 컨텐츠
 *
 */
import React, {useState, useRef} from 'react'
//styled-component
import styled from 'styled-components'
import {COLOR_MAIN} from 'context/color'

//context
//component

export default props => {
  return (
    <Content>
      <dl>
        <dt>문의 유형 선택</dt>
        {/* 문의 유형 선택// */}
        <dd></dd>
      </dl>
      <dl>
        <dt>E-mail</dt>
        {/* E-mail */}
        <dd>
          <input type="text" placeholder="이메일 주소" />
        </dd>
        <dd>
          <p>※ 1:1 문의 답변은 입력하신 E-mail주소로 발송 됩니다.</p>
        </dd>
      </dl>
      <dl>
        <dt>제목</dt>
        {/* 제목// */}
        <dd>
          <input type="text" placeholder="내용을 입력해 주세요." />
        </dd>
      </dl>
      <dl>
        <dt>내용</dt>
        {/* 내용// */}
        <dd>
          <textarea name="" id="" cols="30" rows="10" value="12" placeholder="내용을 입력해 주세요." />
        </dd>
      </dl>
      <dl>
        <dt>첨부파일</dt>
        {/* 첨부파일// */}
        <dd>
          <p>
            <input type="file" />
          </p>
          <p>※ gif, jpg, png, pdf 파일을 합계최대 10MB까지 첨부 가능합니다.</p>
        </dd>
      </dl>
      <div className="in_wrap">
        <button className="cancel">취소</button>
        <button className="submit">문의하기</button>
      </div>
    </Content>
  )
}

//style
//----------------------------------------------------------------------------
const Content = styled.div`
  margin-top: 40px;
  border-top: 1px solid ${COLOR_MAIN};
  .in_wrap {
    display: block;
    margin-top: 40px;
    margin-bottom: 100px;
    text-align: center;
    button {
      display: inline-block;
      width: 144px;
      padding: 16px 0;
      border-radius: 8px;
      border: solid 1px #8556f6;
      background-color: #ffffff;
      margin: 4px;
    }
    .cancel {
      color: ${COLOR_MAIN};
      border: 1px solid ${COLOR_MAIN};
    }
    .submit {
      color: #ffffff;
      background: ${COLOR_MAIN};
    }
  }
  & dl {
    position: relative;
    display: block;
    width: 100%;
    padding: 16px 0;
    border-bottom: 1px solid #e0e0e0;
    dt {
      position: absolute;
      width: 130px;
      font-size: 14px;
      line-height: 1.14;
      letter-spacing: -0.35px;
      text-align: left;
      color: ${COLOR_MAIN};
      transform: skew(-0.03deg);
    }
    dd {
      display: inline-block;
      padding-left: 130px;
      width: 100%;
      transform: skew(-0.03deg);
      p {
        padding: 10px 1px;
        transform: skew(-0.03deg);
      }
    }
  }
  textarea,
  input {
    display: block;
    width: 100%;
    padding: 12px 10px;
    border: solid 1px #e0e0e0;
    background-color: #ffffff;
    box-sizing: border-box;
  }
`
