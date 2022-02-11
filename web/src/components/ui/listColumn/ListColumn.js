import React from 'react'

import './listColumn.scss';
import errorImg from "pages/broadcast/static/img_originalbox.svg";

const ListColumn = (props) => {
  const {photo, children, index} = props

  const handleImgError = (e) => {
    e.currentTarget.src = errorImg;
  };

  return (
    <div className="listColumn" data-swiper-index={index}>
      <div className="photo">
        <img src={photo} alt="" onError={handleImgError}/>
      </div>
      {children}
    </div>
  );
};

export default ListColumn;
