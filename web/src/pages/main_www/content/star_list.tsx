import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

// component
import Swiper from "react-id-swiper";

export default function MyStar(props: any) {
  const history = useHistory();
  const { list } = props;

  const swiperParams: any = {
    slidesPerView: "auto",
    spaceBetween: 8,
  };

  return (
    <div className="myStar inner">
      <Swiper {...swiperParams}>
        {list &&
          list.map((star, idx) => {
            const { memNo, roomNo } = star;
            return (
              <div
                className="starListItem"
                key={`star-list${idx}`}
                onClick={() => {
                  // if (roomNo !== undefined && roomNo !== '') {
                  //   if (ctx.adminChecker === true) {
                  //     ctx.action.confirm_admin({
                  //       //콜백처리
                  //       callback: () => {
                  //         RoomJoin({
                  //           roomNo: roomNo + '',
                  //           shadow: 1
                  //         })
                  //       },
                  //       //캔슬콜백처리
                  //       cancelCallback: () => {
                  //         RoomJoin({
                  //           roomNo: roomNo + '',
                  //           shadow: 0
                  //         })
                  //       },
                  //       msg: '관리자로 입장하시겠습니까?'
                  //     })
                  //   } else {
                  //     RoomJoin({
                  //       roomNo: roomNo + ''
                  //     })
                  //   }
                  // } else {
                  //   saveUrlAndRedirect(`/mypage/${memNo}`)
                  // }
                  // 20.08.25
                  history.push(`/mypage/${memNo}`);
                }}
              >
                <div className="thumb">
                  <img src={star.profImg.thumb150x150} className="thumbImg" alt="thumb" />

                  {roomNo !== undefined && roomNo !== "" && <em className="icon_wrap icon_live icon_live_star">라이브중</em>}
                </div>
                <p className="text">{star.nickNm}</p>
              </div>
            );
          })}
      </Swiper>
    </div>
  );
}
