/**
 * @file 1:1문의
 * @brief 1:1 문의
 *
 */
import React, {useState, useContext, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
//styled-component
import styled from 'styled-components'
import {COLOR_MAIN} from 'context/color'
//hooks
import useClick from 'components/hooks/useClick'
import useChange from 'components/hooks/useChange'
//context
import Api from 'context/api'
import {IMG_SERVER, WIDTH_PC, WIDTH_MOBILE} from 'context/config'
import {Context} from 'context'
//ui
import SelectBoxs from 'components/ui/selectBox.js'
export default props => {
  const [faqNum, setfaqNum] = useState('')
  const selectBoxData = [
    {value: 0, text: '선택하세요'},
    {value: 1, text: '회원정보'},
    {value: 2, text: '방송'},
    {value: 3, text: '청취'},
    {value: 4, text: '결제'},
    {value: 5, text: '건의'},
    {value: 6, text: '장애/버그'},
    {value: 7, text: '선물/아이'}
  ]
  //--------------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const history = useHistory()
  //hooks
  const dropDown1 = useClick(update, {downDown: 1, questionName: '회원정보'}) //회원정보
  const dropDown2 = useClick(update, {downDown: 2, questionName: '방송'}) //방송
  const dropDown3 = useClick(update, {downDown: 3, questionName: '청취'}) //청취
  const dropDown4 = useClick(update, {downDown: 4, questionName: '결제'}) //결제
  const dropDown5 = useClick(update, {downDown: 5, questionName: '건의'}) //건의
  const dropDown6 = useClick(update, {downDown: 6, questionName: '장애/버그'}) //장애/버그
  const dropDown7 = useClick(update, {downDown: 7, questionName: '선물/아이'}) //선물/아이
  //
  const cancel = useClick(update, {cancel: '취소'})
  const submit = useClick(update, {submit: '문의하기'})
  const {changes, setChanges, onChange} = useChange(update, {questionName: '선택하세요', onChange: -1})
  //useState
  const [isOpen, setIsOpen] = useState(false)
  //--------------------------------------------------------------------------
  //fetch
  async function fetchData(obj) {
    console.log(JSON.stringify(obj, null, 1))
    const res = await Api.center_qna_add({...obj})
    if (res.result === 'fail') {
      context.action.alert({
        title: res.messageKey,
        msg: res.message
      })
    } else if (res.result === 'success') {
      context.action.alert({
        msg: res.message
      })
    }
    console.log(res)
  }
  //update
  function update(mode) {
    switch (true) {
      case mode.cancel !== undefined: //------------------------------취소
        context.action.alert({
          msg: '취소되었습니다.'
        })
        break
      case mode.submit !== undefined: //------------------------------문의하기
        fetchData({data: changes})
        break
      case mode.onChange !== undefined: //----------------------------상태변화
        //console.log(JSON.stringify(changes))
        break
      case mode.downDown !== undefined: //----------------------------문의유형선택
        setIsOpen(false)
        setChanges({
          ...changes,
          qnaType: mode.downDown,
          questionName: mode.questionName
        })
        break
    }
  }
  // input file에서 이미지 업로드했을때 파일객체 dataURL로 값 셋팅
  function uploadSingleFile(e) {
    const target = e.currentTarget
    let reader = new FileReader()
    const file = target.files[0]
    const fileName = file.name
    const fileSplited = fileName.split('.')
    const fileExtension = fileSplited.pop()
    //
    const extValidator = ext => {
      const list = ['jpg', 'jpeg', 'png']
      return list.includes(ext)
    }
    if (!extValidator(fileExtension)) {
      return context.action.alert({
        msg: 'jpg, png 이미지만 사용 가능합니다.',
        title: '',
        callback: () => {
          context.action.alert({visible: false})
        }
      })
    }
    reader.readAsDataURL(target.files[0])
    reader.onload = async () => {
      if (reader.result) {
        const res = await Api.image_upload({
          data: {
            dataURL: reader.result,
            uploadType: 'qna'
          }
        })
        if (res.result === 'success') {
          setChanges({
            ...changes,
            questionFile: res.data.path
          })
        } else {
          context.action.alert({
            msg: '사진 업로드에 실패하였습니다.\n다시 시도해주세요.',
            title: '',
            callback: () => {
              context.action.alert({visible: false})
            }
          })
        }
      }
    }
  }
  //set type select
  const setType = value => {}
  //
  //useEffect
  useEffect(() => {}, [])
  //--------------------------------------------------------------------------
  return (
    <Content
      onClick={() => {
        setIsOpen(!isOpen)
      }}>
      <dl>
        <dt>문의 유형 선택</dt>
        <dd>
          {/* <SelectBox className={isOpen ? 'on' : ''}>
            <div className="wrap">
              <label htmlFor="allTerm">{changes.questionName}</label>
              <button
                className={isOpen ? 'on' : 'off'}
                onClick={() => {
                  setIsOpen(!isOpen)
                }}>
                펼치기
              </button>
            </div> */}
          {/* DropDown메뉴 */}
          {/* <div className="dropDown">
              <a href="#1" {...dropDown1}>
                회원정보
              </a>
              <a href="#2" {...dropDown2}>
                방송
              </a>
              <a href="#3" {...dropDown3}>
                청취
              </a>
              <a href="#4" {...dropDown4}>
                결제
              </a>
              <a href="#5" {...dropDown5}>
                건의
              </a>
              <a href="#6" {...dropDown6}>
                장애/버그
              </a>
              <a href="#7" {...dropDown7}>
                선물/아이
              </a>
            </div>
          </SelectBox> */}
          <Select
            className={isOpen ? 'on' : 'off'}
            onClick={() => {
              setIsOpen(!isOpen)
            }}>
            <div className="selectwrap">
              <SelectBoxs boxList={selectBoxData} onChangeEvent={setType} inlineStyling={{right: 0, top: 0}} />
            </div>
          </Select>
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
          <textarea name="" id="" cols="30" rows="10" placeholder="내용을 입력해 주세요." name="contents" onChange={onChange} />
        </dd>
      </dl>
      <dl>
        <dt>첨부파일</dt>
        <dd>
          {/* 이미지첨부파일 */}
          <ImgUploader>
            <input id="imgUploadTxt" type="text" placeholder="파일선택" value={changes.questionFile} />
            <label htmlFor="imgUpload">
              <span>찾아보기</span>
            </label>
            <input
              type="file"
              name="imgUpload"
              id="imgUpload"
              accept="image/jpg, image/jpeg, image/png"
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
  & .selectwrap {
    position: relative;
    & > div:nth-child(1) {
      position: relative;
    }
    & > div {
      width: 328px;
    }
    & > div > div {
      width: 328px;
      color: #616161;
      border-color: #e0e0e0 !important;

      :after {
        background-color: #e0e0e0;
      }
      :before {
        background-color: #e0e0e0;
      }
    }
  }
  & > {
  }
`
const Select = styled.div`
  width: 328px;
  overflow: hidden;
  position: relative;
  height: 52px;
  transition: height 0.5s ease-in-out;
  z-index: 12;
  &.on {
    /* 높이조절 */
    height: 378px;
  }
`

const SelectBox = styled.div`
  width: 200px;
  overflow: hidden;
  position: relative;
  height: 52px;
  border: 1px solid #e0e0e0;
  transition: height 0.5s ease-in-out;
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 100%;
  }
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
    height: 274px;
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
