import React, {useState, useContext, useMemo, useEffect} from 'react'
import Swiper from 'react-id-swiper'
import {Context} from 'context'

const IMAGE_THUMB_L = 'thumb700x700'

const MultiImageViewer = () => {
  const globalCtx = useContext(Context)
  const {multiViewer} = globalCtx
  const [currentSlide, setCurrentSlide] = useState(multiViewer.initSlide === undefined ? 0 : multiViewer.initSlide)
  const totalSlidesCnt = useMemo(() => multiViewer.list.length, [multiViewer])

  const params = {
    initialSlide: multiViewer.initSlide === undefined ? 0 : multiViewer.initSlide,
    slidesPerView: 1,
    spaceBetween: 1,
    on: {
      slideChange: function () {
        setCurrentSlide(this.realIndex)
      }
    }
  }

  const handleClose = () => {
    globalCtx.action.updateMultiViewer({show: false})
  }

  useEffect(() => {
    if (multiViewer.show) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [multiViewer.show])

  return (
    <div id="profileImgPop" className="overlay">
      <div className="header">
        <button className="close" onClick={handleClose}>
          닫기
        </button>
      </div>
      <div className={`img_area`}>
        <Swiper {...params}>
          {multiViewer.list?.map((img) => (
            <div className="keen-slider__slide" key={img.profImg.path}>
              <div className={`img_wrap`}>
                <img src={img.profImg[IMAGE_THUMB_L]} alt={img.profImg.path} />
              </div>
            </div>
          ))}
        </Swiper>
      </div>
      <div className="footer">
        <p className="navi">{`${currentSlide + 1} / ${totalSlidesCnt}`}</p>
      </div>
    </div>
  )
}

export default MultiImageViewer
