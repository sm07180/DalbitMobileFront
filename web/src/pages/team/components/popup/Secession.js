import React, {useEffect, useState} from 'react';
// global components
// scss
import '../../scss/secession.scss';
import Api from "context/api";
import photoCommon from "common/utility/photoCommon";
import {useDispatch} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const SecessionPop = (props) => {
  const {closeSlide,teamMemList,memNo,teamNo,history} = props;
  const [teMemNo, setTeMemNo]=useState("");
  const dispatch = useDispatch();

  const teamDel=()=>{
    dispatch(setGlobalCtxMessage({type:'confirm',
      msg: `정말 탈퇴 할까요?`,
      remsg: `탈퇴 이후 팀이 랭킹에 오르더라도
        리워드를 받을 수 없으며, 탈퇴 이후 재가입 할 경우
        기여도는 복원되지 않습니다.`,
      buttonText: {
        left: '취소',
        right: '완료'
      },
      callback: () => {
        if(teamMemList.length > 0){
          Api.getTeamMasterUpd({teamNo:teamNo,tmMemNo:teMemNo}).then(res=>{
            if(res.code === "00000"){
              let param = {
                teamNo:teamNo,
                delSclt:"t",
                tmMemNo:memNo,
                masterMemNo:teMemNo,
                chrgrName:""
              }
              Api.getTeamMemDel(param).then(res=>{
                if(res.code === "00000"){
                  history.push("/myPage");
                }else {
                  dispatch(setGlobalCtxMessage({type:'toast',
                    msg: res.message
                  }))
                }
              })
            }else{
              dispatch(setGlobalCtxMessage({type:'toast',
                msg: res.message
              }))
            }
          })
        }

      },
      cancelCallback: () => {},
    }));
  }
  const nextLeader =(memNo)=>{
    setTeMemNo(memNo)
  }

  // 페이지 시작
  return (
    <section className="secession">
      <div className="teamList">
        {teamMemList.length > 0 && teamMemList.map((data,index)=>{
          let tmemNo = data.tm_mem_no
          let photoUrl = data.tm_image_profile
          let photoServer = "https://photo.dalbitlive.com";
          return(
            <label className="listRow" key={index}>
              <div className="photo">
                <img src={photoCommon.getPhotoUrl(photoServer, photoUrl, "120x120")} alt="" />
              </div>
              <div className="listContent">
                <div className="nick">{data.tm_mem_nick}</div>
              </div>
              {Number(tmemNo) !== Number(memNo) &&
              <div className="listBack">
                <input type="radio" name="team" className="blind" onChange={()=>nextLeader(tmemNo)}/>
                <div className="checkIcon"/>
              </div>
              }
            </label>
          )
        })}
      </div>
      <div className="buttonGroup">
        <button onClick={closeSlide}>취소</button>
        <button onClick={()=>{teamDel()}}>다음</button>
      </div>
    </section>
  )
}

export default SecessionPop;
