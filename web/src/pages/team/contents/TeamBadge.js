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
import BadgeInfo from '../components/popup/BadgeInfo';
// scss
import '../scss/teamBadge.scss';
import {useSelector} from "react-redux";

const TeamBadge = (props) => {
  const history = useHistory();
  const context = useContext(Context);
  const memberRdx = useSelector((state)=> state.member);
  const [badgePop, setBadgePop] = useState(false);
  const [statChk, setStatChk]=useState(""); // 권한 체크용 [m: 마스터 , t: 일반회원 , n: 미가입자]
  const [changePage,setChangePage]=useState(false);
  const [badgeList,setBadgeList]=useState([]);
  const [getCnt,setGetCnt]=useState(0);  // 활동뱃지 얻은 갯수
  const [badgeData, setBadgeData]=useState({})
  const teamNo = props.match.params.teamNo;
  let selectBadgeList =[];

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
        setBadgeList(res.data.list);
        setStatChk(res.data.statChk);
        setGetCnt(res.data.cnt)
      }
    })
  }

  const selectBadge=(code)=>{


  }

  const clickPopup = () => {
    setBadgePop(!badgePop);
  };

  const onClickBadge = (data) => {
    if(changePage) return false
    setBadgeData(data)
    setBadgePop(true);
  };
  
  // 페이지 시작
  return (
    <div id="teamBadge">
      <Header title="뱃지리스트" type="back" />
      <CntWrapper>
        <div className="text">
          {(statChk === 'm' && !changePage) ?
            <div>
              팀 화면에 보여질 대표배지를 설정할 수 있습니다.
              <button onClick={()=>setChangePage(true)}>설정</button>
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

        <section className="badgeList">
          {badgeList.map((data,index)=>{
            return(
              <label className="badgeItem" onClick={()=>onClickBadge(data)} key={index}>
                {data.bg_achieve_yn === 'n' && <img src={`${data.bg_black_url}`} alt={data.bg_name} />}
                {data.bg_achieve_yn === 'y' && <img src={`${data.bg_color_url}`} alt={data.bg_name} />}
                {(statChk === 'm' && changePage) &&
                <div className="checkboxLabel" onClick={()=>{selectBadge(data.bg_code)}}>
                  {data.bg_achieve_yn === 'y' && <input type="checkbox" className="blind" />}
                  <div className="checkBox"/>
                </div>
                }
              </label>
            )
          })}

        </section>

        {(statChk === 'm' && changePage) &&
          <section className="buttonWrap" onClick={()=>setChangePage(false)}>
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