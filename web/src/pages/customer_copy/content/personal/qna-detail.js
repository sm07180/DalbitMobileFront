import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import Api from 'context/api';

import SelectBoxs from 'components/ui/selectBox.js'

export default function Detail(props) {
  const history = useHistory();
  if(props.location && props.location.state) {}
  else { history.push('/customer/qnaList'); }
  const { qna } = props.location.state;
  const { contents, answer, state,  writeDt, title, qnaType } = qna;

  const selectBoxData = [
    { value: 1, text: '회원정보' },
    { value: 2, text: '방송' },
    { value: 3, text: '청취' },
    { value: 4, text: '결제' },
    { value: 5, text: '건의' },
    { value: 6, text: '장애/버그' },
    { value: 7, text: '선물/아이템' },
    { value: 99, text: '기타' },
  ]

  const [modify, setModify] = useState(false);
  const [faqNum, setFaqNum] = useState(qnaType);
  const [email, setEmail] = useState(qna.email);
  const [delicate, setDelicate] = useState(false);
  const [questionFile, setQuestionFile] = useState([false, false, false]);
  
  const timeFormat = (strFormatFromServer) => {
    let date = strFormatFromServer.slice(0, 8)
    date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join('.')
    // let time = strFormatFromServer.slice(8)
    // time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(':')
    return `${date}`
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
          setQuestionFile(questionFile.map((v, i) => {
            if(i === idx) {
              return {
                fileName: fileName,
                path: res.data.path
              }
            } else {
              return v
            }
          }))
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

  const deleteFile = (event, idx) => {
    event.preventDefault();
    
    context.action.confirm({
      msg: '첨부파일을 삭제하시겠습니까?\n삭제된 파일은 복원되지 않습니다.',
      callback: () => {
        const questionFileClone = questionFile.map((v,i) => {
          if(i === idx) {
            return false;
          } else {
            return v;
          }
        }).filter(v => {
          return v;
        });

        questionFileClone.length === 0 ? 
          setQuestionFile([false, false, false]) :
          setQuestionFile(questionFileClone.map((v, i, self) => {
            if(self.length-1 === i) {
              if(self.length < 3) {
                if(self.length === 1) {
                  return [v, false, false]
                } else if(self.length === 2) {
                  return [v, false]
                }
              } else {
                return v
              }
            } else {
              return v;
            }
          }).flat());
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

  const typeActive = value => {
    setFaqNum(value);
  }


  const checkDelicate = () => {
    if(delicate) {
      
    }
  }

  const deleteQna = () => {
    // api 정의필요
  }

  return (
    <>
    {
      modify === false ? (
        <>
        <div className="personalDetailWrap">
          <div className="personalDetailWrap__header">
            <div className="personalDetailWrap__label">
              {state === 0 && <span className="state">답변대기</span>}
              {state === 1 && <span className="stateComplete">답변완료</span>}
            </div>
            <div className="personalDetailWrap__title">
              {qnaType === 1 && <span className="type">[회원정보]</span>}
              {qnaType === 2 && <span className="type">[방송]</span>}
              {qnaType === 3 && <span className="type">[청취]</span>}
              {qnaType === 4 && <span className="type">[결제]</span>}
              {qnaType === 5 && <span className="type">[건의]</span>}
              {qnaType === 6 && <span className="type">[장애/버그]</span>}
              {qnaType === 7 && <span className="type">[선물/아이템]</span>}
              {qnaType === 99 && <span className="type">[기타]</span>}
              <p className="personalDetailWrap__titleName">{title}</p>
            </div>
            <div className="personalDetailWrap__time">{timeFormat(writeDt)}</div>
          </div>
          <div className="personalDetailWrap__contents">
            <div className="personalDetailWrap__qna">
              <div className="personalDetailWrap__qna--title">
                {title}
              </div>
              <div className="personalDetailWrap__qna--content">
                {contents}
              </div>
            </div>
            {
              state === 1 &&
              <div className="personalDetailWrap__answer">
                <div className="personalDetailWrap__answer--header">
                  <span className="personalDetailWrap__answer--icon"></span>
                  <span>답변</span>
                </div>
                <p dangerouslySetInnerHTML={{__html: answer.replace(/class/gi, 'className')}}></p>
              </div>
            }
          </div>
          
        </div>
        {
          state === 0 &&
          <div className="personalDetailWrap__buttons">
            <button className="personalDetailWrap__button" onClick={deleteQna}>삭제</button>
            <button className="personalDetailWrap__button" onClick={() => setModify(true)}>수정</button>
            <button className="personalDetailWrap__button" onClick={() => history.goBack()}>목록</button>
          </div>
        }
      </>
      ) : (
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
            <input type="text" className="personalAddWrap__input" value={email} placeholder="이메일 주소를 입력하세요." onChange={e => setEmail(e.target.value)} />
            <div className="personalAddWrap__caption">※ 1:1 문의 답변은 입력하신 E-mail주소로 발송 됩니다.</div>
            <input type="text" className="personalAddWrap__input" value={title} placeholder="글의 제목을 입력하세요." onChange={e => setTitle(e.target.value)} />
            <textarea className="personalAddWrap__input personalAddWrap__input--textarea" value={contents} cols="30" rows="10" placeholder="작성하고자 하는 글의 내용을 입력해주세요." onChange={e => setContent(e.target.value)} />
            {
              questionFile.map( (v, index, self) => {
                return (
                  <React.Fragment key={index}>
                      {
                        index === 0 ?
                        (<label htmlFor={`personalAddWrap__file${index}`} className="personalAddWrap__input personalAddWrap__file">
                          {
                            v === false ? (
                              <>
                                <span className="personalAddWrap__file--text">+ 첨부파일</span>
                                <span className="personalAddWrap__file--add" />
                              </>
                            ) : (
                              <>
                                <span className="personalAddWrap__file--text">{v.fileName}</span>
                                <span className="personalAddWrap__file--delete" onClick={e => deleteFile(e, index)} />
                              </>
                            )
                          }
                        </label>)
                        : self[index-1] !== false ? (
                          <label htmlFor={`personalAddWrap__file${index}`} className="personalAddWrap__input personalAddWrap__file">
                            {
                              v === false ? (
                                <>
                                  <span className="personalAddWrap__file--text">+ 첨부파일</span>
                                  <span className="personalAddWrap__file--add" />
                                </>
                              ) : (
                                <>
                                  <span className="personalAddWrap__file--text">{v.fileName}</span>
                                  <span className="personalAddWrap__file--delete" onClick={e => deleteFile(e, index)} />
                                </>
                              )
                            }
                          </label>
                        ) : (
                          <>
                          </>
                        )
                    }
                    <input type="file" id={`personalAddWrap__file${index}`} onChange={e => uploadSingleFile(e, index)} />
                  </React.Fragment>
                )
              }) 
            }
            <div className="personalAddWrap__caption">※ jpg, png, pdf 파일을 합계최대 10MB까지 첨부 가능합니다.</div>
            <button onClick={checkDelicate} className={`personalAddWrap__submit ${delicate ? 'on':''}`}>문의하기</button>
          </div>
        </div>
      )
    }
    </>
    
  )

}