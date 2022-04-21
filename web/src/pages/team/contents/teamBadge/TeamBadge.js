import React, {useState,useContext,useEffect} from 'react';
import {useHistory} from "react-router-dom";
import {Context} from 'context';
import {IMG_SERVER} from 'context/config';
// global components
import Header from 'components/ui/header/Header';
import CntWrapper from 'components/ui/cntWrapper/CntWrapper';
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn';
import LayerPopup from 'components/ui/layerPopup/LayerPopup';
import Api from "context/api";
// components
import BadgeInfo from '../../components/popup/BadgeInfo';
// scss
import '../../scss/teamBadge.scss';
import {useSelector} from "react-redux";

const TeamBadge = (props) => {
  const history = useHistory();
  const memberRdx = useSelector((state)=> state.member);
  const [badgePop, setBadgePop] = useState(false);
  const [statChk, setStatChk]=useState(props.data.statChk); // 권한 체크용 [m: 마스터 , t: 일반회원 , n: 미가입자]
  const [changePage,setChangePage]=useState(false);
  const [updBadgeList,setUpdBadgeList]=useState(props.data.list);
  const [getCnt,setGetCnt]=useState(props.data.cnt);  // 활동뱃지 얻은 갯수
  const [badgeData, setBadgeData]=useState({})
  const teamNo = props.match.params.teamNo;

  useEffect(()=>{
    if(teamNo === undefined || teamNo ==="" || teamNo ===null || memberRdx.memNo ===""){
      history.goBack();
      return false
    }else{
      badgeListApi();
    }
  },[changePage])


  const badgeListApi=()=>{
    let param={
      teamNo:teamNo,
      memNo:memberRdx.memNo,
      pageNo:1,
      pagePerCnt:100
    }
    Api.getTeamBadgeList(param).then((res)=>{
      if(res.code === "00000"){
        console.log(res)
        // setBadgeList(res.data.list);
        setUpdBadgeList(res.data.list)
        setStatChk(res.data.statChk);
        setGetCnt(res.data.cnt)
      }
    })
  }

  const selectBadge=(bgCode)=>{
    // const copy = badgeList.map(m => m.bg_code )
    // bg_achieve_yn
  }

  const clickPopup = () => {
    setBadgePop(!badgePop);
  };

  const onClickBadge = (data) => {
    setBadgeData(data)
    if(!changePage){
      setBadgePop(true);
    }

    const copy = updBadgeList.map(m=>{
      if(data.bg_achieve_yn === 'n'){
        return m;
      }
      if(m.bg_code === data.bg_code){
        m.bg_represent_yn = m.bg_represent_yn === 'y' ? 'n' : 'y'
      }
      return m;
    })

    setUpdBadgeList(copy)
  };

  const onClickComplete = async () =>{
    if(!changePage){
      return;
    }
    let cnt = 0, successCnt = 0;
    for (let i = 0; i < updBadgeList.length; i++) {
      if(updBadgeList[i].bg_represent_yn === props.data.list[i].bg_represent_yn){
        console.log(`i ${updBadgeList[i].bg_represent_yn}, ${props.data.list[i].bg_represent_yn}`)
        continue;
      }
      cnt++;
      // -3:대표설정 배지수 초과, -2:배지 미달성, -1: 팀장아님, 0: 에러, 1:정상
      const res = await Api.updTeamBadge({
        teamNo: teamNo,                           // 팀번호
        memNo: memberRdx.memNo,                   // 회원번호
        updSlct: updBadgeList[i].bg_represent_yn, // 업데이트구분[y:대표 설정, n:대표해제]
        bgCode: updBadgeList[i].bg_code           // 배지코드
      });
      if(res.data === 1){
        successCnt++;
      }
    }
    if(cnt === successCnt){
      // 잘성공함
    }else{
      // 뭔가 실패
    }
    setChangePage(false);
    history.goBack();
  }
  // 페이지 시작
  return (
    <div id="teamBadge">
      <Header title="뱃지리스트" type="back" />
      <CntWrapper>
        <div className="text">
          {(statChk === 'm' && !changePage) ?
            <div>
              팀 화면에 보여질 대표배지를 설정할 수 있습니다.
              <button onClick={()=>{
                setChangePage(true)
              }}>
                설정
              </button>
            </div>
            :
            changePage ?
            <div className="set">
              우리팀을 대표할 배지를 선택하세요.(최대 4개)<br/>
              대표배지는 선택된 순서로 노출됩니다.
            </div>
              :
           <></>
          }
        </div>
        {changePage ?
        <div className="title">대표 뱃지<span><strong>0</strong>/4</span></div>
          :
          <div className="title">활동 뱃지<span><strong>{getCnt}</strong></span></div>
        }

        {
          updBadgeList && updBadgeList.length > 0 &&
          <section className="badgeWrap">
            {
              updBadgeList.map((data,index)=>
                <div className="badgeList" onClick={()=>{onClickBadge(data)}} key={index}>
                  <img src={`${data.bg_achieve_yn === 'n' ? data.bg_black_url : data.bg_color_url}`} alt={data.bg_name} />
                  {
                    statChk === 'm' && changePage && data.bg_achieve_yn === 'y' &&
                    <div className={`checkboxLabel ${data.bg_represent_yn === 'y' ? 'active' : ''}`} onClick={()=>{selectBadge(data.bg_code)}}>
                      <div className="checkBox"/>
                    </div>
                  }
                </div>
              )
            }
          </section>
        }


        {(statChk === 'm' && changePage) &&
          <section className="buttonWrap" onClick={onClickComplete}>
            <SubmitBtn text="완료"/>
          </section>
        }
      </CntWrapper>
      {badgePop &&
        <LayerPopup setPopup={setBadgePop}>
          <BadgeInfo closePop={clickPopup} statChk={statChk} badgeData={badgeData}/>
        </LayerPopup>
      }
    </div>
  )
}

export default TeamBadge;
