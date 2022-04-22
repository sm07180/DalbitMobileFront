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
  const context = useContext(Context);
  const [listCnt,setListCnt]=useState(0);
  const [list,setList]=useState([])
  const [invitationChk , setInvitationChk]=useState(false);
  const memberRdx = useSelector((state) => state.member);

  useEffect(()=>{

    if(invitationChk===false){
      invitationList()
      listCheckApi()
      Api.getTeamInsChk({memNo:memberRdx.memNo}).then((res) => {
        if(res.data === -1){
          context.action.toast({
            msg: res.message
          })
          history.push('/myPage')
        }else{

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
        setListCnt(res.data.listCnt)
        setList(res.data.list)
      }else{
        context.action.toast({
          msg: res.message
        })
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
        context.action.toast({
          msg: res.message
        })
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
        <ButtonWrap memNo={memberRdx.memNo} context={context}/>
      </CntWrapper>
    </div>
  )
}

export default TeamPage;
