/**
 * @file 모바일/1:1문의
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
import {IMG_SERVER, WIDTH_PC, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import {Context} from 'context'
import {CustomerStore} from '../store'
//ui
import SelectBoxs from 'components/ui/selectBox.js'
import MyPersonal from './mypersonal'
// static
const Personal = (props) => {
  const selectBoxData = [
    {value: 0, text: '선택하세요'},
    {value: 1, text: '회원정보'},
    {value: 2, text: '방송'},
    {value: 3, text: '청취'},
    {value: 4, text: '결제'},
    {value: 5, text: '건의'},
    {value: 6, text: '장애/버그'},
    {value: 7, text: '선물/아이템'},
    {value: 99, text: '기타'}
  ]
  //console.log(faqNum)
  //--------------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const history = useHistory()
  const store = useContext(CustomerStore)
  Personal.store = store
  //hooks
  //
  const cancel = useClick(update, {cancel: '취소'})
  const submit = useClick(update, {submit: '문의하기'})

  const {changes, setChanges, onChange, onChangeEvent} = useChange(update, {qnaType: faqNum, onChange: -1})
  const [faqNum, setfaqNum] = useState('')
  const [imgurls, setImgurl] = useState('파일을 첨부할 수 있습니다.')
  //useState

  //--------------------------------------------------------------------------

  //fetch
  async function fetchData(obj) {
    const res = await Api.center_qna_add({...obj})
    if (res.result === 'fail') {
    } else if (res.result === 'success') {
      context.action.confirm({
        msg: '1:1 문의를 등록하시겠습니까?',
        callback: () => {
          //alert
          setTimeout(() => {
            context.action.alert({
              msg: '1:1 문의 등록을 완료하였습니다.',
              callback: () => {
                history.push('/')
              }
            })
          }, 0)
        }
      })
    }
  }
  //update
  function update(mode) {
    switch (true) {
      case mode.cancel !== undefined: //------------------------------취소
        context.action.confirm({
          //콜백처리
          callback: () => {
            window.location.reload()
          },
          //캔슬콜백처리
          cancelCallback: () => {},
          msg: '취소할 경우 작성 내용이 초기화됩니다. 취소하시겠습니까?'
        })
        break
      case mode.submit !== undefined: //------------------------------문의하기
        let submitObj = {data: changes}
        var validationCheck = false
        var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
        if (submitObj.data.qnaType === 0) {
          context.action.alert({
            msg: '문의 유형을 선택해주세요.'
          })
          return false
        } else if (submitObj.data.email === undefined || submitObj.data.email === '') {
          context.action.alert({
            msg: '이메일 주소를 입력해주세요.'
          })
          return false
        } else if (!submitObj.data.email.match(regExp)) {
          context.action.alert({
            msg: '이메일 형식을 확인 후 다시 입력해주세요'
          })
          return false
        } else if (submitObj.data.title === undefined || submitObj.data.title === '') {
          context.action.alert({
            msg: '문의 제목을 입력해주세요.'
          })
          return false
        } else if (submitObj.data.contents === undefined || submitObj.data.contents === '') {
          context.action.alert({
            msg: '문의 내용을 입력해주세요.'
          })
          return false
        } else {
          validationCheck = true
        }
        if (validationCheck) {
          fetchData({data: changes})
        }
        break
      case mode.onChange !== undefined: //----------------------------상태변화
        //console.log(JSON.stringify(changes))
        break
      case onChangeEvent !== undefined: //----------------------------상태변화
        break
    }
  }
  // input file에서 이미지 업로드했을때 파일객체 dataURL로 값 셋팅
  function uploadSingleFile(e) {
    const target = e.currentTarget
    let reader = new FileReader()
    const file = target.files[0]
    if (!file) {
      return
    }

    const fileName = file.name
    const fileSplited = fileName.split('.')
    const fileExtension = fileSplited.pop()
    //
    const extValidator = (ext) => {
      const list = ['jpg', 'jpeg', 'png', 'gif']
      return list.includes(ext)
    }
    if (!extValidator(fileExtension)) {
      return context.action.alert({
        msg: 'gif,jpg, png 이미지만 사용 가능합니다.',
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
  //func 타입체크
  const typeActive = (value) => {
    setfaqNum(value)
  }
  useEffect(() => {
    setChanges({...changes, qnaType: faqNum})
  }, [faqNum])
  useEffect(() => {
    setImgurl('파일을 첨부할 수 있습니다.')
  }, [])

  useEffect(() => {
    if (changes.questionFile !== undefined && imgurls === '파일을 첨부할 수 있습니다.') {
      setImgurl(changes.questionFile)
    } else if (changes.questionFile !== undefined && imgurls !== '파일을 첨부할 수 있습니다.') {
      setImgurl(changes.questionFile)
    }
  }, [changes.questionFile])
  //추가 스테이트
  const [personalType, setPersonalType] = useState(' 1:1 문의 작성')
  const [walletType, setWalletType] = useState(0)

  const [controllState, setcontrollState] = useState(false)

  const changePersonalTypeClick = (type) => {
    setPersonalType(type)
    setWalletType(0)
    setcontrollState(!controllState)
  }

  //--------------------------------------------------------------------------
  return (
    <>
      <div>
        <TitleWrap>
          <PersonalTypeBtn
            className={personalType === ' 1:1 문의 작성' ? 'active' : ''}
            onClick={() => {
              changePersonalTypeClick(' 1:1 문의 작성')
            }}>
            1:1 문의 작성
          </PersonalTypeBtn>
          <PersonalTypeBtn
            className={personalType === '나의 문의 내역' ? 'active' : ''}
            onClick={() => {
              changePersonalTypeClick('나의 문의 내역')
            }}>
            나의 문의내역
          </PersonalTypeBtn>
        </TitleWrap>

        {personalType === ' 1:1 문의 작성' && (
          <Content>
            <dl>
              <dt>문의 유형 선택</dt>
              <Select>
                <SelectBoxs
                  type={'remove-init-data'}
                  boxList={selectBoxData}
                  onChangeEvent={typeActive}
                  inlineStyling={{left: 0, top: 0, zIndex: 8, position: 'static', width: '100%'}}
                />
              </Select>
            </dl>
            <dl>
              <dt>E-mail</dt>
              <dd>
                <input type="text" placeholder="이메일 주소" name="email" onChange={onChange} />
              </dd>
              {/*<dd>
                <p className="infoupload">※ 1:1 문의 답변은 입력한 E-mail로 발송</p>
              </dd>*/}
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
                <textarea
                  name=""
                  id=""
                  cols="30"
                  rows="10"
                  placeholder="내용을 입력해 주세요."
                  name="contents"
                  onChange={onChange}
                />
              </dd>
            </dl>
            <dl>
              <dt>첨부파일</dt>
              <dd>
                {/* 이미지첨부파일 */}

                <ImgUploader>
                  <div className="textinput">
                    <p className="urltext">{imgurls}</p>
                    <input id="imgUploadTxt" type="text" placeholder="파일을 첨부할 수 있습니다." value={changes.questionFile} />
                    <label htmlFor="imgUpload">
                      <span>첨부파일</span>
                    </label>
                    <input
                      type="file"
                      name="imgUpload"
                      id="imgUpload"
                      accept="image/jpg, image/jpeg, image/png"
                      onChange={(e) => {
                        uploadSingleFile(e)
                      }}
                    />
                  </div>
                </ImgUploader>

                <p className="infoupload">※ gif, jpg, png 파일을 최대 10MB까지 첨부</p>
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
        )}
        {personalType === '나의 문의 내역' && <MyPersonal perPage={Store().page} {...props} />}
      </div>
    </>
  )
}
export default Personal
//---------------------------------------------------------------------
/**
 * @title 스토어객체
 */
