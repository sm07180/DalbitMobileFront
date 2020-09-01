import React, {useContext, useEffect, useReducer, useState} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import {Context} from 'context'
import {Hybrid} from 'context/hybrid'
function ClipUpload() {
  let history = useHistory()
  const context = useContext(Context)
  const [currentPage, setCurrentPage] = useState(0)
  const [uploadList, setUploadList] = useState([])
  // 토탈페이지
  const [totalPage, setTotalPage] = useState(0)
  const [uploadListLoding, setUpLoadLoading] = useState('')

  const uploadModal = () => {
    Hybrid('ClipUploadJoin')
  }
  const fetchDataList = async () => {
    const {result, data} = await Api.getUploadList({
      memNo: context.profile.memNo,
      records: 100
    })
    if (result === 'success') {
      setUpLoadLoading(true)
      setUploadList(data.list)
      if (data.paging) {
        setTotalPage(data.paging.totalPage)
      }
    } else {
      setUpLoadLoading(false)
    }
  }

  useEffect(() => {
    fetchDataList()
  }, [currentPage])

  const createContents = () => {
    if (uploadList.length === 0) {
      return (
        <div className="noResult">
          <span className="noResult__guideTxt">
            등록된 클립이 없습니다.
            <br /> 클립을 업로드해 보세요.
          </span>
          <button className="noResult__uploadBtn" onClick={() => uploadModal()}>
            클립 업로드
          </button>
        </div>
      )
    } else {
      return (
        <div className="uploadList">
          {uploadList.map((item, idx) => {
            const {bgImg, byeolCnt, clipNo, goodCnt, memNo, nickName, playCnt, subjectType, title} = item

            return (
              <React.Fragment key={`uploadList-${idx}`}>
                <div className="uploadList__container" onClick={() => history.push(`/clip/${clipNo}`)}>
                  <img src={bgImg['thumb120x120']} className="uploadList__profImg" />
                  <div className="uploadList__details">
                    {context.clipType.map((v, index) => {
                      if (v.value === subjectType) {
                        return (
                          <span key={index} className="uploadList__category">
                            {v.cdNm}
                          </span>
                        )
                      }
                    })}
                    {/* {globalState.clipType
                      .filter((v) => {
                        if (v.value === subjectType) return v;
                      })
                      .map((v1, index) => {
                        return <span key={index}>{v1.cdNm}</span>;
                      })} */}
                    <strong className="uploadList__title">{title}</strong>
                    <em className="uploadList__nickName">{nickName}</em>
                    <div className="uploadList__cnt">
                      <em className="uploadList__cnt play">{playCnt}</em>
                      <em className="uploadList__cnt like">{goodCnt}</em>
                      <em className="uploadList__cnt star">{byeolCnt}</em>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )
          })}
          {/* {uploadList.length !== 0 && <button className="uploadBtn">업로드</button>} */}
        </div>
      )
    }
  }
  return <div className="uploadWrap">{uploadListLoding && createContents()}</div>
}

export default ClipUpload
