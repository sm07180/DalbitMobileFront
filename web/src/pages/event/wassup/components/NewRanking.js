import React, {useState, useContext} from 'react';
import {useHistory} from 'react-router-dom'
import {IMG_SERVER} from 'context/config'
import {Context} from 'context'

// global components
import GenderItems from 'components/ui/genderItems/GenderItems'
// components
import RankList from '../../components/rankList/RankList'

const RankingWrap = (props) => {
  const {tabmenuType} = props;
  const history = useHistory()
  const context = useContext(Context)
  const {token} = context

  return (
    <section className='rankingWrap'>
      <div className="rankingBox my">
        {token.isLogin ?
          <RankList photoSize={55} type="my">
            <div className="listContent">
              <div className="listItem">
                <GenderItems />
                <div className="nick">1111111111111111111111111111111111111</div>
              </div>
            </div>
            <div className="listBack center">
              <span>총점</span>
              <span className="numBox">
                <span className="num">0</span>점
              </span>
            </div>
          </RankList>
          :
          <div onClick={() => history.push('/login')} style={{cursor:'pointer'}}>
            <RankList photoSize={0} type="my">
              <div className="listContent">
                <div className="text">로그인하고 와썹맨이 되어보세요!</div>
              </div>
              <div className="listBack center">
                <span>총점</span>
                <span className="numBox">
                  <span className="num">0</span>점
                </span>
              </div>
            </RankList>
          </div>
        }
      </div>
      <div className="rankingBox">
        <RankList photoSize={55}>
          <div className="listContent">
            <div className="listItem">
              <GenderItems />
              <div className="nick">11111111111111111111111</div>
            </div>
          </div>
          <div className="listBack">
            <span className="numBox">
              <span className="num">0</span>점
            </span>
          </div>
        </RankList>
        <RankList photoSize={55}>
          <div className="listContent">
            <div className="listItem">
              <GenderItems />
              <div className="nick">2222222222222222222222</div>
            </div>
          </div>
          <div className="listBack">
            <span className="numBox">
              <span className="num">0</span>점
            </span>
          </div>
        </RankList>
        <RankList photoSize={55}>
          <div className="listContent">
            <div className="listItem">
              <GenderItems />
              <div className="nick">333333333333333333333</div>
            </div>
          </div>
          <div className="listBack">
            <span className="numBox">
              <span className="num">0</span>점
            </span>
          </div>
        </RankList>
        <RankList photoSize={55}>
          <div className="listContent">
            <div className="listItem">
              <GenderItems />
              <div className="nick">444444444444444444444444444</div>
            </div>
          </div>
          <div className="listBack">
            <span className="numBox">
              <span className="num">0</span>점
            </span>
          </div>
        </RankList>
        {/* <div className="noList">
          <img src={`${IMG_SERVER}/event/rebranding/list_none.png`} />
          <span>현재 랭킹 내역이 없어요.</span>
        </div> */}
      </div>
    </section>
  );
};

export default RankingWrap;