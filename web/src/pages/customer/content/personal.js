/**
 * @file notice.js
 * @brief 공지사항탭 컨텐츠
 *
 */
import React, {useState, useContext} from 'react'
//styled-component
import styled from 'styled-components'
import {COLOR_MAIN} from 'context/color'
//hooks
import useClick from 'components/hooks/useClick'
import useChange from 'components/hooks/useChange'
//context
import {IMG_SERVER} from 'context/config'
import {Context} from 'context'
import {WIDTH_MOBILE, WIDTH_TABLET} from 'context/config'
//
export default props => {
  //--------------------------------------------------------------------------
  //context

  //hooks
  const cancel = useClick(update, {cancel: '취소'})
  const submit = useClick(update, {submit: '문의하기'})
  const {changes, setChanges, onChange} = useChange(update, {onChange: -1})
  //useState
  const [isOpen, setIsOpen] = useState(false)
  //--------------------------------------------------------------------------

  //update
  function update(mode) {
    switch (true) {
      case mode.cancel !== undefined: //------------------------------취소
        alert('취소')
        break
      case mode.submit !== undefined: //------------------------------문의하기
        alert(JSON.stringify(changes, null, 1))
        break
      case mode.onChange !== undefined: //------------------------------상태변화
        //  console.log(JSON.stringify(changes))
        break
    }
  }
  // input file에서 이미지 업로드했을때 파일객체 dataURL로 값 셋팅
  function uploadSingleFile(e) {
    let reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload = function() {
      // console.log('reader', reader)
      // console.log('reader.', reader.result)
      if (reader.result) {
        setChanges({
          ...changes,
          image: reader.result
        })
      } else {
      }
    }
  }
  //--------------------------------------------------------------------------
  return (
    <Content>
      <dl>
        <dt>문의 유형 선택</dt>
        <dd>
          <SelectBox className={isOpen ? 'on' : ''}>
            <div className="wrap">
              <label htmlFor="allTerm">선택하세요</label>
              <button
                className={isOpen ? 'on' : 'off'}
                onClick={() => {
                  setIsOpen(!isOpen)
                }}>
                펼치기
              </button>
            </div>
            <button>1</button>
            <button>1</button>
            <button>1</button>
          </SelectBox>
        </dd>
      </dl>
      <dl>
        <dt>E-mail</dt>
        <dd>
          <input type="text" placeholder="이메일 주소" name="email" onChange={onChange} />
        </dd>
        <dd>
          <p>※ 1:1 문의 답변은 입력하신 E-mail주소로 발송 됩니다.</p>
        </dd>
      </dl>
      <dl>
        <dt>제목</dt>
        <dd>
          <input type="text" placeholder="내용을 입력해 주세요." name="title" onChange={onChange} />
        </dd>
      </dl>
      <dl>
        <dt>내용</dt>
        <dd>
          <textarea name="" id="" cols="30" rows="10" placeholder="내용을 입력해 주세요." name="content" onChange={onChange} />
        </dd>
      </dl>
      <dl>
        <dt>첨부파일</dt>
        <dd>
          {/* 이미지첨부파일 */}
          <ImgUploader>
            <input id="imgUploadTxt" type="text" placeholder="파일선택" value={changes.image} />
            <label htmlFor="imgUpload">
              <span>찾아보기</span>
            </label>
            <input
              type="file"
              name="imgUpload"
              id="imgUpload"
              accept=".gif, .jpg, .png"
              onChange={e => {
                uploadSingleFile(e)
              }}
            />
          </ImgUploader>

          <p>※ gif, jpg, png, pdf 파일을 합계최대 10MB까지 첨부 가능합니다.</p>
        </dd>
      </dl>
      <div className="in_wrap">
        <button {...cancel} className="cancel">
          취소
        </button>
        <button {...submit} className="submit">
          문의하기
        </button>
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
    font-size: 14px;
    font-family: inherit;
    font-size: inherit;
    border: solid 1px #e0e0e0;
    background-color: #ffffff;
    box-sizing: border-box;
  }
`
const SelectBox = styled.div`
  width: 354px;
  overflow: hidden;
  position: relative;
  height: 52px;
  border: 1px solid #e0e0e0;
  transition: height 0.5s ease-in-out;
  &.on {
    /* 높이조절 */
    height: 253px;
  }
  .wrap {
    position: relative;
    & input {
      position: relative;
      width: 24px;
      height: 24px;
      margin: 0 15px 0 0;
      appearance: none;
      border: none;
      outline: none;
      /* cursor: pointer; */
      background: #fff url(${IMG_SERVER}/images/api/ico-checkbox-off.png) no-repeat center center / cover;
      &:checked {
        background: #8556f6 url(${IMG_SERVER}/images/api/ico-checkbox-on.png) no-repeat center center / cover;
      }
      &:after {
        position: absolute;
        top: 20px;
        right: 8px;
        color: #bdbdbd;
        font-size: 12px;
        font-weight: 600;
      }
    }
    * {
      line-height: 24px;
      vertical-align: top;
    }
    button {
      position: absolute;
      right: 13px;
      top: 13px;
      width: 24px;
      height: 24px;
      text-indent: -9999px;
    }

    label {
      display: inline-block;
      transform: skew(-0.03deg);
    }
  }
  & > div:first-child > button {
    background: url(${IMG_SERVER}/svg/ico_check_wrap.svg) no-repeat center;
    transform: rotate(180deg);
    /* transition: transform 0.3s ease-in-out; */

    &.on {
      transform: rotate(0deg);
    }
  }
  & > div:first-child {
    padding: 13px;
  }
`
const ImgUploader = styled.div`
  position: relative;
  width: 100%;
  padding-right: 130px;
  box-sizing: border-box;
  text-align: left;
  #imgUpload {
    display: none;
  }

  #imgUploadTxt {
    display: block;
  }
  label {
    position: absolute;
    top: 5px;
    right: 0;
    display: inline-block;
    padding: 9px 25px;
    color: ${COLOR_MAIN};
    border-radius: 8px;
    border: 1px solid ${COLOR_MAIN};
  }
`
