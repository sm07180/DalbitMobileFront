import React from 'react'

import './listColumn.scss'
import {PHOTO_SERVER} from "context/config";

const ListColumn = (props) => {
  const {photo, children, index, errorImg} = props

  const handleImgError = (e) => {
    e.currentTarget.src = `${PHOTO_SERVER}${errorImg}`;
  };

  return (
    <div className="listColumn" data-swiper-index={index}>
      <div className="photo">
        <img src={photo} alt="" onError={handleImgError}/>
      </div>
      {children}
    </div>
  )
}

ListColumn.defaultProps = {
  errorImg: "/clip_3/clipbg_200910_1.jpg?100x100"
};

export default ListColumn;
