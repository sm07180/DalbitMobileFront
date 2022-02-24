import React, {useState, useEffect, useContext} from 'react';
import Header from "components/ui/header/Header";
import TextArea from "pages/resetting/components/textArea";
import RadioList from "pages/resetting/components/radioList";
import Toast from "components/ui/toast/Toast";
import "../title/title.scss"

const BroadcastNotice = () => {
  const [noticeList, setNoticeList] = useState([]);
  const [noticeSelect, setNoticeSelect] = useState({state: false, val: "", index: -1});
  const [toast, setToast] = useState({state: false, msg: ""});

  const toastMessage = (text) => {
    setToast({state: true, msg: text});
    setTimeout(() => {
      setToast({... toast, state: false});
    }, 3000);
  }

  const selectNotice = (e) => {
    let selectVal = e.currentTarget.innerText;
    const {targetIndex} = e.currentTarget.dataset;
    setNoticeSelect({
      state: true,
      val: selectVal,
      index: targetIndex
    });
  }

  return (
    <div id="title">
      <Header position="sticky" title="방송 공지" type="back"/>
      <section className="titleInpuBox">
        <TextArea max={1000} list={noticeList} setList={setNoticeList} select={noticeSelect} setSelect={setNoticeSelect}/>
      </section>
      <section className="titleListBox">
        <div className="sectionTitle">등록된 공지<span className="point">1</span></div>
        <div className="radioWrap">
          <RadioList title="방송공지" titleSelect={noticeSelect} setTitleSelect={setNoticeSelect}/>
        </div>
      </section>
      {toast.state && <Toast msg={toast.msg}/>}
    </div>
  );
};

export default BroadcastNotice;