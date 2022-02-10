import React, {useEffect, useState, useContext, useRef} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {Context} from 'context'
import {IMG_SERVER} from 'context/config'

import Api from 'context/api'
import Header from 'components/ui/header/Header'
import './profileDetail.scss'
import ListRowComponent from "pages/profile/components/ListRowComponent";
import ProfileReplyComponent from "pages/profile/components/ProfileReplyComponent";
import Utility from "components/lib/utility";

const ProfileDetail = () => {
  const history = useHistory()
  //context
  const context = useContext(Context)
  const {token, profile} = context
  const {memNo, type, index} = useParams();
  const replyRef = useRef(null);
  const replyButtonRef = useRef(null);  //button Ref
  const blurBlockStatus = useRef(false); // click 이벤트 막기용

  // 댓글 수정시 사용 action :['add' 등록, 'edit': 수정, replyIdx: 수정할 글번호]
  const [inputMode, setInputMode] = useState({action:'add', replyIdx: null });
  const setInputModeAction = (action = 'add', replyIdx) => {
    if(action ==='add'){
      setInputMode({action:'add', replyIdx: null });
    } else if(action ==='edit') {
      setInputMode({action:'edit', replyIdx });
    }
  };

  const [item, setItem] = useState(null);
  const [replyList, setReplyList] = useState([]);
  const [isMore, setIsMore] = useState(false);
  const [text, setText] = useState('');
  const isMyProfile = (token?.isLogin) && profile?.memNo === memNo;

  //상세조회
  const getDetailData = () => {
    if(type==='feed'){
      Api.mypage_notice_detail_sel({feedNo: index, memNo})
        .then((res) => {
          const {data, result, message} = res;
          if(result === 'success'){
            setItem(data);
          } else {
            history.goBack();
          }
      });
    } else if (type === 'fanBoard') {
      Api.mypage_fanboard_detail({
        memNo, fanBoardNo: index
      }).then((res) => {
        const {data, result, message} = res;
        if (result === 'success') {
          setItem(data);
        } else {
          history.goBack();
        }
      })
    }

  }

  //댓글 조회
  const getReplyList = (_page, records= 10) => {
    if (type === 'feed') {
      Api.getMypageNoticeReply({
        memNo: profile?.memNo,
        noticeIdx: index,
        page: _page,
        records
      }).then(res => {
        const {data, result, message} = res;
        if (result === 'success') {
          setReplyList(data?.list);
        }

      });
    } else if (type === 'fanBoard') {
      Api.member_fanboard_reply({
        params: {
          memNo: memNo,
          replyIdx: index
        }
      }).then((res) => {
        const {data, result, message} = res;

        if (result === 'success') {
          setReplyList(data?.list);
        }
      });

    }
  }

  //전체 조회  (피드, 팬보드)
  const getAllData = (_page, records) => {
    getDetailData();
    getReplyList(_page, records);
  }

  //어떠한 요소를 클릭했을때 blur(inputFormFocusEvent)를 막으려면 이 함수를 호출
  const blurBlock = () => {
    blurBlockStatus.current = true;
  };

  //댓글입력 폼, 댓글등록 버튼 이외에 요소를 누르면 blur로 판단하여 입력폼 초기화 및 댓글 입력폼을 등록상태로 변경
  const inputFormFocusEvent = (e) => {
    if(!blurBlockStatus.current) {
      if (replyRef.current !== e.target && replyButtonRef.current !== e.target) {
        //blur로 판단
        if (inputMode.action === 'edit') {
          setInputModeAction('add');
        }
        if (replyRef.current) {
          replyRef.current.innerText = '';
        }
        setText('');
      }
    }
    blurBlockStatus.current = false;
  };

  useEffect(() => {
    getAllData(1, 9999);
  }, []);

  useEffect(() => {
    document.body.addEventListener('click', inputFormFocusEvent);
    return () => {
      document.body.removeEventListener('click', inputFormFocusEvent);
    }
  },[inputMode, text]);


  useEffect(()=> {
    // Api.mypage_notice_edit({
    //   reqBody : true,
    //   data: {
    //     title: 'hello',
    //     contents: 'hhh',
    //     noticeIdx: 84368,
    //     topFix: 0,
    //     chrgrName: "name",
    //     photoInfoList: [{img_name: '/room_0/21374121600/20220207163549744349.png'}]
    //   }
    // }).then((res)=>{console.log("hello", res)});


// let i=0;
//     Api.mypage_notice_upload({
//       reqBody: true,
//       data: {
//         title: `이미지 업로드 테스트`,
//         contents: '내용',
//         topFix: 0,
//         photoInfoList: [{img_name: '/room_1/21374121600/20220207163549744349.png'}]
//
//       }
//     }).then((res) => {
//     });

//
//     Api.mypage_notice_delete({data:{noticeIdx: 84365, delChrgrName: '나'}}).then(res => {
//       console.log(res);
//     })

    // Api.mypage_notice_detail_sel({data:})
  },[]);

  const goModifyPage = () => {
    history.push(`/profileWrite/${memNo}/${type}/modify/${index}`);
  };

  //댓글 삭제
  const deleteContents = async (type, index) => {
    if(type === 'feed') {
      const {res, data, message} = await Api.deleteMypageNoticeReply({
        memNo: profile?.memNo,
        replyIdx: index
      });
    }
  };

  //댓글 등록
  const replyWrite = async () => {
    if (type === 'feed') {
      const {data, result, message} = await Api.insertMypageNoticeReply({
        memNo: profile?.memNo,
        noticeIdx: index,
        contents: text
      });

      context.action.toast({msg: message});
      if (result === 'success') {
        setText('');
        if (replyRef.current) {
          replyRef.current.innerText = '';
        }
        getAllData(1, 9999);
      } else {
      }
    } else if (type === 'fanBoard') {
      console.dir(replyRef.current);

      const {data, result, message} = await Api.member_fanboard_add({data: {
        memNo,
        depth: 2, // (1: 팬보드, 2: 댓글)
        parentGroupIdx : index,
        viewOn: 1,
        contents: text
      }});

      context.action.toast({msg: message});
      if (result === 'success') {
        setText('');
        if (replyRef.current) {
          replyRef.current.innerText = '';
        }
        getAllData(1, 9999);
      } else {
      }
    }
  };

  const replyEditFormActive = (replyIdx, originText) => {
    replyRef.current.focus();
    replyRef.current.innerText = originText;
    setText(originText);

    //수정 폼 활성화
    setInputModeAction('edit', replyIdx);
  };

  //댓글 수정
  //replyIdx : 댓글 번호, contents: 수정할 내용
  const replyEdit = async (replyIdx, contents) => {
    if(type==='feed'){
      const {data, result, message} = await Api.modifyMypageNoticeReply({
          memNo,
          replyIdx,
          contents
        }
      );

      if (result === 'success') {
        getAllData(1, 9999);
        setText('');
        replyRef.current.innerText = '';
        setInputModeAction('add');
      } else {
      }

    } else if (type === 'fanBoard') {
      const {data, result, message} = await Api.mypage_board_edit({data: {
        memNo,
        replyIdx,
        contents
      }});

      if(result ==='success'){
        getAllData(1, 9999);
        setText('');
        replyRef.current.innerText = '';
        setInputModeAction('add');
      }else{

      }
      
    }
  };

  //댓글 삭제
  const replyDelete = async (replyIdx) => {
    if (type === 'feed') {
      const {data, result, message} = await Api.deleteMypageNoticeReply({memNo, replyIdx});

      if (result === 'success') {
        getAllData(1, 9999);
      } else {
        //실패
      }

    } else if (type === 'fanBoard') {
      const {data, result, message} = await Api.mypage_fanboard_delete({data: {memNo, replyIdx}});
      if (result === 'success') {
        getAllData(1, 9999);
      } else {
        //실패
      }

    }
  };

  // 페이지 시작
  return (
    <div id="profileDetail">
      <Header type="back" title={item?.nickName}>
        <div className="buttonGroup">
          <div className='moreBtn'>
            <img src={`${IMG_SERVER}/common/header/icoMore-b.png`} alt="" />
            <div className="isMore">
              {(isMyProfile && context?.profile?.memNo === item?.mem_no || context?.adminChecker) &&
                <button onClick={goModifyPage}>수정하기</button>}
              {(isMyProfile && context?.profile?.memNo === item?.mem_no || context?.adminChecker) &&
                <button onClick={deleteContents}>삭제하기</button>}
                <button>차단/신고하기</button>
            </div>
          </div>
        </div>
      </Header>
      <section className='detailWrap'>
        <div className="detail">
          {item && <ListRowComponent item={item} isMyProfile={isMyProfile} index={index} type={type} disableMoreButton={false}/>}
          <div className="text">
            <pre>{item?.contents}</pre>
          </div>
          <div className="info">
            {/*<i className='like'></i>
            <span>{Utility.addComma(123)}</span>*/}
            <i className='comment'/>
            <span>{Utility.addComma(replyList.length)}</span>
          </div>
        </div>
        
        {/*댓글 리스트*/}
        <div className='listWrap'>
          {
            replyList.map((item, index) =>
              <ProfileReplyComponent key={item?.replyIdx} item={item} type={type} isMyProfile={isMyProfile} dateKey={'writeDt'}
                                     replyDelete={replyDelete} replyEditFormActive={replyEditFormActive}
                                     blurBlock={blurBlock}/>)
          }
        </div>
        <div className='bottomWrite'>
          <div ref={replyRef} className={`trickTextarea ${text.length && 'isText'}`} contentEditable="true"
               onKeyUp={(e) => setText(e.target?.innerText)}
          />

          {/*댓글에서 수정 버튼을 눌렀을 때,  inputMode : false => true*/}
          <button ref={replyButtonRef} onClick={(e) => {
            inputMode.action === 'edit' ? replyEdit(inputMode.replyIdx, text) : replyWrite();
          }}>
            {inputMode.action === 'add' ? '등록' : '수정'}
          </button>
        </div>
      </section>
    </div>
  )
}

export default ProfileDetail
