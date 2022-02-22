import React, {useContext, useEffect, useState} from 'react'

import Header from 'components/ui/header/Header'
import LayerPopup from 'components/ui/layerPopup/LayerPopup'

import EventComment from '../components/comment'

import './acrostic.scss'
import Api from "context/api";
import {Context} from "context";
import {useSelector} from "react-redux";

const Acrostic = () => {
  const context = useContext(Context)
  const [popup, setPopup] = useState(false);

  const [poem, setPoem] = useState({
    tailMemNo: context.profile && context.profile.memNo,
    tailMemId: context.profile && context.profile.memId,
    tailMemSex: context.profile && context.profile.gender,
    tailMemIp: "",
    tailConts: "",
    tailLoginMedia: useSelector((state) => state.common.isDesktop) ? "w" : "s",
  })

  const [poemInfo, setPoemInfo] = useState({listCnt: 0, list: []})

  useEffect(() => {
    getPoemList()
  }, [])

  const noticePop = () => setPopup(true);

  //리스트조회
  const getPoemList = () => {
    Api.poem({
      reqBody: false,
      params: {memNo: context.profile && context.profile.memNo, pageNo: 1, pagePerCnt: 1000},
      method: 'GET'
    }).then((response) => {
      console.log(response);
      setPoemInfo({
        listCnt: response.data.listCnt,
        list: response.data.list
      })
    });
  }

  //글 작성
  const savePoem = () => {
    Api.poem({
      reqBody: true,
      data: {
        tailMemNo: poem.tailMemNo,
        tailMemId: poem.tailMemId,
        tailMemSex: "",
        tailMemIp: "",
        tailConts: poem.tailConts,
        tailLoginMedia: poem.tailLoginMedia,
      },
      method: 'POST'
    }).then((response)=>{
      if(response.code === "C003"){
        context.action.alert({msg: '댓글이 등록되었습니다.'});
        getPoemList()
      }
    })
  }

  //글 삭제
  const deletePoem = (value) =>{
    Api.poem({
      reqBody: true,
      data:{
        tailNo:value,
        tailMemNo:poem.tailMemNo,
      },
      method: 'DELETE'
    }).then((response)=>{
      if(response.code === "C004"){
        context.action.alert({msg: '댓글이 삭제되었습니다.'});
        getPoemList();
      }
    })
  }

  // 사연 리셋 함수
  const resetStoryList = () => {
    getPoemList();
  }


  return (
    <div id="acrosticEvent">
      <Header title={'달라를 소개해 달라!'} type={'back'}/>
      <div className="content">
        <img src="https://image.dalbitlive.com/event/acrostic/main.png" alt="달라를 축하해 달라"/>
        <button className="noticeBtn" onClick={noticePop}>유의사항</button>
        <EventComment contPlaceHolder={'내용을 입력해주세요.'}
                      commentList={poemInfo.list}
                      totalCommentCnt={poemInfo.listCnt}
                      resetStoryList={resetStoryList}
                      commentAdd={savePoem}
                      commentDel={deletePoem}
        />

      </div>
      {popup &&
      <LayerPopup title="유의사항" setPopup={setPopup}>
        <div className="subContent">
          <p>한 회원 당 한 계정으로만 참여할 수 있습니다.</p>
          <p>상금은 제세공과금 없이 환전 가능한 “별”로 지급해드립니다.</p>
          <p>다수의 계정으로 중복 참여는 불가하지만 한 계정으로 중복 참여는 가능합니다.</p>
          <p>상품은 이벤트 종료 후 일주일 안에 본인인증에 사용 하신 번호로 발송해드립니다.</p>
          <p>도배 등의 행위는 재제 사유입니다.</p>
          <p>상품이 품절될 경우 동일 가격대의 다른 상품으로 대체됩니다.</p>
          <p>본 이벤트는 사전 고지 없이 변경 및 종료 될 수 있습니다.</p>
        </div>
      </LayerPopup>
      }
    </div>
  )
}

export default Acrostic