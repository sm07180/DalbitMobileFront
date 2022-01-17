import React, {useState, useEffect} from "react";
import Api from 'context/api'
import Header from './component/header'

import "./style.scss";

export default function Ranking() {  

  return (
    <div id="ranking">
      <Header title="랭킹" leftContent="backBtn" rightContent="benefits sample"/>
      {/* leftContent와 rightContent에 아아콘의 ClassName을 props로 전달하여 레이아웃을 구성 - 2개 이상의 요소가 들어갈 경우 띄어쓰기로 props 전달 */}

      
    </div>
  );
}