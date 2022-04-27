import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'
import {Hybrid} from 'context/hybrid'
import {OS_TYPE} from 'context/config'
import SelectBoxs from 'components/ui/selectBox.js'
import DalbitCheckbox from 'components/ui/dalbit_checkbox'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage, setGlobalCtxUpdatePopup} from "redux/actions/globalCtx";

let msgTitle
let msgContents
export default function Qna() {
  const history = useHistory()

  const selectBoxData = [
    {value: 0, text: '문의 유형을 선택하세요.'},
    {value: 1, text: '회원정보'},
    {value: 2, text: '방송'},
    {value: 3, text: '청취'},
    {value: 4, text: '결제'},
    {value: 5, text: '건의'},
    {value: 6, text: '장애/버그'},
    {value: 7, text: '선물/아이템'},
    {value: 99, text: '기타'}
  ]

  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const customHeader = JSON.parse(Api.customHeader)
  const [name, setName] = useState('')
  const [faqNum, setFaqNum] = useState(0)
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState(
    '아래 내용을 함께 보내주시면 더욱 빨리 처리가 가능합니다.\n\n폰 기종 :\n폰 버전 (ex-Android 버전10) : \n문제발생 일시 :\n문의내용 :'
  )
  const [phone, setPhone] = useState('')

  const [delicate, setDelicate] = useState(false)
  const [questionFile, setQuestionFile] = useState([false, false, false])

  const [checks, setChecks] = useState([false, true])
  const [agree, setAgree] = useState(false)
  const [isBanner, setIsBanner] = useState([])

  async function fetchData() {
    dispatch(setGlobalCtxMessage({
      type: "confirm",
      msg: '1:1 문의를 등록하시겠습니까?',
      callback: async () => {
        const res = await Api.center_qna_add({
          data: {
            qnaIdx: 0,
            qnaType: faqNum,
            title: title,
            contents: content,
            questionFile1: questionFile[0] !== false ? questionFile[0].path : '',
            questionFile2: questionFile[1] !== false ? questionFile[1].path : '',
            questionFile3: questionFile[2] !== false ? questionFile[2].path : '',
            questionFileName1: questionFile[0] !== false ? questionFile[0].fileName : '',
            questionFileName2: questionFile[1] !== false ? questionFile[1].fileName : '',
            questionFileName3: questionFile[2] !== false ? questionFile[2].fileName : '',
            phone: checks[0] ? phone : '',
            email: checks[1] ? email : '',
            nickName: name
          }
        })
        msgTitle = res.data.title
        msgContents = res.data.contents
        if (res.result === 'success') {
          setTimeout(() => {
            dispatch(setGlobalCtxMessage({
              type: "alert",
              msg: `<div><span style='display:block;margin-bottom:10px;font-size:20px;font-weight:bold;'>${msgTitle}</span><p>${msgContents}</p></div>`,
              callback: () => {
                if (!globalState.token.isLogin) {
                  history.push('/')
                } else {
                  history.push('/customer/qnaList')
                }
              }
            }))
          }, 0)
        } else {
          dispatch(setGlobalCtxMessage({
            type: "alert",
            msg: res.message,
          }))
        }
      }
    }))

    // const res = await Api.center_qna_add({
    //   data: {
    //     qnaIdx: 0,
    //     qnaType: faqNum,
    //     title: title,
    //     contents: content,
    //     questionFile1: questionFile[0] !== false ? questionFile[0].path : '',
    //     questionFile2: questionFile[1] !== false ? questionFile[1].path : '',
    //     questionFile3: questionFile[2] !== false ? questionFile[2].path : '',
    //     questionFileName1: questionFile[0] !== false ? questionFile[0].fileName : '',
    //     questionFileName2: questionFile[1] !== false ? questionFile[1].fileName : '',
    //     questionFileName3: questionFile[2] !== false ? questionFile[2].fileName : '',
    //     phone: checks[0] ? phone : '',
    //     email: checks[1] ? email : '',
    //     nickName: name
    //   }
    // })
    // if (res.result === 'fail') {
    //   dispatch(setGlobalCtxMessage({type:"alert",
    //     msg: res.message,
    //     callback: () => {
    //       dispatch(setGlobalCtxMessage({type:"alert",
    //         visible: false
    //       })
    //     }
    //   })
    // } else if (res.result === 'success') {
    //   dispatch(setGlobalCtxMessage({type:"confirm",
    //     msg: '1:1 문의를 등록하시겠습니까?',
    //     callback: () => {
    //       //alert
    //       setTimeout(() => {
    //         dispatch(setGlobalCtxMessage({type:"alert",
    //           msg: '1:1 문의 등록을 완료하였습니다.',
    //           callback: () => {
    //             history.push('/')
    //           }
    //         })
    //       }, 0)
    //     }
    //   })
    // }
  }

  function uploadSingleFile(e, idx) {
    const target = e.currentTarget
    if (target.files.length === 0) return
    let reader = new FileReader()
    const file = target.files[0]
    const fileName = file.name
    const fileSplited = fileName.split('.')
    const fileExtension = fileSplited.pop()
    //const list = ['jpg', 'jpeg', 'png', 'PNG']
    const extValidator = (ext) => {
      const list = ['jpg', 'jpeg', 'png', 'PNG']
      return list.includes(ext)
    }
    if (!extValidator(fileExtension)) {
      return dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: 'jpg, png 이미지만 사용 가능합니다.',
        title: '',
      }))
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
        if (res.result === 'success' && res.code === '0') {
          setQuestionFile(
            questionFile.map((v, i) => {
              if (i === idx) {
                return {
                  fileName: fileName,
                  path: res.data.path
                }
              } else {
                return v
              }
            })
          )
        } else {
          dispatch(setGlobalCtxMessage({
            type: "alert",
            msg: res.message,
            title: '',
          }))
        }
      }
    }
  }

  const typeActive = (value) => {
    setFaqNum(value)
  }

  const checkDelicate = () => {
    if (delicate) {
      fetchData()
    } else {
      let contents

      if (name === '') {
        contents = '이름 또는 닉네임을\n입력해주세요.'
      } else if (name.length <= 1) {
        contents = '이름 또는 닉네임을\n정확하게 입력해주세요.'
      } else if (faqNum === 0) {
        contents = '문의 유형을 선택해주세요.'
      } else if (title === '') {
        contents = '제목을 입력해주세요.'
      } else if (content === '') {
        contents = '문의내용을 입력해주세요.'
      } else if (checks[0] && phone === '') {
        contents = '답변 받으실 휴대폰 번호를\n입력해주세요.'
      } else if (checks[0] && phone.length < 9) {
        contents = '정확한\n휴대폰 번호를 입력해주세요.'
      } else if (checks[1] && email === '') {
        contents = '답변 받으실 Email을\n입력해주세요.'
      } else if (checks[1] && !emailInpection(email)) {
        contents = '정확한\nEmail을 입력해주세요.'
      } else if (!agree) {
        contents = '개인정보 수집 및 이용에\n동의해주세요.'
      }

      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: contents,
      }))
    }
  }

  const deleteFile = (event, idx) => {
    event.preventDefault()

    dispatch(setGlobalCtxMessage({
      type: "confirm",
      msg: '첨부파일을 삭제하시겠습니까?\n삭제된 파일은 복원되지 않습니다.',
      callback: () => {
        const questionFileClone = questionFile
          .map((v, i) => {
            if (i === idx) {
              return false
            } else {
              return v
            }
          })
          .filter((v) => {
            return v
          })

        questionFileClone.length === 0
          ? setQuestionFile([false, false, false])
          : setQuestionFile(
              questionFileClone
                .map((v, i, self) => {
                  if (self.length - 1 === i) {
                    if (self.length < 3) {
                      if (self.length === 1) {
                        return [v, false, false]
                      } else if (self.length === 2) {
                        return [v, false]
                      }
                    } else {
                      return v
                    }
                  } else {
                    return v
                  }
                })
                .flat()
          )
        dispatch(setGlobalCtxMessage({type: "confirm", visible: false}))
      },
      cancelCallback: () => {
        dispatch(setGlobalCtxMessage({type: "confirm", visible: false}))
      },
      buttonText: {
        left: '취소',
        right: '삭제'
      }
    }))
  }

  const phoneCallWrap = () => {
    if (customHeader.os === OS_TYPE['Android']) {
      return (
        <button
          className="btn btn_call"
          onClick={() => {
            Hybrid('openCall', `tel:1522-0251`)
          }}>
          {/* <img src={headsetIcon} /> */}
          <span>전화걸기</span>
        </button>
      )
    } else if (customHeader.os === OS_TYPE['IOS']) {
      return (
        <button
          className="btn btn_call"
          onClick={() => {
            Hybrid('openUrl', `tel:1522-0251`)
          }}>
          {/* <img src={headsetIcon} /> */}
          <span>전화걸기</span>
        </button>
      )
    } else {
      return (
        <button
          className="btn btn_call"
          onClick={() => {
            window.location.href = `tel:1522-0251`
          }}>
          {/* <img src={headsetIcon} /> */}
          <span>전화걸기</span>
        </button>
      )
    }
  }

  const phoneCall = () => {
    if (customHeader.os === OS_TYPE['Android']) {
    } else if (customHeader.os === OS_TYPE['IOS']) {
      Hybrid('openUrl', `tel:1522-0251`)
    } else {
      window.location.href = `tel:1522-0251`
    }
  }

  const emailInpection = (email) => {
    const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i

    return regExp.test(email)
  }

  async function fetchBannerData() {
    const res = await Api.getBanner({
      params: {
        position: 15
      }
    })

    if (res.result === 'success') {
      if (res.hasOwnProperty('data')) setIsBanner(res.data)
    } else {
      console.log(res.result, res.message)
    }
  }

  const createSliderList = () => {
    if (!isBanner) return null
    return isBanner.map((banner, idx) => {
      const {bannerUrl, title} = banner

      return (
        <div className="qnaInfoBanner" key={`banner-${idx}`} onClick={() => history.push('/customer/qna_info')}>
          <img src={bannerUrl} alt={title} />
        </div>
      )
    })
  }

  useEffect(() => {
    fetchBannerData()
  }, [])

  useEffect(() => {
    if (
      faqNum !== 0 &&
      title !== '' &&
      content !== '' &&
      name !== '' &&
      name.length > 1 &&
      agree &&
      // ((!context.token.isLogin && checks[0] && phone !== '' && phone.length > 8) || context.token.isLogin)
      // mail 되면
      (!checks[0] || (checks[0] && phone !== '' && phone.length > 8)) &&
      (!checks[1] || (checks[1] && email !== '' && emailInpection(email)))
    ) {
      setDelicate(true)
    } else {
      setDelicate(false)
    }
  }, [faqNum, email, title, content, name, phone, agree, checks])

  useEffect(() => {
    if (checks[0] === false && checks[1] === false && !globalState.token.isLogin) {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        visible: true,
        msg: '답변 유형 선택은 필수입니다.',
        callback: () => {
          setChecks([false, true])
        }
      }))
    }
  }, [checks])

  useEffect(() => {
    if (globalState.profile) {
      setName(globalState.profile.nickNm)
    }
    if (globalState.token.isLogin) {
      setChecks([false, false])
    }
  }, [])

  return (
    <div className="personalAddWrap">
      {createSliderList()}
      {/* <div className="qnaInfoBanner" onClick={() => history.push('/customer/qna_info')}>

        <img src={getBanner} />
      </div> */}
      <input
        type="text"
        className="personalAddWrap__input"
        value={name}
        autoComplete="off"
        disabled={globalState.token.isLogin}
        placeholder="이름 또는 닉네임을 입력하세요."
        onChange={(e) => {
          if (e.target.value.length < 21) {
            setName(e.target.value)
          }
        }}
      />
      <div className="personalAddWrap__select">
        <SelectBoxs
          type={'remove-init-data'}
          boxList={selectBoxData}
          onChangeEvent={typeActive}
          inlineStyling={{left: 0, top: 0, zIndex: 8, position: 'static', width: '100%'}}
        />
      </div>
      <div className="personalAddWrap__content">
        <input
          type="text"
          autoComplete="off"
          className="personalAddWrap__input"
          placeholder="제목을 입력하세요."
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="personalAddWrap__input personalAddWrap__input--textarea"
          autoComplete="off"
          maxLength={2000}
          defaultValue={content}
          placeholder="작성하고자 하는 문의내용을 입력해주세요."
          onChange={(e) => setContent(e.target.value)}>
          {/* {content} */}
        </textarea>
        {questionFile.map((v, index, self) => {
          return (
            <React.Fragment key={index}>
              {index === 0 ? (
                <label htmlFor={`personalAddWrap__file${index}`} className="personalAddWrap__input personalAddWrap__file">
                  {v === false ? (
                    <>
                      <span className="personalAddWrap__file--text">+ 첨부파일</span>
                      <span className="personalAddWrap__file--add" />
                    </>
                  ) : (
                    <>
                      <span className="personalAddWrap__file--text">{v.fileName}</span>
                      <span className="personalAddWrap__file--delete" onClick={(e) => deleteFile(e, index)} />
                    </>
                  )}
                </label>
              ) : self[index - 1] !== false ? (
                <label htmlFor={`personalAddWrap__file${index}`} className="personalAddWrap__input personalAddWrap__file">
                  {v === false ? (
                    <>
                      <span className="personalAddWrap__file--text">+ 첨부파일</span>
                      <span className="personalAddWrap__file--add" />
                    </>
                  ) : (
                    <>
                      <span className="personalAddWrap__file--text">{v.fileName}</span>
                      <span className="personalAddWrap__file--delete" onClick={(e) => deleteFile(e, index)} />
                    </>
                  )}
                </label>
              ) : (
                <></>
              )}
              <input type="file" id={`personalAddWrap__file${index}`} onChange={(e) => uploadSingleFile(e, index)} />
            </React.Fragment>
          )
        })}
        <div className="personalAddWrap__caption">※ jpg, png 파일을 합계최대 10MB까지 첨부 가능합니다.</div>
        {globalState.token.isLogin === false && (
          <div className="personalAddWrap__answerWrap">
            <div className="personalAddWrap__checkboxWrap">
              <div className="personalAddWrap__checkboxWrap--check">
                <DalbitCheckbox
                  status={checks[1]}
                  callback={() => {
                    setChecks(
                      checks.map((v, i) => {
                        if (i === 1) {
                          v = !v
                        }
                        return v
                      })
                    )
                  }}
                />
                <span>답변 E-Mail로 받기</span>
              </div>
              <div className="personalAddWrap__checkboxWrap--check">
                <DalbitCheckbox
                  status={checks[0]}
                  callback={() => {
                    setChecks(
                      checks.map((v, i) => {
                        if (i === 0) {
                          v = !v
                        }
                        return v
                      })
                    )
                  }}
                />
                <span>답변 문자로 받기</span>
              </div>
            </div>
            <div>
              <input
                disabled={!checks[1]}
                className="personalAddWrap__input"
                type="email"
                autoComplete="off"
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                placeholder="E-Mail 입력하세요."
              />
              <input
                disabled={!checks[0]}
                className="personalAddWrap__input"
                type="tel"
                autoComplete="off"
                value={phone}
                onChange={(e) => {
                  if (e.target.value.length < 16 && !isNaN(e.target.value)) {
                    setPhone(e.target.value)
                  }
                }}
                placeholder="휴대폰 번호를 입력하세요."
              />
            </div>
          </div>
        )}

        <div className="personalAddWrap__agreeWrap">
          <DalbitCheckbox status={agree} callback={() => setAgree(!agree)} />
          <span className="personalAddWrap__agreeWrap--text">개인정보 수집 및 이용에 동의합니다.</span>
          <span
            className="personalAddWrap__agreeWrap--deep"
            onClick={() => {
              dispatch(setGlobalCtxUpdatePopup({popup: ['AGREEDETAIL']}));
            }}>
            자세히
          </span>
        </div>

        <div className="callBoxWrap">
          <div className="callBox">
            <div className="callBox_title">
              · 1:1 문의 전 궁금하신 사항은 FAQ에서 확인하시면
              <br /> 신속한 답변을 제공받을 수 있습니다.
            </div>
            <button className="btn btn_faq" onClick={() => history.push('/customer/faq')}>
              <span>FAQ 보기</span>
            </button>
          </div>
          <div className="callBox">
            <div className="callBox_title">
              · 신속하고, 상세한 답변을 원하시면 고객센터로 문의해보세요.
              <br />
              <strong className="callBox_title__custom">
                고객센터 (국내)<span>1522-0251</span>
              </strong>
              <span className="callBox_desc">(상담시간 : 평일 10:00~18:00 토/일/공휴일 제외)</span>
            </div>
            {phoneCallWrap()}
          </div>
        </div>

        <button onClick={checkDelicate} className={`personalAddWrap__submit ${delicate ? 'on' : ''}`}>
          1:1 문의 완료
        </button>

        <div className="personalAddWrap__policy">
          <span
            onClick={() => {
              window.location.href = '/customer/appInfo/service'
            }}>
            이용약관
          </span>
          <span> | </span>
          <span
            onClick={() => {
              window.location.href = '/customer/appInfo/privacy'
            }}>
            개인정보
          </span>
          <span> | </span>
          <span
            onClick={() => {
              window.location.href = '/customer/appInfo/youthProtect'
            }}>
            청소년보호
          </span>
          <span> | </span>
          <span
            onClick={() => {
              window.location.href = '/customer/appInfo/operating'
            }}>
            운영정책
          </span>
        </div>
      </div>
    </div>
  )
}
