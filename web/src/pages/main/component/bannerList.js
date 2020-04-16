import React, {useEffect} from 'react'
import styled from 'styled-components'

// components
import Swiper from 'react-id-swiper'

export default props => {
  const {list} = props
  console.log(list)
  const remoteNotice = () => {}
  return (
    <Banner>
      <Swiper>
        {list.map((banner, idx) => {
          const {bannerUrl} = banner

          return (
            <div className="banner" key={`banner-${idx}`} style={bannerUrl ? {backgroundImage: `url(${bannerUrl})`} : {}}></div>
          )
        })}
      </Swiper>
    </Banner>
  )
}

const Banner = styled.div`
  .swiper-container {
    .banner {
      height: 65px;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      border-radius: 10px;
    }
  }
`
