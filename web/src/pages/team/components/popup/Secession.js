import React, {useEffect, useState} from 'react';
// global components
// scss
import '../../scss/secession.scss';

const SecessionPop = (props) => {
  const {closeSlide,teamMemList} = props;

  const aaaa=(memNo)=>{
    console.log(memNo);
  }

  // 페이지 시작
  return (
    <section className="secession">
      <div className="teamList">
        {teamMemList.length > 0 && teamMemList.map((data,index)=>{
          return(
            <label className="listRow" key={index}>
              <div className="photo">
                <img src="" alt="" />
              </div>
              <div className="listContent">
                <div className="nick">{data.tm_mem_nick}</div>
              </div>
              <div className="listBack">
                <input type="radio" name="team" className="blind" onChange={()=>aaaa(data.tm_mem_no)}/>
                <div className="checkIcon"/>
              </div>
            </label>
          )
        })}
      </div>
      <div className="buttonGroup">
        <button onClick={closeSlide}>취소</button>
        <button>다음</button>
      </div>
    </section>
  )
}

export default SecessionPop;