export const Store = () => {
  return Personal.store
}
//style
//----------------------------------------------------------------------------
const Content = styled.div`
  /* margin-top: 40px; */
  .in_wrap {
    display: block;
    margin-top: 20px;
    margin-bottom: 100px;
    text-align: center;
    button {
      display: inline-block;
      padding: 12px 24px;
      border-radius: 8px;
      border: solid 1px #FF3C7B;
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
    padding-top: 12px;

    :first-child {
      display: flex;
      & dt {
        position: static;
      }
      @media (max-width: ${WIDTH_MOBILE}) {
        flex-wrap: wrap;
      }
    }
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
        margin-bottom: 6px;
      }
    }
    dd {
      position: relative;
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
      .infoupload {
        padding: 6px 0 0 1px;
        color: #616161;
        font-size: 14px;
        transform: skew(-0.03deg);
        letter-spacing: -0.5px;
      }
    }
  }

  textarea,
  input[type='text'] {
    display: block;
    width: 100%;
    padding: 8px 10px;
    font-size: 14px !important;
    font-family: inherit;
    font-size: inherit;
    border: solid 1px #bdbdbd;
    background-color: #ffffff;
    box-sizing: border-box;
  }

  input[type='text']::placeholder,
  textarea::placeholder {
    color: #757575;
  }

  textarea {
    height: 118px;
  }
`
const Select = styled.div`
  height: 36px;
  width: 328px;
  z-index: 8;
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 100%;
  }
  > div {
    width: 100%;
    > div {
      width: 100%;
      border: solid 1px #bdbdbd;

      color: #616161;
      font-size: 14px;
      :before {
        background-color: #757575;
      }
      :after {
        background-color: #757575;
      }
    }
  }
`

