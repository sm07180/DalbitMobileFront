import React, {useState, useEffect, useCallback, useRef} from 'react';
// scss
import './checkList.scss';
import {IMG_SERVER} from "context/config";
import {useHistory, useParams} from 'react-router-dom';
import {goProfileDetailPage} from "pages/profile/contents/profileDetail/profileDetail";

const FloatingBtn = (props) => {
  const {profileData} = props;
  const history = useHistory();
  const floatingRef = useRef();

  const [floatBtnHidden, setFloatBtnHidden] = useState(false); // 플로팅 버튼 온 오프
  const [floatScrollAction, setFloatScrollAction] = useState(false); // 플로팅 버튼 스크롤 이벤트

  const floatingOpen = () => {
    setFloatBtnHidden(!floatBtnHidden)
  }

  /* 플루팅 버튼 이벤트 */
  const floatScrollEvent = useCallback(() => {
    const floatNode = floatingRef.current;
    const scrollBottom = floatNode?.offsetTop;

    if (scrollBottom > 150) {
      setFloatScrollAction(true);
    } else {
      setFloatScrollAction(false);
    }
  }, []);

  const floatingButton1 = (e) => {
    e.stopPropagation;
    goProfileDetailPage({history, action:'write', type:'notice', memNo:profileData.memNo});
  }

  const floatingButton2 = (e) => {
    e.stopPropagation;
    goProfileDetailPage({history, action:'write', type:'feed', memNo:profileData.memNo});
  }

  // 플로팅 버튼 오픈시 스크롤 막기
  useEffect(() => {
    if (floatBtnHidden === true) {
      document.body.classList.add('overflowHidden')
    } else {
      document.body.classList.remove('overflowHidden')
    }
  }, [floatBtnHidden])

  useEffect(() => {
    document.addEventListener('scroll', floatScrollEvent);
    return () => {
      document.removeEventListener('scroll', floatScrollEvent);
    }
  },[])

  return (
    <button className={`floatBtn ${floatBtnHidden === true ? 'on' : ''}`} onClick={floatingOpen} ref={floatingRef}>
      <div className="blackCurtain"/>
      <div className={`floatWrap ${floatScrollAction === true ? 'action' : 'disAction'}`}>
        <ul>
          <li onClick={floatingButton1}>
            방송공지 쓰기
            <img src={`${IMG_SERVER}/profile/floating-btn-2.png`} alt="아이콘" />
          </li>
          <li onClick={floatingButton2}>
            피드 쓰기
            <img src={`${IMG_SERVER}/profile/floating-btn-1.png`} alt="아이콘" />
          </li>
        </ul>
      </div>
    </button>
  )
}

export default FloatingBtn;

FloatingBtn.defaultProps = {}