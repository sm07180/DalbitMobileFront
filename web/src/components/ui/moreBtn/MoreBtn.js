import React, {useEffect, useRef} from 'react';
// scss
import "./moreBtn.scss";
import {IMG_SERVER} from "context/config";

const MoreBtn = (props) => {
  const {index, children} = props;
  const moreRef = useRef([]);

  {/* 더보기 박스 열기 */}
  const moreBoxOpenAction = (target) => {
    target.classList.remove('hidden');
    target.classList.add('open');
  }

  {/* 더보기 박스 닫기 */}
  const moreBoxCloseAction = (target) => {
    target.classList.add('hidden')
    target.classList.remove('open')
  }

  {/* 피드 더보기 박스 클릭 */}
  const moreBoxClick = (index) => {
    const currentTarget = moreRef.current[index];
    const prevTarget = document.getElementsByClassName('isMore open')[0];

    if (prevTarget) {
      moreBoxCloseAction(prevTarget);
    }
    if (prevTarget !== currentTarget) {
      if (currentTarget.classList.contains('hidden')) {
        moreBoxOpenAction(currentTarget)
      } else {
        moreBoxCloseAction(currentTarget);
      }
    }
  }

  {/* 피드 더보기 박스 닫기 (외부 클릭) */}
  const moreBoxClose = (e) => {
    if(!e.target.classList.contains('moreIcon')) {
      const target = document.getElementsByClassName('isMore open')[0];
      if(target) {
        moreBoxCloseAction(target);
      }
    }
  }
  
  useEffect(() => {
    document.addEventListener('click', moreBoxClose);
    return () => document.removeEventListener('click', moreBoxClose);
  }, []);

  return (
    <div id="moreBtn" onClick={() => moreBoxClick(index)}>
      <img className="moreIcon" src={`${IMG_SERVER}/common/header/icoMore-b.png`} alt="더보기" />
      <div ref={(el) => moreRef.current[index] = el} className="isMore hidden">
        {children}
      </div>
    </div>
  )
}

export default MoreBtn;
