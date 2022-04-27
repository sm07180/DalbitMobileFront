import React, {useState, useEffect, useContext} from 'react'

// global components
import Header from 'components/ui/header/Header'
import RadioList from 'pages/resetting/components/radioList'
import './title.scss'
import API from "context/api";
import TextArea from "pages/resetting/components/textArea";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const BroadcastTitle = () => {
  const [titleList, setTitleList] = useState([])
  const [titleSelect, setTitleSelect] = useState({state: false, val: "", index: -1})
  const dispatch = useDispatch();

  //등록된 제목 버튼 클릭시 해당 정보 가져오기
  const selectTitle = (e) => {
    let selectVal = e.currentTarget.innerText;
    const {targetIndex} = e.currentTarget.dataset;
    setTitleSelect({
      state: true,
      val: selectVal,
      index: targetIndex,
    });
  }

  //방송 제목 등록
  const fetchAddData = async () => {
    const res = await API.insertBroadcastOption({
      optionType: 1,
      contents: titleSelect.val
    })
    if(titleSelect.val === "") {
      dispatch(setGlobalCtxMessage({type:'toast',msg: "입력 된 방송제목이 없습니다. \n방송제목을 입력하세요."}));
    } else {
      if (res.result === "success") {
        dispatch(setGlobalCtxMessage({type:'toast',msg: "방송제목이 등록 되었습니다."}))
        setTitleList(res.data.list);
        setTitleSelect({...titleSelect, val: ""});
      }
    }
  }

  //방송 제목 삭제
  const fetchDeleteData = async () => {
    const res = await API.deleteBroadcastOption({
      optionType: 1,
      idx: titleSelect.index
    })
    if(res.result === "success") {
      dispatch(setGlobalCtxMessage({type:'toast',msg: "방송제목이 삭제 되었습니다."}))
      setTitleList(res.data.list);
      setTitleSelect({state: false, val: "", index: -1});
    }
  }

  //방송 제목 정보 조회
  const fetchData = async () => {
    const res = await API.getBroadcastOption({optionType: 1});
    if(res.result === "success") {
      setTitleList(res.data.list); //contents, idx
    }
  }

  //방송 제목 수정
  const fetchModifyData = async () => {
    const res = await API.modifyBroadcastOption({
      optionType: 1,
      idx: titleSelect.index,
      contents: titleSelect.val
    })
    if(res.result === "success") {
      dispatch(setGlobalCtxMessage({type:'toast',msg: "방송제목이 수정 되었습니다."}))
      setTitleList(res.data.list);
      setTitleSelect({state: false, val: "", index: -1});
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // 페이지 시작
  return (
    <div id="title">
      <Header position='sticky' title='방송 제목' type='back'/>
      <section className='titleInputBox'>
        <p className='topText'>최대 3개까지 저장 가능</p>
        <TextArea max={20} list={titleList} setList={setTitleList} select={titleSelect} setSelect={setTitleSelect}
                  fetchAddData={fetchAddData} fetchDeleteData={fetchDeleteData} fetchModifyData={fetchModifyData}/>
      </section>
      {titleList.length > 0 &&
      <section className='titleListBox'>
        <div className='sectionTitle'>등록된 제목<span className='point'>{titleList.length}</span></div>
        <div className='radioWrap'>
          {titleList.map((item, index) => {
            return (
              <RadioList key={index} title={item.contents} listIndex={item.idx} clickEvent={selectTitle} titleSelect={titleSelect} setTitleSelect={setTitleSelect}/>
            )
          })}
        </div>
      </section>
      }
    </div>
  )
}

export default BroadcastTitle;
