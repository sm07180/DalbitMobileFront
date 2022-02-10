import React, {useEffect, useState, useContext, useMemo} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {Context} from 'context'
import {IMG_SERVER} from 'context/config'

import Api from 'context/api'
// global components
import Header from 'components/ui/header/Header'
import ListRow from 'components/ui/listRow/ListRow'
// components
// contents
// css
import './profileDetail.scss'
import {useDispatch, useSelector} from "react-redux";
import DataCnt from "components/ui/dataCnt/DataCnt";

const ProfileDetail = () => {
  const history = useHistory()
  const dispatch = useDispatch();
  const profileData = useSelector(state => state.profile);
  //context
  const context = useContext(Context)
  const {token, profile} = context
  const {memNo, type, index} = useParams();
  const [item, setItem] = useState(null);


  useEffect(() => {
    console.log(memNo, type, index);

    Api.mypage_notice_detail_sel({feedNo: index, memNo})
      .then((res) => {
        const {result, data, message} = res;

        if(result ==='success'){
          setItem(data);
        } else {
          console.log("error")
        }
      });


  }, []);

  //몇초 전, 몇분 전, 몇시간 전 표기용
  // const timeDiffCalc = useMemo(() => {
  //   if (data?.writeDate) {
  //     return Utility.writeTimeDffCalc(data?.writeDate);
  //   } else {
  //     return '';
  //   }
  // }, [data]);

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
//         title: `자동 등록 ${i}`,
//         contents: '내용',
//         topFix: 0,
//         photoInfoList: [{img_name: '/room_0/21374121600/20220207163549744349.png'}, {img_name: '/room_0/21374121600/20220207163549744349.png'}, {img_name: '/room_0/21374121600/20220207163549744349.png'}, {img_name: '/room_0/21374121600/20220207163549744349.png'}]
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


  // 페이지 시작
  return (
    <div id="profileDetail">
      <Header type={'back'}>
        <div className="buttonGroup">
          <button className='more'>더보기</button>
        </div>
      </Header>
      <section className='detailWrap'>
        <div className="detail">
          <ListRow photo={item?.profImg?.thumb50x50 ?? ""}>
            <div className="listContent">
              <div className="nick">{item?.nickName}</div>
              <div className="time">3시간전</div>
            </div>
          </ListRow>
          <div className="text">
            {item?.contents ?? ''}
          </div>
          <div className="info">
            <DataCnt type={"replyCnt"} value={item?.replyCnt ?? 0} />
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProfileDetail
