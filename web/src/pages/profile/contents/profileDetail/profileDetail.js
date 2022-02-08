import React, {useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import {IMG_SERVER} from 'context/config'

import Api from 'context/api'
// global components
import Header from 'components/ui/header/Header'
import ListRow from 'components/ui/listRow/ListRow'
// components
// contents
// css
import './profileDetail.scss'

const ProfileDetail = () => {
  const history = useHistory()
  //context
  const context = useContext(Context)
  const {token, profile} = context
  const [textValue, setTextValue] = useState('');

  const onChangeTextarea = (e) => {
    const textareaValue = e.target.innerHTML
    console.log(textareaValue,textValue);
    setTextValue(textareaValue)
  }

  // 페이지 시작
  return (
    <div id="profileDetail">
      <Header type={'back'}>
        <div className="buttonGroup">
          <div className='moreBtn'>
            <img src={`${IMG_SERVER}/common/header/icoMore-b.png`} alt="" />
            <div className="isMore">
              <button>수정하기</button>
              <button>삭제하기</button>
              {/* <button>차단/신고하기</button> */}
            </div>
          </div>
        </div>
      </Header>
      <section className='detailWrap'>
        <div className="detail">
          <ListRow photo={profile.profImg.thumb50x50}>
            <div className="listContent">
              <div className="nick">{profile.nickNm}</div>
              <div className="time">3시간전</div>
            </div>
          </ListRow>
          <div className="text">
          일주년 일부 방송 끝!
          신년이기도 하고 1일이라 바쁘신 분들도 많으실텐데
          와주신 모든 분들 너무 감사합니다!  
          내일 오후에는 정규 시간, 룰렛으로  만나요 : )<br/>
          <br/>
          *1/2 수정되엉ㅆ따 
          </div>
          <div className="info">
            <i className='comment'></i>
            <span>321</span>
          </div>
        </div>
        <div className='listWrap'>
          <ListRow photo={profile.profImg.thumb50x50}>
            <div className="listContent">
              <div className="listItems">
                <div className="nick">{profile.nickNm}</div>
                <div className="time">3시간전</div>
              </div>
              <div className="listItems">
                <div className="text">오빠 방송 너무 잘보고 있어요~~ 오늘도 화이팅 하세요!
                NEXT LEVEL 신청곡 들려주세요 ! </div>
              </div>
              <div className="listItems">
                <i className='like'></i>
                <span>123</span>
              </div>
            </div>
          </ListRow>
          <ListRow photo={profile.profImg.thumb50x50}>
            <div className="listContent">
              <div className="listItems">
                <div className="nick">{profile.nickNm}</div>
                <div className="time">3시간전</div>
              </div>
              <div className="listItems">
                <div className="text">오빠 방송 너무 잘보고 있어요~~ 오늘도 화이팅 하세요!
                NEXT LEVEL 신청곡 들려주세요 ! </div>
              </div>
              <div className="listItems">
                <i className='like'></i>
                <span>123</span>
              </div>
            </div>
          </ListRow>
        </div>
        <div className='bottomWrite'>
          <div className={`trickTextarea ${textValue.length > 0 && 'isText'}`} onKeyUp={onChangeTextarea} contentEditable="true"></div>
          <button className=''>등록</button>
        </div>
      </section>
    </div>
  )
}

export default ProfileDetail
