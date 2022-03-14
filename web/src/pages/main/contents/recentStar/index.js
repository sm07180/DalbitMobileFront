import React from 'react'
import {useDispatch, useSelector} from "react-redux";

import Lottie from 'react-lottie'

import Header from 'components/ui/header/Header'
import ListRow from 'components/ui/listRow/ListRow'

import {IMG_SERVER} from 'context/config'
import './style.scss'

const RecentStar = () => {

  const mainState = useSelector((state) => state.main);
  
  return (
    <div id="recentStar">
      <Header title="최근 접속한 스타" type="back"/>
      <section className="starList">
        <ListRow photo="">
          <div className="userNick">
            일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십
          </div>
          <div className="listBack">
            <div className="badgeLive">
              <span className="equalizer">
                <Lottie
                  options={{
                    loop: true,
                    autoPlay: true,
                    path: `${IMG_SERVER}/dalla/ani/equalizer_pink.json`
                  }}
                />
              </span>
              <div className="liveText">LIVE</div>
            </div>  
          </div>
        </ListRow>
        <ListRow photo="">
          <div className="userNick">
            일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십
          </div>
          <div className="listBack">
            <div className="badgeLive">
              <span className="follow"/>
              <div className="liveText">LIVE</div>
            </div>  
          </div>
        </ListRow>
      </section>
    </div>
  );
};

export default RecentStar;