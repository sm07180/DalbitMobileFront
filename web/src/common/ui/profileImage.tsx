import React, { useContext, useMemo, useState, useCallback } from "react";
const defaultImg = "https://photo.dallalive.com/profile_3/profile_m_200327.jpg";
export default (props: any) => {
  const { imageData, imageSize } = props;
  const { profImg, holderBg, holder, level } = imageData;
  const imgSize = imageSize;
  const holderSize = imageSize * 1.36;
  const holderBgSize = imageSize * 2;

  console.log(imageData);
  const profileImg = useMemo(() => {
    if (profImg && profImg !== null) {
      return profImg;
    } else {
      return defaultImg;
    }
  }, [profImg]);
  const profileImgSize = useMemo(() => {
    if (holderBg && holderBg !== null) {
      return holderBgSize;
    } else if (holder && holder !== null) {
      return holderSize;
    } else {
      return imgSize;
    }
  }, [profImg]);

  return (
    <div className="profileImage" style={{ width: profileImgSize + `px`, height: profileImgSize + `px` }}>
      {level > 50 ? (
        <div
          className="holderBg"
          style={{
            backgroundImage: `${holderBg ? `url(${holderBg}` : `none`})`,
            width: holderBg ? holderBgSize : holder ? holderSize : imgSize + `px`,
            height: holderSize + `px`,
          }}
        >
          {holder && (
            <img src={holder} className="holder" alt="holder frame" width={`${holderSize}px`} height={`${holderSize}px`} />
          )}
          <img src={profileImg} className="thumb" alt="프로필사진" width={`${imgSize}px`} height={`${imgSize}px`} />
        </div>
      ) : (
        <>
          {holder && (
            <img src={holder} className="holder" alt="holder frame" width={`${holderSize}px`} height={`${holderSize}px`} />
          )}
          <img src={profileImg} className="thumb" alt="프로필사진" width={`${imgSize}px`} height={`${imgSize}px`} />
        </>
      )}
    </div>
  );
};
