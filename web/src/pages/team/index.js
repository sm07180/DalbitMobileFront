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
  const history = useHistory();
  const [listCnt,setListCnt]=useState(0);
  const [list,setList]=useState([])
  const [invitationChk , setInvitationChk]=useState(false);
  const memberRdx = useSelector((state) => state.member);

  useEffect(()=>{

    if(invitationChk===false){
      Api.getTeamInsChk({memNo:memberRdx.memNo}).then((res) => {
        console.log("팀페이지",res)
        if(res.data !== 1){
          history.push('/myPage')
        }else{
          invitationList()
          listCheckApi()
        }
      })

    }
  },[]);

  useEffect(()=>{
    if(invitationChk){
      invitationList()
      setInvitationChk(false);
    }
  },[invitationChk]);
  const invitationList=()=>{
    let param ={
      memNo:memberRdx.memNo,
      pageNo:1,
      pagePerCnt:100
    }
    Api.getTeamInvitationSel(param).then((res) => {
      if (res.code === "00000") {
        console.log("초대리스트",res.data.list)
        setListCnt(res.data.listCnt)
        setList(res.data.list)
      }else{
        console.log("데이터 호출안됨");
      }
    })
  }

  const listCheckApi=()=>{
    let param={
      memNo:memberRdx.memNo,
      reqSlct:'i'
    }
    Api.getTeamMemReqUpd(param).then((res)=>{
      if (res.code === "00000") {
        setInvitationChk(true);
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
        <InviteList list={list} listCnt={listCnt} memNo={memberRdx.memNo} setInvitationChk={setInvitationChk}/>
        <ButtonWrap />
      </CntWrapper>
    </div>
  )
}

export default TeamPage;
