import React, {useEffect, useState, useContext} from 'react'

import Header from 'components/ui/new_header'

import './dallaStore.scss'

const DallaStore = () => {

  const swiperParams = {
    slidesPerView: 'auto',
    spaceBetween: 2, 
  }

  return (
    <div id="dallaStore">
      <Header title="스토어"></Header>
      <section>
        <div className="mydalWrap">
          내가 보유한 달
          <span className='mydal'>2,310</span>
        </div>
      </section>
      <section>
        <div className="bannerWrap">
          <div className="banner"></div>
        </div>
      </section>
      <section>
        <div className="ListWrap">
          <div className="list">
            <div className="dalIcon"></div>
            <div className="dalCnt">10</div>
            <div className="dalPrice">1,100</div>
          </div>
        </div>
      </section>
      <section></section>
      <section></section>
      <section></section>
    </div>
  )
}

export default DallaStore