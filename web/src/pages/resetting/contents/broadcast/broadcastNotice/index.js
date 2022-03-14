import React, {useState, useEffect, useContext} from 'react';
import Header from "components/ui/header/Header";
import TextArea from "pages/resetting/components/textArea";
import RadioList from "pages/resetting/components/radioList";
import Toast from "components/ui/toast/Toast";
import "../title/title.scss"
import {Context} from "context";
import API from "context/api";

const BroadcastNotice = () => {
  const [noticeList, setNoticeList] = useState([]);
  const [noticeSelect, setNoticeSelect] = useState({state: false, val: "", index: -1});
  const [toast, setToast] = useState({state: false, msg: ""});
  const context = useContext(Context);

  /* 하단 토스트 메세지 */
  const toastMessage = (text) => {
    setToast({state: true, msg: text});
    setTimeout(() => {
      setToast({... toast, state: false});
    }, 3000);
  }

  /* 등록된 방송공지 클릭시 값 가져오기 */
  const selectNotice = (e) => {
    let selectVal = e.currentTarget.innerText;
    const {targetIndex} = e.currentTarget.dataset;
    setNoticeSelect({
      state: true,
      val: selectVal,
      index: targetIndex
    });
  }

  /* 방송공지 조회 */
  const fetchData = async () => {
    let apiParams = {
      memNo: context.profile.memNo
    }
    await API.myPageBroadcastNoticeSel(apiParams).then((res) => {
      setNoticeList(res.data.list);
    }).catch((e) => console.log(e));
  }


  /* 방송공지 등록 */
  const fetchAddData = async () => {
    const res = await API.myPageBroadcastNoticeIns({ //공지글은 한명당 한개씩만 가능?
      reqBody: true,
      data: {
        memNo: context.profile.memNo,
        roomNo: context.profile.roomNo === "" ? 0 : context.profile.roomNo,
        roomNoticeConts: noticeSelect.val
      }
    });
    if(noticeSelect.val === "") {
      toastMessage("입력 된 방송 공지가 없습니다. \n방송 공지를 입력하세요.");
    } else {
      if(res.result === "success") {
        toastMessage("방송 공지가 등록 되었습니다.");
        setNoticeSelect({...noticeSelect, val: ""});
        fetchData();
      } else {
        toastMessage("이미 입력된 방송 공지가 있습니다.");
      }
    }
  }

  /* 방송공지 수정 */
  const fetchModifyData = async () => {
    const res = await API.myPageBroadcastNoticeUpd({
      reqBody: true,
      data: {
        roomNoticeNo: noticeSelect.index,
        memNo: context.profile.memNo,
        roomNo: context.profile.roomNo === "" ? 0 : context.profile.roomNo,
        roomNoticeConts: noticeSelect.val
      }
    })
    if(res.result === "success") {
      toastMessage("방송 공지가 수정 되었습니다.")
      setNoticeSelect({state: false, val: "", index: -1});
      fetchData();
    }
  }

  /* 방송공지 삭제 */
  const fetchDeleteData = async () => {
    const res = await API.myPageBroadcastNoticeDel({
      roomNoticeNo: noticeSelect.index,
      memNo: context.profile.memNo,
      roomNo: context.profile.roomNo === "" ? 0 : context.profile.roomNo,
      delChrgrName: ""
    })
    if(res.result === "success") {
      toastMessage("방송 공지가 삭제 되었습니다.");
      setNoticeSelect({state: false, val: "", index: -1});
      fetchData();
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div id="title">
      <Header position="sticky" title="방송방 공지" type="back"/>
      <section className="titleInpuBox">
        <TextArea max={1000} type={"방송 공지"} list={noticeList} setList={setNoticeList} select={noticeSelect} setSelect={setNoticeSelect}
                  fetchAddData={fetchAddData} fetchDeleteData={fetchDeleteData} fetchModifyData={fetchModifyData}/>
      </section>
      {noticeList.length > 0 &&
      <section className="titleListBox">
        <div className="sectionTitle">등록된 공지<span className="point">{noticeList.length}</span></div>
        <div className="radioWrap">
          <RadioList title={noticeList[0]?.conts} listIndex={noticeList[0]?.auto_no} clickEvent={selectNotice} titleSelect={noticeSelect} setTitleSelect={setNoticeSelect}/>
        </div>
      </section>
      }
      {toast.state && <Toast msg={toast.msg}/>}
    </div>
  );
};

export default BroadcastNotice;