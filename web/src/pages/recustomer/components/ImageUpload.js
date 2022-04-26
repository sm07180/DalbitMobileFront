// React
import React from 'react'

import Swiper from 'react-id-swiper'

import './imageUpload.scss'

const ImageUpload = (props) => {
  const {title, subTitle, onChange, onClick, imgFile} = props

  const swiperParams = {
    slidesPerView: 'auto',
    spaceBetween: 8,
  }

  return (
    <div className='imageUpload'>
      <div className='titleWrap'>
        <span className='title'>{title}</span>
        <span className='subTitle'>{subTitle}</span>
      </div>
      <div className='uploadWrap'>
        <label className='uploadlabel'>
          <input className='blind' type="file" onChange={onChange}/>
        </label>
          <div className='uploadListWrap'>
            <Swiper {...swiperParams} key={Math.random()}>
              {imgFile.map((list, index) => {
                return (
                  <div className='uploadList' key={index}>
                    <img src={list} alt="업로드이미지"/>
                    <button type="button" className='removeFile' data-idx={index} onClick={onClick}/>
                  </div>
                )
              })}
            </Swiper>
          </div>

      </div>
    </div>
  )
}

export default ImageUpload
