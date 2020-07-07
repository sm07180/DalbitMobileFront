import React, { useEffect, useContext, useState } from 'react';
import styled from 'styled-components';

// components
import Swiper from 'react-id-swiper';
import { Context } from 'context';
import { useHistory } from 'react-router-dom';
import Api from 'context/api';
import { OS_TYPE } from '../../../context/config';
import { Hybrid } from 'context/hybrid';

export default React.forwardRef((props, ref) => {
  const globalCtx = useContext(Context);
  const history = useHistory();
  const customHeader = JSON.parse(Api.customHeader);

  const [list, setList] = useState(false);

  const goEvent = (linkUrl, linkType) => {
    //alert(linkUrl)
    if (linkType === 'popup') {
      if (customHeader['os'] === OS_TYPE['Android']) {
        try {
          //Hybrid('openUrl', {"url": linkUrl})
          window.android.openUrl(JSON.stringify({ url: linkUrl }));
        } catch (e) {
          window.location.href = linkUrl;
        }
      } else if (
        customHeader['os'] === OS_TYPE['IOS'] &&
        (customHeader['appBulid'] > 68 || customHeader['appBuild'] > 68)
      ) {
        Hybrid('openUrl', linkUrl);
      } else {
        //window.open(linkUrl, '', 'height=' + screen.height + ',width=' + screen.width + 'fullscreen=yes')
        window.location.href = linkUrl;
      }
    } else {
      //globalCtx.action.updatenoticeIndexNum(linkUrl)
      window.location.href = linkUrl;
      //history.push(linkUrl)
    }
  };

  const createSliderList = () => {
    if (!list) return null;
    return list.map((banner, idx) => {
      const { bannerUrl, linkUrl, title, linkType } = banner;

      return (
        <div className="banner" key={`banner-${idx}`}>
          <img
            src={bannerUrl}
            alt={title}
            linkurl={linkUrl}
            linktype={linkType}
          />
        </div>
      );
    });
  };

  async function fetchBannerData() {
    const res = await Api.getBanner({
      params: {
        position: props.bannerPosition,
      },
    });
    if (res.result === 'success') {
      if (res.hasOwnProperty('data')) setList(res.data);
    } else {
      console.log(res.result, res.message);
    }
  }

  useEffect(() => {
    fetchBannerData();
  }, []);

  const params = {
    slidesPerColumnFill: 'row',
    resistanceRatio: 0,
    loop: true,
    autoplay: {
      delay: 5000,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    on: {
      click: (e) => {
        const { linkurl, linktype } = e.target.attributes;
        goEvent(linkurl.value, linktype.value);
      },
    },
  };

  return (
    <Banner ref={ref}>
      {list && <Swiper {...params}>{createSliderList()}</Swiper>}
    </Banner>
  );
});

const Banner = styled.div`
  padding: 0 16px;
  margin: 20px 0;
  .swiper-container {
    border-radius: 10px;
    .banner {
      /* overflow: hidden; */

      img {
        width: 100%;
        border-radius: 10px;
      }
    }
    .swiper-pagination-bullet-active {
      background: #ec455f;
    }
  }
  .swiper-pagination-fraction,
  .swiper-pagination-custom,
  .swiper-container-horizontal > .swiper-pagination-bullets {
    width: auto;
    bottom: 3px;
    left: inherit;
    right: 5px;
  }
`;
