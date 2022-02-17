import React, {useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import Api from 'context/api'
import Swiper from 'react-id-swiper'

// global components
import Header from 'components/ui/header/Header'
// components
import './inquireDetail.scss'
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const InquireDetail = () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const params = useParams();
  const qnaIdx = Number(params.num);
  const [qnaDetail, setQnaDetail] = useState({});
  const [addFile, setAddFile] = useState([]);
  const history = useHistory();

  const fetchInquireLog = async () => {
    let params = {
      page: 1,
      records: 9999
    }
    await Api.center_qna_list({params}).then((res) => {
      if (res.result === 'success') {
        for (let i = 0; i < res.data.list.length; i++) {
          if(res.data.list[i].qnaIdx === qnaIdx) {
            setQnaDetail(res.data.list[i]);
          }}
      } else {
        dispatch(setGlobalCtxMessage({type: "alert", msg: res.message}));
      }
    }).catch((e) => console.log(e));
  }

  const changeDay = (date) => {
    return moment(date, "YYYYMMDDHHmmss").format("YY.MM.DD");
  }

  const deleteQna = async () => {
    const res = await Api.center_qna_delete({
      params: {qnaIdx: qnaIdx}
    })
    if(res.result === "success") {
      dispatch(setGlobalCtxMessage({
        type: "alert", msg: res.message, callback: () => {
          dispatch(setGlobalCtxMessage({type: "alert", visible: false}));
          history.goBack();
        }
      }))
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert", msg: res.message, callback: () => {
          dispatch(setGlobalCtxMessage({type: "alert", visible: false}));
          history.goBack();
        }
      }))
    }
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

  const onClick = () => {
    history.push("/customer/inquire");
  }

  return (
    <div id="inquireDetail">
      <Header title="나의 문의 내역" type="back"/>
      <div className='subContent'>
        <div className='detailTop'>
          <div className='qnaTitleWrap'>
            <span className='qnaTitle'>{qnaDetail.title}</span>
            <span className='qnawriteDt'>{changeDay(qnaDetail.writeDt)}</span>
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
                    </div>
                  )
                })}
              </Swiper>
            </div>
          </div>
          }
          {qnaDetail.answer &&
          <div className='qnaAnswer'>
            <p dangerouslySetInnerHTML={{__html: qnaDetail.answer.replace(/class/gi, 'className')}}/>
          </div>
          }
        </div>
        <div className='detailBottom'>
          <button className='deleteBtn' onClick={deleteQna}>삭제하기</button>
          <button className='inquireBtn' onClick={onClick}>문의하기</button>
        </div>
      </div>
    </div>
  )
}

export default InquireDetail;
