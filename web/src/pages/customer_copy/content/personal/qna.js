import React, {useState, useEffect, useContext} from 'react'

import Api from 'context/api'
import {Context} from 'context'

import SelectBoxs from 'components/ui/selectBox.js'

export default function Qna() {
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

  const context = useContext(Context)

  const [faqNum, setFaqNum] = useState(0)
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const [addFile, setAddFile] = useState(false)

  const [delicate, setDelicate] = useState(false)
  const [questionFile, setQuestionFile] = useState([false, false, false])

  async function fetchData() {
    const res = await Api.center_qna_add({
      data: {
        qnaIdx: 0,
        qnaType: faqNum,
        title: title,
        contents: content,
        email: email,
        questionFile1: questionFile[0] !== false ? questionFile[0].path : '',
        questionFile2: questionFile[1] !== false ? questionFile[1].path : '',
        questionFile3: questionFile[2] !== false ? questionFile[2].path : '',
        questionFileName1: questionFile[0] !== false ? questionFile[0].fileName : '',
        questionFileName2: questionFile[1] !== false ? questionFile[1].fileName : '',
        questionFileName3: questionFile[2] !== false ? questionFile[2].fileName : ''
      }
    })
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
                window.location.href = '/'
              }
            })
          }, 0)
        }
      })
    }
  }

  function uploadSingleFile(e, idx) {
    const target = e.currentTarget

    let reader = new FileReader()
    const file = target.files[0]
    const fileName = file.name
    const fileSplited = fileName.split('.')
    const fileExtension = fileSplited.pop()
    //
    const extValidator = (ext) => {
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

  const typeActive = (value) => {
    setFaqNum(value)
  }

  const checkDelicate = () => {
    if (delicate) {
      fetchData()
    }
  }
  const deleteFile = (event, idx) => {
    event.preventDefault()

    context.action.confirm({
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
        context.action.confirm({visible: false})
      },
      cancelCallback: () => {
        context.action.confirm({visible: false})
      },
      buttonText: {
        left: '취소',
        right: '삭제'
      }
    })
  }
  useEffect(() => {
    if (faqNum !== 0 && email !== '' && title !== '' && content !== '') {
      setDelicate(true)
    } else {
      setDelicate(false)
    }
  }, [faqNum, email, title, content])

  return (
    <div className="personalAddWrap">
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
          className="personalAddWrap__input"
          placeholder="이메일 주소를 입력하세요."
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="personalAddWrap__caption">※ 1:1 문의 답변은 입력하신 E-mail주소로 발송 됩니다.</div>
        <input
          type="text"
          className="personalAddWrap__input"
          placeholder="글의 제목을 입력하세요."
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="personalAddWrap__input personalAddWrap__input--textarea"
          cols="30"
          rows="10"
          placeholder="작성하고자 하는 글의 내용을 입력해주세요."
          onChange={(e) => setContent(e.target.value)}
        />
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
        <button onClick={checkDelicate} className={`personalAddWrap__submit ${delicate ? 'on' : ''}`}>
          문의하기
        </button>
      </div>
    </div>
  )
}
