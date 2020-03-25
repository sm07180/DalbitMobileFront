/**
 * @file notice.js
 * @brief 공지사항탭 컨텐츠
 *
 */
import React, {useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'

//styled-component
import styled from 'styled-components'
import {COLOR_MAIN} from 'context/color'
//hooks
import useClick from 'components/hooks/useClick'
import useChange from 'components/hooks/useChange'
//context
import {IMG_SERVER, WIDTH_PC, WIDTH_MOBILE} from 'context/config'
import {Context} from 'context'
//
export default props => {
  //--------------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const history = useHistory()
  //hooks
  const dropDown1 = useClick(update, {downDown: '기능문의'})
  const dropDown2 = useClick(update, {downDown: '환불문의'})
  const dropDown3 = useClick(update, {downDown: '라이브 방송문의'})
  const dropDown4 = useClick(update, {downDown: '서비스제휴'})
  const dropDown5 = useClick(update, {downDown: '기타'})
  //
  const cancel = useClick(update, {cancel: '취소'})
  const submit = useClick(update, {submit: '문의하기'})
  const {changes, setChanges, onChange} = useChange(update, {type: '선택하세요', onChange: -1})
  //useState
  const [isOpen, setIsOpen] = useState(false)
  //--------------------------------------------------------------------------

  //update
  function update(mode) {
    switch (true) {
      case mode.cancel !== undefined: //------------------------------취소
        context.action.alert({
          msg: '취소되었습니다.'
        })
        break
      case mode.submit !== undefined: //------------------------------문의하기
        context.action.alert({
          msg: '문의내용이 접수되었습니다.\n메인페이지로 이동합니다.',
          callback: () => {
            history.push('/')
          }
        })
        console.log(JSON.stringify(changes, null, 1))
        break
      case mode.onChange !== undefined: //----------------------------상태변화
        console.log(JSON.stringify(changes))
        break
      case mode.downDown !== undefined: //----------------------------문의유형선택
        setIsOpen(false)
        setChanges({
          ...changes,
          type: mode.downDown
        })
        break
    }
  }
  // input file에서 이미지 업로드했을때 파일객체 dataURL로 값 셋팅
  function uploadSingleFile(e) {
    let reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload = function() {
      if (reader.result) {
        setChanges({
          ...changes,
          image: reader.result
        })
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
              <label htmlFor="allTerm">{changes.type}</label>
              <button
                className={isOpen ? 'on' : 'off'}
                onClick={() => {
                  setIsOpen(!isOpen)
                }}>
                펼치기
              </button>
            </div>
            {/* DropDown메뉴 */}
            <div className="dropDown">
              <a href="#1" {...dropDown1}>
                기능문의
              </a>
              <a href="#2" {...dropDown2}>
                환불문의
              </a>
              <a href="#3" {...dropDown3}>
                라이브 방송문의
              </a>
              <a href="#4" {...dropDown4}>
                서비스제휴
              </a>
              <a href="#5" {...dropDown5}>
                기타
              </a>
            </div>
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
      @media (max-width: ${WIDTH_MOBILE}) {
        position: relative;
        display: block;
        width: 100%;
        margin-bottom: 10px;
        font-size: 12px;
      }
    }
    dd {
      display: inline-block;
      padding-left: 130px;
      width: 100%;
      transform: skew(-0.03deg);
      @media (max-width: ${WIDTH_MOBILE}) {
        position: relative;
        display: block;
        padding-left: 0;
        width: 100%;
      }
      p {
        padding: 10px 1px;
        transform: skew(-0.03deg);
        @media (max-width: ${WIDTH_MOBILE}) {
          font-size: 12px;
        }
      }
    }
  }
  textarea,
  input[type='text'] {
    display: block;
    width: 100%;
    padding: 12px 10px;
    font-size: 14px !important;
    font-family: inherit;
    font-size: inherit;
    border: solid 1px #e0e0e0;
    background-color: #ffffff;
    box-sizing: border-box;
  }
`
const SelectBox = styled.div`
  width: 200px;
  overflow: hidden;
  position: relative;
  height: 52px;
  border: 1px solid #e0e0e0;
  transition: height 0.5s ease-in-out;
  .dropDown {
    a {
      display: block;
      font-size: 14px;
      padding: 10px;
      border-top: 1px solid #e0e0e0;
    }
  }
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
      font-size: 14px !important;
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
