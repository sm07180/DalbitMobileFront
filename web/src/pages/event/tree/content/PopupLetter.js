import React, {useContext, useEffect, useState} from 'react';
import Swiper from 'react-id-swiper';
import {IMG_SERVER, PHOTO_SERVER} from 'context/config';
import './popup.scss';
import Api from "context/api";
import {Context} from "context";

const PopupLetter = (props) => {
  const { onClose, seqNo } = props;

  const context = useContext(Context);
  const [pageInfo, setPageInfo] = useState({ pageNo: 1, pagePerCnt: 5 });
  const [listInfo, setListInfo] = useState({ cnt: 0, list: []});

  const swiperParams = {
    pagination: {
      el: '.swiper-letter'
    }
  };

  // 사연 장식 리스트 가져오기
  const getStoryListInfo = () => {
    Api.getLikeTreeDecoList({ seqNo, ...pageInfo }).then(res => {
      if (res.code === '00000') {
        const { cnt, list } = res.data;
        if (cnt < 0) {
          context.action.alert({msg: '사연이 존재하지 않습니다'});
          onClose();
        } else {
          setListInfo({cnt, list});
        }
      } else {
        console.log(res);
      }
    }).catch(e => console.log(e));
  };

  const wrapClick = (e) => {
    const target = e.target
    if (target.id === 'popup') {
      onClose();
    };
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, []);

  useEffect(() => {
    getStoryListInfo();
  }, [pageInfo]);

  return (
    <div id="popup" onClick={wrapClick}>
      <div className="wrapper letter">
        <Swiper {...swiperParams}>
          {listInfo.list.map((row, index) => {
            return (
              <div className="letterList" key={index}>
                <div className="head">
                  <div className="photo">
                    {row.imageProfile !== '' ? (
                      <img style={{width: '100%'}} src={`${PHOTO_SERVER}${row.imageProfile}?120x120`} alt={row.memNick} />
                    ) : (
                      <img style={{width: '100%'}} src={`${PHOTO_SERVER}/profile_3/profile_m_200327.jpg`} alt={row.memNick} />
                    )}
                  </div>
                  <div className="userId">{`${row.memNick}의 편지`}</div>
                </div>
                <div className="letter">
                  {row.storyConts}
                  <div className="date">{row.insDate}</div>
                </div>
              </div>
            )
          })}
        </Swiper>
        <button className="closeBtn2" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  )
}

PopupLetter.defaultProps = {
  seqNo: 1
};

export default PopupLetter;