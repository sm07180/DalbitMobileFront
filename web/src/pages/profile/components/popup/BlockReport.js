import React, {useState} from 'react';

// global components
import InputItems from '../../../../components/ui/inputItems/InputItems';
// components
import Tabmenu from '../Tabmenu';

import './style.scss';
import {MypageBlackListAdd, postReportUser} from "common/api";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const blockReportTabmenu = ['차단하기', '신고하기']
const blockTypes = [
  {key: '프로필 사진', value: '1'},
  {key: '음란성', value: '2'},
  {key: '광고 및 상업성', value: '3'},
  {key: '욕설 및 비방성', value: '4'},
  {key: '기타', value: '5'},
];
const REPORT_MIN_LENGTH = 10; // 신고하기 최소 글자
const REPORT_MAX_LENGTH = 100; // 신고하기 최대 글자

const BlockReport = (props) => {
  const {profileData, closePopupAction} = props;
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory();
  const [openSelect, setOpenSelect] = useState(false)
  const [tabType, setTabType] = useState(blockReportTabmenu[1])
  const [selectedInfo, setSelectedInfo] = useState({key: '신고 유형을 선택해주세요.', value: ''})
  const [reportReason, setReportReason] = useState('');
  const [reportDisabled, setReportDisabled] = useState(true);

  // 셀렉트 오픈
  const openPopSelect = () => {
    setOpenSelect(!openSelect)
  }

  /* 차단 */
  const blockAction = () => {
    MypageBlackListAdd({memNo: profileData.memNo}).then(res => {
      const { message, result } = res;
      if (res.code === "0") {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: message,
          callback: () => {
            history.goBack();
            closePopupAction();
          },
        }));
      } else if (res.code === "-3") {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: message,
          callback: () => history.goBack(),
        }));
      } else if (code === "C006") {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: "이미 차단회원으로 등록된\n회원입니다.",
          callback: () => history.goBack(),
        }));
      }
    })
  }

  /* 신고 api */
  const reportApi = () => {
    const reportApiParams = {
      memNo: profileData.memNo,
      reason: selectedInfo.value,
      cont: reportReason,
    }
    postReportUser(reportApiParams).then(res => {
      if (res.result === "success") {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: `${profileData.nickNm}님을 신고하였습니다.`,
          callback: () => {
            closePopupAction();
          },
        }));
      } else {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: `이미 신고한 회원 입니다.`,
        }));
      }
    });
  }

  /* 선택된 신고 타입 */
  const selectReportType = (item) => {
    setSelectedInfo({key: item.key, value: item.value})
  }

  /* 신고 valid 체크 */
  const reportValidationCheck = () => {
    if (selectedInfo.value === '') {
      return dispatch(setGlobalCtxMessage({
        type: "alert",
        callback: () => {
        },
        msg: '신고 사유를 선택해주세요.'
      }))
    }

    if (selectedInfo.value !== '' && reportReason.length < REPORT_MIN_LENGTH) {
      return dispatch(setGlobalCtxMessage({
        type: "alert",
        callback: () => {
        },
        msg: `신고 사유를 ${REPORT_MIN_LENGTH}자 이상 입력해주세요.`
      }))
    }

    if(selectedInfo.value !== '' && reportReason.length < REPORT_MAX_LENGTH) {
      reportApi();
    }
  }

  const reportReasonHandler = (e) => {
    const {target: {value}} = e;
    if(value.length > REPORT_MAX_LENGTH) return;
    if(value.length < REPORT_MIN_LENGTH) {
      setReportDisabled(true)
    }else {
      setReportDisabled(false)
    }
    setReportReason(value);
  }

  return (
    <section className="blockReport">
      <Tabmenu data={blockReportTabmenu} tab={tabType} setTab={setTabType} />
      <div className="cntSection">
      {tabType === blockReportTabmenu[0] &&
        <>
          <div className="message">
            <strong>{profileData?.nickNm}</strong>님을<br/>
            차단하시겠습니까?
          </div>
          <div className='text'>
            <i className='icoWarning' />
            차단한 회원은 나의 방송이 보이지 않으며,<br/>
            방송에 입장할 수 없습니다.
          </div>
          <div className="subText">
            ※ 차단한 회원은 마이페이지 &gt; 방송설정<br/>
            &gt; 차단회원관리페이지에서 확인할 수 있습니다.
          </div>
          <div className="buttonGroup">
            <button className='cancel' onClick={closePopupAction}>취소</button>
            <button className='active' onClick={blockAction}>차단</button>
          </div>
        </>
      }
      {tabType === blockReportTabmenu[1] &&
        <>
          <div className="message">
            <strong>{profileData?.nickNm}</strong>님을<br/>
            신고하시겠습니까?
          </div>
          <InputItems title="신고 유형">
            <button onClick={openPopSelect}>{selectedInfo.key}</button>
            {openSelect &&
            <div className="selectWrap">
              {blockTypes.map((item, index) => {
                return (
                  <div key={index} className="option" onClick={() => selectReportType(item)}>{item.key}</div>
                )
              })}
            </div>
            }
          </InputItems>
          <InputItems title={`신고 내용`} type="textarea">
            <textarea maxLength={REPORT_MAX_LENGTH}
                      rows="4"
                      placeholder="상세한 신고 내용을 기재해주세요. 허위 신고는 제재 대상이 될 수 있습니다. (최하 10글자 이상)"
                      onChange={reportReasonHandler}
            />
            <div className='count'>{reportReason.length}/{REPORT_MAX_LENGTH}</div>
          </InputItems>
          <div className="buttonGroup">
            <button className='cancel' onClick={closePopupAction}>취소</button>
            <button className={reportDisabled ? 'disabled' : 'active'} onClick={reportValidationCheck}>신고</button>
          </div>
        </>
      }
      </div>
    </section>
  )
}

export default BlockReport
