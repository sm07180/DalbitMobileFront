import React, {useContext, useState,useEffect} from 'react';
import {useHistory, useParams} from "react-router-dom";
import {Context} from 'context';
// global components
import Header from 'components/ui/header/Header';
import CntWrapper from 'components/ui/cntWrapper/CntWrapper';
// components
import InfoSlide from './components/InfoSlide';
import InviteList from './components/InviteList';
import ButtonWrap from './components/ButtonWrap';


import './index.scss';
import Api from "context/api";
import {useSelector} from "react-redux";

const TeamPage = () => {

  const [listCnt,setListCnt]=useState(0);
  const [list,setList]=useState([])
  const memberRdx = useSelector((state) => state.member);

  useEffect(()=>{
    invitationList()
  },[])

  const invitationList=()=>{
    let param ={
      memNo:memberRdx.memNo,
      pageNo:1,
      pagePerCnt:100
    }
    Api.getTeamInvitationSel(param).then((res) => {
      if (res.result === 'success') {
        setListCnt(res.data.listCnt)
        setList(res.data.list)
      }else{
        console.log("데이터 호출안됨");
      }
    })

  }

  // 페이지 시작
  return (
    <div id="team">
      <Header title="팀" type="back"/>
      <CntWrapper>
        <InfoSlide />
        <InviteList list={list} listCnt={listCnt} />
        <ButtonWrap />
      </CntWrapper>
    </div>
  )
}

export default TeamPage;
