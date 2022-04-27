import React from 'react'
import Header from 'components/ui/new_header.js'
import Layout from 'pages/common/layout'
import './clipopen.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxUpdatePopup} from "redux/actions/globalCtx";

export default () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  return (
    <Layout status="no_gnb">
      <div id="clipOpen">
        <Header title="클립 오픈 안내"/>
        <div className="content">
          <button
            className="clipButton"
            onClick={() => {
              dispatch(setGlobalCtxUpdatePopup({popup: ['CLIP_OPEN']}))
            }}>
            클립 등록 유의사항
          </button>

          <button
            className="eventButton"
            onClick={() => {
              dispatch(setGlobalCtxUpdatePopup({popup: ['CLIP_EVENT']}))
            }}>
            이벤트 유의사항
          </button>

          <img src="https://image.dalbitlive.com//event/clip/20200917/img01.jpg" alt="클립 오픈안내" />
          <img
            src="https://image.dalbitlive.com//event/clip/20200917/img02.jpg"
            alt="오픈 일에 내 클립 (녹음 파일)을 등록하면 달을 드립니다."
          />
          <img
            src="https://image.dalbitlive.com//event/clip/20200917/img03.jpg"
            alt="참여 방법 1분 이상 ~ 5분 이하 클립 녹음파일을 공개 설정으로 업로드하면 끝"
          />
          <img src="https://image.dalbitlive.com//event/clip/20200917/img04.jpg" alt="베스트 클립 top 10을 선발합니다." />
        </div>
      </div>
    </Layout>
  )
}
