import React, {useState, useEffect, useContext} from 'react';
import Header from "components/ui/header/Header";
import TextArea from "pages/resetting/components/textArea";
import './broadcastNotice.scss'
import API from "context/api";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const BroadcastNotice = () => {
  const [noticeList, setNoticeList] = useState([]);
  const [noticeSelect, setNoticeSelect] = useState({state: false, val: "", index: -1});
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  /* 방송공지 조회 */
  const fetchData = async () => {
    let apiParams = {
      memNo: globalState.profile.memNo,
      roomNo: globalState.profile.roomNo ? globalState.profile.roomNo : 0
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
        memNo: globalState.profile.memNo,
        roomNo: globalState.profile.roomNo === "" ? 0 : globalState.profile.roomNo,
        roomNoticeConts: noticeSelect.val
      }
    });
    if(noticeSelect.val === "") {
      dispatch(setGlobalCtxMessage({type:'toast',msg: "입력 된 방송 공지가 없습니다. \n방송 공지를 입력하세요."}));
    } else {
      if(res.result === "success") {
        dispatch(setGlobalCtxMessage({type:'toast',msg: "방송 공지가 등록 되었습니다."}));
        setNoticeSelect({...noticeSelect, val: ""});
        fetchData();
      } else {
        dispatch(setGlobalCtxMessage({type:'toast',msg: "이미 입력된 방송 공지가 있습니다."}));
      }
    }
  }

  /* 방송공지 수정 */
  const fetchModifyData = async () => {
    const res = await API.myPageBroadcastNoticeUpd({
      reqBody: true,
      data: {
        roomNoticeNo: noticeSelect.index,
        memNo: globalState.profile.memNo,
        roomNo: globalState.profile.roomNo === "" ? 0 : globalState.profile.roomNo,
        roomNoticeConts: noticeSelect.val
      }
    })
    if(res.result === "success") {
      dispatch(setGlobalCtxMessage({type:'toast',msg: "방송 공지가 수정 되었습니다."}));
      setNoticeSelect({state: false, val: "", index: -1});
      fetchData();
    }
  }

  /* 방송공지 삭제 */
  const fetchDeleteData = async () => {
    const res = await API.myPageBroadcastNoticeDel({
      roomNoticeNo: noticeSelect.index,
      memNo: globalState.profile.memNo,
      roomNo: globalState.profile.roomNo === "" ? 0 : globalState.profile.roomNo,
      delChrgrName: ""
    })
    if(res.result === "success") {
      dispatch(setGlobalCtxMessage({type:'toast',msg: "방송 공지가 삭제 되었습니다."}));
      setNoticeSelect({state: false, val: "", index: -1});
      fetchData();
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div id="broadNotice">
      <Header position={"sticky"} title={"방송방 공지"} type={"back"}/>
      <section className="noticeInputBox">
        <p className="topText">최대 1개까지 저장 가능</p>
        <TextArea max={1000} type={"방송 공지"} list={noticeList} setList={setNoticeList} select={noticeSelect} setSelect={setNoticeSelect}
                  fetchAddData={fetchAddData} fetchDeleteData={fetchDeleteData} fetchModifyData={fetchModifyData} />
      </section>
    </div>
  );
};

export default BroadcastNotice;
