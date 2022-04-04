import React, {useContext, useState} from 'react';
import {useHistory} from "react-router-dom";
import {Context} from 'context';
// global components
import Header from 'components/ui/header/Header';
import CntWrapper from 'components/ui/cntWrapper/CntWrapper';
// components
import InfoSlide from './components/InfoSlide';
import InviteList from './components/InviteList';
import ButtonWrap from './components/ButtonWrap';


import './index.scss';

const TeamPage = () => {

  // 페이지 시작
  return (
    <div id="team">
      <Header title="팀" type="back"/>
      <CntWrapper>
        <InfoSlide />
        <InviteList />
        <ButtonWrap />
      </CntWrapper>
    </div>
  )
}

export default TeamPage;
