import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'

import Api from 'context/api'
import Swiper from 'react-id-swiper'

// global components
import Header from 'components/ui/header/Header'
// components
import './inquireDetail.scss'

const InquireDetail = () => {
  const params = useParams();
  const qnaIdx = Number(params.num);
  const [qnaDetail, setQnaDetail] = useState({});
  const [addFile, setAddFile] = useState([]);
  
  async function fetchInquireLog() {
    const res = await Api.center_qna_list({
      params: {
        page: 1,
        records: 9999
      }
    })
    if (res.result === 'success') {
      for (let i = 0; i < res.data.list.length; i++) {
        if(res.data.list[i].qnaIdx === qnaIdx) {
          setQnaDetail(res.data.list[i]);
        }
      }
    }
  }

  const timeFormat = (writeDt) => {
    if(writeDt) {
      let date = writeDt.slice(0, 8)
      date = [date.slice(2, 4), date.slice(4, 6), date.slice(6)].join('.')
      return `${date}`
    }
  }

  const removeImage = (index) => {
    const tempImage = addFile.concat([]);
    tempImage.splice(index, 1)

    setAddFile(tempImage);
  }

  useEffect(() => {
    fetchInquireLog()
  }, [])

  useEffect(() => {
    if(qnaDetail && Object.keys(qnaDetail).length){
      const tempAddFile = []
      if(qnaDetail.addFile1.thumb150x150){
        tempAddFile[0] = qnaDetail.addFile1.thumb150x150
      }
      if(qnaDetail.addFile2.thumb150x150){
        tempAddFile[1] = qnaDetail.addFile2.thumb150x150
      }
      if(qnaDetail.addFile3.thumb150x150){
        tempAddFile[2] = qnaDetail.addFile3.thumb150x150
      }
      setAddFile(tempAddFile);
    }
  }, [qnaDetail])

  const swiperParams = {
    slidesPerView: 'auto',
    spaceBetween: 8,
  }  
  
  return (
    <div id="inquireDetail">
      <Header title="나의 문의 내역" type="back"/>
      <div className='subContent'>
        <div className='detailTop'>
          <div className='qnaTitleWrap'>
            <span className='qnaTitle'>{qnaDetail.title}</span>                      
            <span className='qnawriteDt'>{timeFormat(qnaDetail.writeDt)}</span>
          </div>
          <div className='qnaState'>
            <span className={`answer ${!qnaDetail.answer ? "ing" : "complete"}`}>{!qnaDetail.answer ? "답변중" : "답변완료"}</span>
          </div>
        </div>
        <div className='detailContent'>
          <div className='qnaQuestion'>
             {qnaDetail.contents}
          </div>
          {addFile.length > 0 &&
            <div className='addFile'>
              <div className='addFileTitle'>첨부파일</div>
              <div className='addFileWrap'>
                <Swiper {...swiperParams} key={Math.random()}>
                    {addFile.map((list, index) => {
                      return (
                        <div className='addFileList' key={index}>
                          <img src={list} alt="업로드이미지"/>
                          <button type="button" className='removeFile' onClick={() => removeImage(index)}></button>
                        </div>
                      )
                    })}
                </Swiper>
              </div>
            </div>
          }
          {qnaDetail.answer &&
            <div className='qnaAnswer'>
              <p dangerouslySetInnerHTML={{__html: qnaDetail.answer.replace(/class/gi, 'className')}}></p>
            </div>
          }
        </div>
        <div className='detailBottom'>
          <button className='deleteBtn'>삭제하기</button>
          <button className='inquireBtn'>문의하기</button>
        </div>
      </div>
    </div>
  )
}

export default InquireDetail
