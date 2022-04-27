import React from 'react';

import './listRow.scss';
import errorImg from "pages/broadcast/static/img_originalbox.svg";

const ListRow = (props) => {
  const {photo, children, onClick, photoClick} = props;

  const handleImgError = (e) => {
    e.currentTarget.src = errorImg;
  };

  const handlePhotoClick = (e) => {
    e.stopPropagation();
    photoClick();
  };

  return (
    <div className="listRow" onClick={onClick}>
      <div className="photo" onClick={handlePhotoClick}>
        <img src={photo} alt="" onError={handleImgError}/>
      </div>
      {children}
    </div>
  )
}

export default ListRow

ListRow.defaultProps = {
  onClick: () => {},
  photoClick: () => {}
};