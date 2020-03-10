import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'
import Navi from './navibar'
import {LButton} from 'pages/broadcast/content/tab/bot-button'
import {Context} from 'context'
import {Scrollbars} from 'react-custom-scrollbars'
import {Img} from './profileImg'
import Util from '../../util/broadcast-util'
import {BroadCastStore} from '../../store'
import Api from 'context/api'

export default props => {
  //----------------------------------------------- declare start
  const [text, setText] = useState('')
  const [count, setCount] = useState(0)
  const [type, setType] = useState(true)
  const context = useContext(Context)
  const store = useContext(BroadCastStore)
  const scrollbars = useRef(null)
  const [now, setNow] = useState()
  //----------------------------------------------- func start

  const handleChangeInput = event => {
    const {value, maxLength} = event.target

    setCount(value.length)
    setText(value)
  }

  //사연 새로고침
  const refresh = () => {
    let d = new Date()
    let now
    now = d.getHours() + ':'
    now += d.getMinutes() + ':'
    now += d.getSeconds().toString().length > 1 ? d.getSeconds() : '0' + d.getSeconds()
    setNow(now)
    selectStoryList()
  }

  //사연조회
  const selectStoryList = async () => {
    const res = await Api.broad_story({
      params: {
        roomNo: store.roomInfo.roomNo,
        page: 1,
        records: 10
      },
      method: 'GET'
    })
    console.log('## story - res :', res)
    if (res.result === 'success') {
      store.action.updateStoryList(res.data)
    }
  }

  //사연작성
  const writeStory = async () => {
    const res = await Api.broad_story({
      data: {
        roomNo: store.roomInfo.roomNo,
        contents: text
      },
      method: 'POST'
    })
    console.log('## writeStory - res :', res)
    if (res.result === 'success') {
      context.action.alert({
        callback: () => {
          console.log('callback처리')
        },
        title: '달빛라디오',
        msg: '사연이 등록되었습니다.'
      })
      selectStoryList()
    }
  }

  //사연 삭제 후 조회
  const deleteStory = async param => {
    const res = await Api.broad_story({
      data: {
        roomNo: store.roomInfo.roomNo,
        storyIdx: param
      },
      method: 'DELETE'
    })
    console.log('## deleteStory - res :', res)
    if (res.result === 'success') selectStoryList()
  }

  useEffect(() => {
    //Dj - 사연조회, Listener - 사연작성
    if (type) {
      selectStoryList()
      refresh()
    }
  }, [])
  console.log('## context.token.memNo :', context.token.memNo)
  //----------------------------------------------- components start
  return (
    <Container>
      <Navi title={context.token.memNo === store.roomInfo.bjMemNo ? '등록 사연' : '사연'} prev={props.prev} _changeItem={props._changeItem} />
      {context.token.memNo === store.roomInfo.bjMemNo ? (
        <DjMain>
          <div className="topBar">
            <div className="refresh">
              <button onClick={() => refresh()} />
              <span>{now}</span>
            </div>
            <Count>사연수 : {store.storyList.list ? store.storyList.paging.total : 0}개</Count>
          </div>
          <Scrollbars ref={scrollbars} style={{height: '100%'}} autoHide>
            {store.storyList.list &&
              store.storyList.list.map((data, idx) => {
                return (
                  <Contents key={idx}>
                    <UserInfo>
                      <div>
                        <Img width={40} height={40} src={'https://devimage.dalbitcast.com/images/api/profile_test5.jpg'} marginRight={8} />
                        <div>{data.nickNm}</div>
                      </div>
                      <div>
                        <span>{Util.format(data.writeDt)}</span> {/* date format 함수 */}
                        <SaveButton onClick={() => deleteStory(data.storyIdx)}>삭제</SaveButton>
                      </div>
                    </UserInfo>
                    <Story value={data.contents} disabled />
                    <hr />
                  </Contents>
                )
              })}
          </Scrollbars>
        </DjMain>
      ) : (
        <>
          <ListenerMain>
            <div className="notice">
              <p>* 사연을 등록하면 DJ에게 사연이 전달 됩니다.</p>
              <p>채팅창에 쓰기 어려운 내용을 등록해보세요.</p>
            </div>
            <div className="noticeInput">
              <textarea onChange={handleChangeInput} maxLength={100}>
                {/* {NoticeData.notice} */}
              </textarea>
              <Counter>{count} / 100</Counter>
            </div>
          </ListenerMain>
          <LButton title={'등록하기'} background={'#8556f6'} clickEvent={() => writeStory()} />
        </>
      )}
    </Container>
  )
}

//----------------------------------------------- styled start

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 90%;
`
const ListenerMain = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 312px;
  align-items: center;

  & .notice {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 70%;
    height: 68px;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.14;
    letter-spacing: -0.35px;
    text-align: left;
    color: #616161;
  }

  & .noticeInput {
    position: relative;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    background-color: #f5f5f5;
    border-radius: 10px;
    & textarea {
      display: block;
      border: none;
      appearance: none;
      width: 100%;
      min-height: 140px;
      background-color: #f5f5f5;
      color: #424242;
      font-size: 16px;
      transform: skew(-0.03deg);
      resize: none;
      outline: none;
    }
  }
`

const Counter = styled.span`
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: block;
  color: #bdbdbd;
  font-size: 12px;
  line-height: 1.5;
  letter-spacing: -0.3px;
  transform: skew(-0.03deg);
`
const DjMain = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;

  .topBar {
    display: flex;
    width: 100%;
    height: 40px;
    border-radius: 20px;
    background: #f5f5f5;
    margin-top: 8px;
    align-items: center;
    padding-left: 12px;
    padding-right: 12px;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  & > .topBar > .refresh {
    display: flex;
    align-items: center;
    width: 83px;
    height: 16px;

    & > button {
      display: flex;
      width: 18px;
      height: 18px;
      margin-right: 6px;
      background: url('https://devimage.dalbitcast.com/images/api/ic_refresh.png') no-repeat;
    }

    & > span {
      display: flex;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: -0.35px;
      color: #bdbdbd;
    }
  }
`
const Count = styled.div`
  display: flex;
  height: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ec455f;
`
const Contents = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;

  & > hr {
    width: 100%;
    border-width: 0.5px;
    border-style: solid;
    border-color: #eeeeee;
    margin-top: 12px;
    margin-bottom: 12px;
  }
`
const UserInfo = styled.div`
  display: flex;
  width: 100%;
  height: 40px;
  justify-content: space-between;

  & > div {
    display: flex;
    height: 100%;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: normal;
    color: #424242;
  }

  & > div > span {
    font-size: 14px;
    font-weight: 400;
    color: #9e9e9e;
  }
`
const SaveButton = styled.button`
  display: flex;
  width: 49px;
  height: 26px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.03;
  letter-spacing: -0.35px;
  color: #8555f6;
  background-color: #fff;
  border-color: #8555f6;
  border-style: solid;
  border-width: 1px;
  border-radius: 13px;
  justify-content: center;
  align-items: center;
  margin-left: 16.8px;
`
const Story = styled.textarea`
  display: flex;
  width: 100%;
  height: 15vh;
  background: #f5f5f5;
  padding: 10px 20px 10px 20px;
  margin-top: 12px;
  border-radius: 10px;
  resize: none;

  font-size: 14px;
  font-weight: 400;
  letter-spacing: -0.35px;
`
