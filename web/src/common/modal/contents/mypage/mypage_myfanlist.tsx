// tab navigation
import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
// api
import { getFanList, postAddFan, deleteFan } from "common/api";
import "./mypage_modal.scss";
import { DalbitScroll } from "common/ui/dalbit_scroll";
import {useSelector} from "react-redux";

export default (props) => {
  const modalState = useSelector(({modalCtx}) => modalCtx);
  const history = useHistory();
  const [list, setList] = useState([
    {
      nickNm: "",
      memNo: "",
      profImg: {
        thumb62x62: "",
      },
      isFan: false,
    },
  ]);
  const AddFan = (memNo) => {
    async function AddFanFunc() {
      const { result, data } = await postAddFan({
        memNo: memNo,
      });
      if (result === "success") {
        GetList();
      }
    }
    AddFanFunc();
  };
  const DeleteFan = (memNo) => {
    async function DeleteFanFunc() {
      const { result, data } = await deleteFan({
        memNo: memNo,
      });
      if (result === "success") {
        GetList();
      }
    }
    DeleteFanFunc();
  };
  async function GetList() {
    const { result, data } = await getFanList({
      memNo: modalState.mypageYourMem,
      sortType: 0,
    });
    if (result === "success") {
      setList(data.list);
    }
  }
  //----------------------------------------------------
  useEffect(() => {
    async function GetList() {
      const { result, data } = await getFanList({
        memNo: modalState.mypageYourMem,
        sortType: 0,
      });
      if (result === "success") {
        setList(data.list);
      }
    }
    GetList();
  }, []);
  //-------------------------------------------------------
  return (
    <div className="fanlist-modal" onClick={(e) => e.stopPropagation()}>
      <button className="closeBtn" onClick={() => history.goBack()}></button>
      {list && (
        <DalbitScroll width={360} height={470} displayClassName="fanListWrapper">
          <div className="myModalWrap">
            <h4 className="myModalWrap__title">팬</h4>
            <div className="myModalWrap__listWrap">
              {list.map((item, index) => {
                return (
                  <div key={index} className="myModalWrap__list">
                    <img
                      className="myModalWrap__profImg"
                      src={item.profImg.thumb62x62}
                      onClick={() => history.push(`/profile/${item.memNo}`)}
                    />
                    <span className="myModalWrap__name">{item.nickNm}</span>
                    <div className="myModalWrap__fanBtn">
                      {item.isFan ? (
                        <span className="myModalWrap__fanBtn--fan" onClick={() => DeleteFan(item.memNo)}>
                          팬
                        </span>
                      ) : (
                        <span className="myModalWrap__fanBtn--fan myModalWrap__fanBtn--plus" onClick={() => AddFan(item.memNo)}>
                          +팬등록
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DalbitScroll>
      )}
    </div>
  );
};
