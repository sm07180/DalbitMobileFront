import React from 'react';

import {IMG_SERVER} from 'context/config'

import Header from 'components/ui/header/Header'

import './style.scss'


const ContentBroadcast = () => {

  return (
    <div id="contentBroadcast">
      <Header title="콘텐츠방송" type="back"/>
      <section className="content">
        <img src={`${IMG_SERVER}/event/contentBroadcast/giyoo_auction.png`} alt="StarDJ 애장품 경매 with GIYOO" />
      </section>
    </div>
  );
};

export default ContentBroadcast;