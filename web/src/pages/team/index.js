import React, {useContext, useState,useEffect} from 'react';
import {useHistory, useParams} from "react-router-dom";
// global components
import Header from 'components/ui/header/Header';
import CntWrapper from 'components/ui/cntWrapper/cntWrapper';
// components
import InfoSlide from './components/InfoSlide';
import InviteList from './components/InviteList';
import ButtonWrap from './components/ButtonWrap';


import './index.scss';
import Api from "context/api";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const TeamPage = () => {
  const history = useHistory();
  const [listCnt,setListCnt]=useState(0);
  const [list,setList]=useState([])
  const [invitationChk , setInvitationChk]=useState(false);
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const memberRdx = useSelector((state) => state.member);

  useEffect(()=>{
    if(!(globalState.token.isLogin)) {
      history.push("/login");
    }
    Api.getTeamInsChk({memNo:memberRdx.memNo}).then((res) => {
      if(res.data !== 1 && res.data !== -3 && res.data !== -1 ){
       /* dispatch(setGlobalCtxMessage({type:'toast',
          msg: res.message
        })*/
        history.replace('/myPage')
      }
    })
    if(invitationChk===false){
      invitationList()
      listCheckApi()
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
        dispatch(setGlobalCtxMessage({type:'toast',
          msg: res.message
        }))
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
        dispatch(setGlobalCtxMessage({type:'toast',
          msg: res.message
        }))
      }
    })
  }

  // ????????? ??????
  return (
    <div id="team">
      <Header title="???" type="back"/>
      <CntWrapper>
        <InfoSlide />
        {memberRdx.data && <InviteList list={list} listCnt={listCnt} memNo={memberRdx.memNo} setInvitationChk={setInvitationChk} memName={memberRdx.data.nickNm}/>}
        <ButtonWrap memNo={memberRdx.memNo}/>
      </CntWrapper>
    </div>
  )
}

export default TeamPage;
