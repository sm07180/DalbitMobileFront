import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
// global components
import Header from 'components/ui/header/Header';
// components
import InfoSlide from './components/InfoSlide';
import InviteList from './components/InviteList';
import ButtonWrap from './components/ButtonWrap';


import './index.scss';

const TeamPage = () => {
  const history = useHistory();

  // 페이지 시작
  return (
    <div id="team">
      <Header title="팀" type="back"/>
      <InfoSlide />
      <InviteList />
      <ButtonWrap />
    </div>
  )
}

export default TeamPage;89. 
