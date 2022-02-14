// React
import React, {useEffect, useState, useContext} from 'react'

import Swiper from 'react-id-swiper'

import { postImage } from "common/api";
import { GlobalContext } from "context";

import './imageUpload.scss'

const ImageUpload = (props) => {
  const {title, subTitle} = props
  const { globalAction } = useContext(GlobalContext);

  const [imageFile, setImageFile] = useState([]);
  
  const swiperParams = {
    slidesPerView: 'auto',
    spaceBetween: 8,
  }  

  const addFile = (e) => {
    const target = e.currentTarget;
    if (target.files.length === 0) return;
    let reader = new FileReader();
    const file = target.files[0];

    const fileName = file.name;

    const fileSplited = fileName.split(".");
    const fileExtension = fileSplited.pop().toLowerCase();
    //
    const extValidator = (ext) => {
      const list = ["jpg", "jpeg", "png", "PNG"];
      return list.includes(ext);
    };
    if (!extValidator(fileExtension)) {
      globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          content: "jpg, png 이미지만 사용 가능합니다.",
        });
      return;
    }
    reader.readAsDataURL(target.files[0]);
    reader.onload = async () => {
      if (reader.result) {
        const res = await postImage({
          dataURL: reader.result,
          uploadType: "exchange",
        });
        if (res.result === "success") {
          setImageFile(imageFile.concat(reader.result));
        }
      }
    };
  };

  const removeImage = (index) => {
    const tempImage = imageFile.concat([]);
    tempImage.splice(index, 1)

    setImageFile(tempImage);
  }

  return (
    <div className='imageUpload'>
      <div className='titleWrap'>
        <span className='title'>{title}</span>
        <span className='subTitle'>{subTitle}</span>
      </div>
      <div className='uploadWrap'>
        <label className='uploadlabel'>
          <input className='blind' type="file" onChange={addFile}/>
        </label>
        {imageFile.length > 0 && 
          <div className='uploadListWrap'>
            <Swiper {...swiperParams} key={Math.random()}>
              {imageFile.map((list, index) => {
                return (
                  <div className='uploadList' key={index}>
                    <img src={list} alt="업로드이미지"/>
                    <button type="button" className='removeFile' onClick={() => removeImage(index)}></button>
                  </div>
                )
              })}    
            </Swiper>
          </div>
        }        
      </div>
    </div>
  )
}

export default ImageUpload
