import React, {useEffect, useState, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import Utility, {isHitBottom, addComma} from 'components/lib/utility'
import Api from 'context/api'
import {IMG_SERVER, PHOTO_SERVER} from 'context/config'

// Component
import EventComment from '../../components/comment'
import PopupNotice from './PopupNotice'
import PopupResult from './PopupResult'
import PopupLetter from './PopupLetter'
import {Context} from 'context'
import {authReq} from "pages/self_auth";

// 좋아요 트리만들기 Content Component
const Tree = (props) => {
  const context = useContext(Context);
  const history = useHistory();
  const [makePopInfo, setMakePopInfo] = useState(false); // 트리 만드는 법 & 트리 완성 보상 팝업 정보
  const [presentPopInfo, setPresentPopInfo] = useState({open: false}); // 선물 팝업 정보
  const [letterPopInfo, setLetterPopInfo] = useState({open: false, seqNo: 0}); // 편지 팝업 정보
  const [mainListInfo, setMainListInfo] = useState({step: 0, totScoreCnt: 0, list: [], limitScore: 150000, mainPerCnt: 0}); // 메인 리스트 정보
  const [storyListInfo, setStoryListInfo] = useState({cnt: 0, list: [] }); // 사연리스트 정보
  const [storyPageInfo, setStoryPageInfo] = useState({pageNo: 1, pagePerCnt: 30}); // 사연 검색 정보
  const [storyInputInfo, setStoryInputInfo] = useState({ cont: '' }); // 사연 입력 정보

  // 메인 리스트 가져오기
  const getMainListInfo = () => {
    Api.getLikeTreeMainList().then(res => {
      if (res.code === '00000') {
        setMainListInfo({ ...mainListInfo, ...res.data, mainPercent: Math.floor(res.data.totScoreCnt/mainListInfo.limitScore) });
      } else {
        console.log(res);
      }
    }).catch(e => console.log(e));
  };

  // 사연 리스트 가져오기
  const getStoryListInfo = () => {
    Api.getLikeTreeStoryList(storyPageInfo).then(res => {
      if (res.code === '00000') {
        const { cnt, list } = res.data;
        let temp = [];
        list.forEach(value => {
          temp.push({

          })
        });
        setStoryListInfo(res.data);
      } else {
        console.log(res);
      }
    })
  };

  // 사연 등록하기
  const putStoryCont = (value) => {
    if ( value === undefined || value === '' ) return;

    const params = {storyConts: value};
    Api.likeTreeStoryIns(params).then(res => {
      if (res.code === '00000') {
        console.log(res);
      } else {
        console.log(res);
      }
    }).catch(e => console.log(e));
  }

  // 사연 수정하기
  const updStoryCont = () => {
    const params = {storyConts: ''};
    Api.likeTreeStoryUpd(params).then(res => {
      if (res.code === '00000') {
        console.log(res);
      } else {
        console.log(res);
      }
    }).catch(e => console.log(e));
  }

  // 사연 삭제하기
  const delStoryCont = () => {
    const params = {storyConts: ''};
    Api.likeTreeStoryDel(params).then(res => {
      if (res.code === '00000') {
        console.log(res);
      } else {
        console.log(res);
      }
    }).catch(e => console.log(e));
  };

  // 사연 state 관리
  const handleStoryInput = (value) => {
    console.log(value);
  }

  // 트리 만드는 법 팝업 열기 이벤트
  const makePopOpen = () => {
    setMakePopInfo(true);
  };

  // 트리 만드는 법 팝업 닫기 이벤트
  const makePopClose = () => {
    setMakePopInfo(false);
  };

  // 선물 받기 클릭
  const rcvPresentClick = async () => {
    const res = await Api.self_auth_check({})
    if(res.result === 'success') { // 인증 됨
      context.action.confirm({
        callback: () => rcvPresent(res.data.phoneNo) // 선물 받기
        , cancelCallback: () => {}
        , msg: '여러개의 계정을 소유하고 있더라도\n본인의 계정 중 1개의 계정으로만 완료보상을 수령할 수 있습니다.\n현재 계정으로 완료 보상을 수령하시겠습니까?'
      })
    }else { // 인증 안됨
      context.action.confirm({
        callback: () => authReq('10', context.authRef, context) // 본인 인증 하기
        , cancelCallback: () => {}
        , msg: '트리 완성 보상을 받기 위해서는\n본인인증이 필요합니다.'
      })
    }
  }

  // 선물 받기
  const rcvPresent = (memPhone) => {
    Api.likeTreeRewardIns({ memPhone }).then(rewardRes => {
      if(rewardRes.code === '00000') {
        presentPopOpen(); // 결과 팝업
      }else {
        context.action.alert({ msg: rewardRes.message });
      }
    });
  };

  // 선물 받기 성공
  const presentPopOpen = () => {
    setPresentPopInfo({...presentPopInfo, open: true} );
  };

  // 선물 받기 팝업 닫기 이벤트
  const presentPopClose = () => {
    setPresentPopInfo({...presentPopInfo, open: false} );
  };

  // 사연 보기 팝업 열기 이벤트
  const letterPopOpen = (e) => {
    const { targetNum } = e.currentTarget.dataset;

    if (targetNum !== undefined) {
      setLetterPopInfo({ ...letterPopInfo, open: true, seqNo: targetNum } );
    }
  };

  // 사연 보기 팝업 닫기 이벤트
  const letterPopClose = () => {
    setLetterPopInfo({ ...letterPopInfo, open: false } );
  };

  // 사연 리셋 함수
  const resetStoryList = () => {
    setStoryPageInfo({ pageNo: 1, pagePerCnt: 30 });
  };

  useEffect(() => {
    getStoryListInfo();
  }, [storyPageInfo]);

  useEffect(() => {
    //비로그인일때 페이지 팅김
    if (!context.token.isLogin) {
      history.push('/login');
    } else {
      getMainListInfo();
    }
  }, []);

  return (
    <>
      <section className="term">
        <img src={`${IMG_SERVER}/event/tree/treeBg-2.png`} className="bgImg" />
        <button onClick={makePopOpen}>
          <img src={`${IMG_SERVER}/event/tree/treeBtn-1.png`} />
        </button>
      </section>
      <section className="treeContents">
        <img src={`${IMG_SERVER}/event/tree/treeContents-1.webp`} className="treeImg" />

        {mainListInfo.list.map((row, index) => {
          return (
            <div className={`treeItem item${index+1}`} data-target-num={index + 1} onClick={letterPopOpen} key={index}>
              <div className="photo">
                {row.imageProfile !== '' ? (
                  <img src={`${IMG_SERVER}/event/tree/treeBg-2.png`} />
                ) : (
                  <img style={{width: '100%'}} src={`${PHOTO_SERVER}/profile_3/profile_m_200327.jpg`} alt={row.memNick} />
                )}
              </div>
              <div className="ribbon"/>
            </div>
          )
        })}
        <div className="treeBottom">
          {
            {
              2: <img src={`${IMG_SERVER}/event/tree/treeTextStart.png`} className="treeText" alt="방송방의 좋아요와 라이브 부스트로 함께 트리를 만들어주세요!"/>,
              1: <button  onClick={rcvPresentClick}><img src={`${IMG_SERVER}/event/tree/treeBtn-on.png`} alt="선물 받기"/></button>,
              3: <button><img src={`${IMG_SERVER}/event/tree/treeBtn-off.png`} alt="선물 받기(완료)" /></button>
            }[mainListInfo.step]
          }
        </div>
        <div className="treeEventBox">
          <div className="countBox">
            {Utility.addComma(mainListInfo.totScoreCnt)}
            <span> /{Utility.addComma(mainListInfo.limitScore)}</span>
          </div>
          <div className="gaugeBox">
            <div className="gaugeBar" style={{width: `${mainListInfo.mainPercent}%`}}>
              <div className="gaugePointer">
                <span/>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <img src={`${IMG_SERVER}/event/tree/treeBg-3.png`} className="bgImg" />
      </section>
      <section className="commentContainer">
        <EventComment commentList={storyListInfo.list} totalCommentCnt={storyListInfo.cnt} commentAdd={putStoryCont} commentUpd={updStoryCont} commentDel={delStoryCont}
                      commentTxt={storyInputInfo.cont} setCurrentPage={resetStoryList} maxLength={100} contPlaceHolder={'욕설이나 도배, 타인을 비하하는 내용은 제재조치 될 수 있습니다.'}/>
      </section>
      {makePopInfo &&  <PopupNotice onClose={makePopClose}/>}
      {presentPopInfo.open && <PopupResult onClose={presentPopClose}/>}
      {letterPopInfo.open && <PopupLetter onClose={letterPopClose} seqNo={letterPopInfo.seqNo}/>}
    </>
  )
};

export default Tree;