const ImgUploader = styled.div`
  position: relative;
  width: 100%;
  padding-right: 80px;
  box-sizing: border-box;
  text-align: left;
  .urltext {
    width: 100%;
    padding: 0 10px;
    background-color: #f5f5f5;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    color: #757575;
    transform: skew(-0.03deg);
    /* padding: 12px 0 12px 10px !important; */
    letter-spacing: -0.42px;
    overflow-x: hidden;
    text-overflow: ellipsis;
    @media (max-width: ${WIDTH_MOBILE}) {
      /* padding: 12px 0 12px 6px !important; */
    }
  }
  #imgUpload {
    display: none;
  }

  #imgUploadTxt {
    display: none;
  }
  label {
    position: absolute;
    top: 0px;
    right: 0;
    display: inline-block;
    width: 78px;
    text-align: center;
    height: 40px;
    line-height: 40px;
    color: ${COLOR_MAIN};
    border-radius: 8px;
    border: 1px solid ${COLOR_MAIN};
    max-width: 110px;
    font-size: 14px;
  }
`
//styled-------------------------------------------------------------------------------
const CoinChargeBtn = styled.button`
  padding: 16px 44px;
  color: #fff;
  background-color: #FF3C7B;
  border-radius: 10px;
  width: 100%;
  box-sizing: border-box;
  font-size: 16px;

  &.white-btn {
    border: 1px solid #FF3C7B;
    background-color: #fff;
    color: #FF3C7B;
    margin-right: 12px;
  }
`
const CoinCurrentStatus = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  user-select: none;

  .text {
    color: #9e9e9e;
    font-size: 16px;
    letter-spacing: -0.4px;

    @media (max-width: ${WIDTH_MOBILE}) {
      display: none;
    }
  }
  .coin-img {
    width: 44px;
    margin-left: 20px;

    @media (max-width: ${WIDTH_MOBILE}) {
      width: 36px;
      margin-left: 0;
      margin-right: 3px;
    }
  }
  .current-value {
    color: #FF3C7B;
    font-size: 28px;
    letter-spacing: -0.7px;
    font-weight: 600;

    @media (max-width: ${WIDTH_MOBILE}) {
      font-size: 20px;
    }
  }
`

const PersonalTypeBtn = styled.button`
  position: relative;
  width: 114px;
  height: 36px;
  line-height: 36px;
  border-radius: 20px;
  border: solid 1px #9e9e9e;
  /* padding: 7px 0; */
  font-size: 15px;
  text-align: center;
  color: #616161;
  letter-spacing: -0.5px;
  &:first-child {
    margin-right: 6px;
  }
  &.active {
    border: solid 1px ${COLOR_MAIN};
    color: #FF3C7B;
    font-weight: 600;
  }
`
const TitleWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 15px 0 6px 0;

  font-size: 16px;
`
