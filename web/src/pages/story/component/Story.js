import React, {useState, useRef } from 'react'
import {useHistory} from 'react-router-dom'
import Utility, {addComma} from 'components/lib/utility'
import {useDispatch, useSelector} from "react-redux";
import {setData}  from "redux/actions/story";
import {PHOTO_SERVER} from 'context/config.js'
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

import Api from 'context/api'
import moment from "moment";

export default (props) => {
  const {data, goLink} = props;
  const dispatch = useDispatch();
  const story = useSelector(({story}) => story);
  const nowDay = moment();

  function delList(roomNo, storyIdx) {
    Api.getStoryBoxDel({roomNo, storyIdx}).then((res) => {
      const {result, message} = res
      if (result === 'success') {
        dispatch(setGlobalCtxMessage({type:"alert",
          msg: "사연을 삭제했습니다.",
          callback: () => {
            // getList();
            dispatch(setData({list: story.list.concat([]).filter((v)=> v.idx !== storyIdx) }));
          }
        }))
      } else {
        
        dispatch(setGlobalCtxMessage({type:"alert",
          title: 'Error',
          msg: message
        }))
      }
    })
  }

  const delAction = (roomNo, storyIdx) => {
    const TypeChangeRoomNo = String(roomNo);
    const TypeChangeStoryIdx = parseInt(storyIdx);
    delList(TypeChangeRoomNo, TypeChangeStoryIdx);
  }

  return (
    <div className='content'>
      {
        data.length > 0 ?
          <>
            <p className='reference'>※ 최근 3개월 내역만 볼 수 있습니다.</p>
            <div className='storyWrap'>
              {
                data.map((story, index) => {
                  const {writer_mem_profile, writer_mem_nick, write_date, room_no, writer_no, contents, plus_yn, idx} = story;
                  const ago3Months =  moment(nowDay).subtract(3, 'months');
                  const writeDate =  moment(write_date);
                  if(moment(writeDate).isAfter(ago3Months)) {
                    return (
                      <div className='storyList' key={index}>
                        <div className='thumbnail' onClick={() => {goLink(`${writer_no}`)}}>
                          <img src={`${PHOTO_SERVER}${writer_mem_profile}`} alt=""/>
                        </div>
                        <div className={`listContent ${story.plus_yn === "y" ? "plus" : ""}`}>
                          <div className='dataInfo'>
                            <div className='infoWrap'>
                              <div className='userNick' onClick={() => {goLink(`${writer_no}`)}}>{writer_mem_nick}</div>
                              <div className='infoRow'>
                                {plus_yn === "y" && <span className='plusBadge'>Plus</span>}
                                <div className='writeTime'>{moment(write_date).format('YYYY.MM.DD HH:mm')}</div>
                              </div>
                            </div>
                            <div className='delBtnWrap'>
                              <span className='delBtn' onClick={() => {delAction(room_no, idx)}}>삭제</span>
                            </div>
                          </div>
                          <div className='messageWrap'>
                            {contents}
                          </div>
                        </div>
                      </div>
                    )
                  }
                })
              }
            </div>
          </>
        :
          <div className='listNone'>
            <img src='https://image.dalbitlive.com/common/listNone/listNone-new.png' className='listNoneImg' alt="받은 사연이 없어요."/>
            <p className='mainText'>받은 사연이 없어요.</p>
            <p className='subText'>최근 3개월 내역만 볼 수 있어요.</p>
          </div>
      }
    </div>
  )
}
