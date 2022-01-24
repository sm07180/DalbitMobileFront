import React, {useState} from 'react'

import Swiper from 'react-id-swiper'

import ShowSwiper from 'components/ui/showSwiper/showSwiper'

import './topSwiper.scss'

const TopSwiper = (props) => {
  const {data} = props
  const [showSlide,setShowSlide] = useState({open: false});

  const openShowSlide = () => {
    console.log(showSlide);
    setShowSlide({...showSlide, open:true})
  }
  
  const swiperPicture = {
    slidesPerView: 'auto',
    spaceBetween: 8,
    autoplay: {
      delay: 100000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction'
    }
  }

  return (
    <>
      <Swiper {...swiperPicture}>
        <div onClick={openShowSlide}>
          <div className="photo">
            <img src={data && data.profImg && data.profImg.thumb500x500} alt="" />
          </div>
        </div>
        <div onClick={openShowSlide}>
          <div className="photo">
            <img src={data && data.profImg && data.profImg.thumb500x500} alt="" />
          </div>
        </div>
      </Swiper>
      {showSlide.open === true && <ShowSwiper data={data} popClose={setShowSlide} />}
    </>
  )
}

export default TopSwiper
