import React, {useState, useEffect} from 'react'
import {IMG_SERVER} from 'context/config'
import Utility from "components/lib/utility";
// global components
import Header from 'components/ui/header/Header'
import BadgeItems from 'components/ui/badgeItems/BadgeItems'
// contents
import Round_1 from './contents/Round_1'
// import Round_2 from './contents/Round_2'
// import Round_3 from './contents/Round_3'

import './style.scss'

const Rebranding = (props) => {
  // 

  return (
    <div id="rebranding">
      <Header title="이벤트" type="back" />
      <section>
        <img src={`${IMG_SERVER}/event/rebranding/bg-1.png`} alt="이벤트 이미지" />
      </section>
      <section>
        <img src={`${IMG_SERVER}/event/rebranding/bg-2.png`} alt="이벤트 이미지" />
        <button>
          <img src={`${IMG_SERVER}/event/rebranding/btn-1.png`} alt="버튼 이미지" />
        </button>
      </section>
      <section>
        <img src={`${IMG_SERVER}/event/rebranding/bg-3.png`} alt="이벤트 이미지" />
        <button>
          <img src={`${IMG_SERVER}/event/rebranding/btn-1.png`} alt="버튼 이미지" />
        </button>
      </section>
      <section>
        <img src={`${IMG_SERVER}/event/rebranding/bg-4.png`} alt="이벤트 이미지" />
        <div className="stoneWrap">
          <button>
            <img src={`${IMG_SERVER}/event/rebranding/stoneBtn-1.png`} alt="이벤트 이미지" />
          </button>
          <button>
            <img src={`${IMG_SERVER}/event/rebranding/stoneBtn-1.png`} alt="이벤트 이미지" />
          </button>
          <img src={`${IMG_SERVER}/event/rebranding/sign.png`} className="sign" />
          <button>
            <img src={`${IMG_SERVER}/event/rebranding/stoneBtn-2.png`} alt="이벤트 이미지" />
          </button>
        </div>
      </section>
      <div className="tabmenuWrap">
        <div className="tabmenu">
          <li className="active">
            <img src={`${IMG_SERVER}/event/rebranding/tabmenu-1.png`} alt="" />
          </li>
          <li>
            <img src={`${IMG_SERVER}/event/rebranding/tabmenu-2.png`} alt="" />
          </li>
          <li>
            <img src={`${IMG_SERVER}/event/rebranding/tabmenu-3.png`} alt="" />
          </li>
        </div>
      </div>
      <Round_1 />
      {/* <Round_2 />
      <Round_3 /> */}
    </div>
  )
}

export default Rebranding
