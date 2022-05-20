import React, {useState, useEffect, useRef} from 'react';
import {IMG_SERVER} from 'context/config'

import Header from 'components/ui/header/Header'
import DallaGroundRanking from './rankingtab/dallagroundranking';

import './style.scss'
import {useDispatch, useSelector} from "react-redux";
import {setDallaGroundListSet, setDallaGroundMyTeamInfoSet, setDallaGroundTabSet} from "redux/actions/event";
import API from "context/api";
import {useHistory} from "react-router-dom";

const DallaGround = () => {
  const mainTopRef = useRef()
  const tabRef = useRef()
  const dispatch = useDispatch();
  const history = useHistory();

  const globalState = useSelector(({globalCtx}) => globalCtx);
  const { dallaGroundTabType, rankingListInfo, myTeamInfo } = useSelector(state => state.event);

  const [tabFixed, setTabFixed] = useState(false)

  /* 랭킹 리스트 api */
  const getRankingList = () => {
    API.getDallaGroundRankingList().then(res => {
      const { result, data } = res;
      if(result === 'success') {
        dispatch(setDallaGroundListSet({ list: data.list, cnt: data.cnt }));
      }
    });
  }

  /* 나의 팀 랭킹 정보 api */
  const getMyTeamRankingInfo = () => {
    API.getDallaGroundMyRankingList().then(res => {
      const { code, data } = res;
      if(code === '1') {
        if(data.team_no) {
          dispatch(setDallaGroundMyTeamInfoSet({...data, isMyTeamExist: true}));
        }else {
          dispatch(setDallaGroundMyTeamInfoSet({...myTeamInfo, isMyTeamExist: true}));
        }
      }else if(code === '-2') {
        dispatch(setDallaGroundMyTeamInfoSet({...myTeamInfo, isMyTeamExist: false}));
      }
    })
  }

  const windowScrollEvent = () => {
    let scroll = window.scrollY || window.pageYOffset

    if (scroll >= mainTopRef.current?.clientHeight) {
      setTabFixed(true)
    } else {
      setTabFixed(false)
    }
  }

  // change tabState
  const tabChange = (tabType) => {
    dispatch(setDallaGroundTabSet(tabType))
  }

  // 팀 상세 페이지 이동
  const goTeamDetailPage = (teamNo) => {
    if (!globalState.baseData.isLogin) {
      history.push('/login');
    } else if (teamNo) {
      history.push(`/team/detail/${teamNo}`);
    }
  };

  useEffect(() => {
    if(dallaGroundTabType === 1) {
      getRankingList();

      if(globalState.token.isLogin) {
        getMyTeamRankingInfo();
      }
    }
  }, [dallaGroundTabType]);

  useEffect(() => {
    window.addEventListener('scroll', windowScrollEvent)

    return () => {
      window.removeEventListener('scroll', windowScrollEvent)
    }
  }, [])

  return (
    <div id="dallaGround">
      <Header type='back' title='이벤트'/>
      <section className="topWrap" ref={mainTopRef}>
        {
          dallaGroundTabType === 0 ?
            <img src={`${IMG_SERVER}/event/dallaground/mainTop-1.png`}/>
            :
            <img src={`${IMG_SERVER}/event/dallaground/mainTop-2.png`}/>
        }
      </section>
      <section className={`tabWrap ${dallaGroundTabType === 1 && 'bgGray'} ${tabFixed ? 'fixed' : ''}`} ref={tabRef}>
        <div className="tabBox">
          <button className={dallaGroundTabType === 0 ? 'active' : ''} onClick={() => {
            tabChange(0);
          }}>
            {
              dallaGroundTabType === 0 ?
                <img src={`${IMG_SERVER}/event/dallaground/tab-1-on.png`} alt="이벤트 내용" />
                :
                <img src={`${IMG_SERVER}/event/dallaground/tab-1-off.png`} alt="이벤트 내용" />
            }
           
          </button>
          <button className={dallaGroundTabType === 1 ? 'active' : ''} onClick={() => {
            tabChange(1);
          }}>
            {
              dallaGroundTabType === 1 ?
                <img src={`${IMG_SERVER}/event/dallaground/tab-2-on.png`} alt="이벤트 내용" />
                :
                <img src={`${IMG_SERVER}/event/dallaground/tab-2-off.png`} alt="이벤트 내용" />
            }
          </button>
          <div className="buttonBack"/>
        </div>
      </section>
      <section className="content">
        {
          dallaGroundTabType === 0 ?
            <img src={`${IMG_SERVER}/event/dallaground/content.png`} alt="이벤트 기간 동안 배틀 포인트를 쌓아 회식비를 쟁탈하라" />
            :
            <DallaGroundRanking rankingListInfo={rankingListInfo} myTeamInfo={myTeamInfo} goTeamDetailPage={goTeamDetailPage}
                                isLogin={globalState.token.isLogin}
            />
        }
      </section>
      <section className="noticeWrap">
        <p>주의사항</p>
        <ul>
          <li>동일 IP, 디바이스로 부계정을 만들어 어뷰징을 하는 경우, 이벤트 대상에서 제외 및 관련 커뮤니티 가이드라인에 의거하여 관련 디바이스, IP로 등록된 모든 계정이 처벌을 받을 수 있습니다.</li>
          <li>배틀 포인트가 동일한 경우, 팀 누적포인트가 높은 순으로 순위가 집계됩니다.</li>
          <li>커스텀 팀 심볼 제작은 최대 2주가 소요될 수 있습니다. 달라 디자인 가이드 및 저작권 등에 따라 디자인이 일부 변경될 수 있습니다. 팀 심볼은 영구 보존, 프레임/입장효과는 적용후 2주간 사용할 수 있습니다.</li>
          <li>이벤트 보상은 타인에게 양도할 수 없고, 이벤트 종료 후 2주 내에 팀장에게 일괄 지급됩니다.</li>
          <li>이벤트 보상(회식비)은 제세공과금(22%)이 발생합니다.</li>
        </ul>
        <div className="logoBox">
          <img src={`${IMG_SERVER}/common/logo/logo-white.png`} alt="dalla" />
        </div>
      </section>
    </div>
  );
};

export default DallaGround;