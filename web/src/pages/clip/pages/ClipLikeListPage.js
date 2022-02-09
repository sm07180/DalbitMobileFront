import React, {useEffect, useState, useContext} from 'react';
import ClipDetail from "pages/clip/components/ClipDetail";
import Header from "components/ui/header/Header";
import Swiper from "react-id-swiper";
import TabBtn from "components/ui/tabBtn/TabBtn";
import FilterBtn from "pages/clip/components/FilterBtn";

import '../scss/clipDetail.scss';

const ClipDetailPage = (props) => {
  const clipTabmenu = ['ALL','커버/노래','작사/작곡','힐링','수다/대화','ASMR','고민/사연','성우','더빙'];

  return (
    <div>
      <Header title={`좋아요한 클립`} type={'back'} />
      <section className="filterWrap">
        <div className="tabmenu">
          {clipTabmenu && clipTabmenu.length > 0 &&
          <Swiper {...swiperParams}>
            {clipTabmenu.map((data, index)=>{
              const param ={
                item: data,
                tab: clipType,
                setTab: setClipType,
                // setPage: setPage
              }
              return(
                <ul key={index}>
                  <TabBtn param={param} />
                </ul>
              )
            })}
          </Swiper>
          }
        </div>
        {clipType === clipTabmenu[0] &&
        <div className="filterGroup">
          <FilterBtn data={filterAlignList} />
          <FilterBtn data={filterDateList} />
        </div>
        }
      </section>
    </div>
  );
};

export default ClipDetailPage;