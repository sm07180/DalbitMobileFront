import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'
import Navi from './navibar'
import {LButton} from 'pages/broadcast/content/tab/bot-button'
import {Context} from 'context'
import {Scrollbars} from 'react-custom-scrollbars'
import {Img} from './profileImg'
import Util from '../../util/broadcast-util'

const list = [
  {
    storyIdx: 25,
    writerNo: '11577950603958',
    nickNm: 'nicknameTest',
    profImg: {
      url: '',
      path: ''
    },
    contents: 'BJ님! 일반 라디오방송 DJ보다 훨씬 잘하십니다.' + '이번에 저 방탄소년단 콘서트에 가는데요!' + '저 곡하나 신청해도 될까요? ㅎㅎ' + '방탄소년단 최신곡으로 하나 부탁드려요! ',
    writeDt: '20200101151454',
    writeTs: 15483125756
  },
  {
    storyIdx: 25,
    writerNo: '11577950603958',
    nickNm: 'nicknameTest',
    profImg: {
      url: '',
      path: ''
    },
    contents: '사연사연사연',
    writeDt: '20200101151454',
    writeTs: 15483125756
  },
  {
    storyIdx: 25,
    writerNo: '11577950603958',
    nickNm: 'nicknameTest',
    profImg: {
      url: '',
      path: ''
    },
    contents: '사연사연사연',
    writeDt: '20200101151454',
    writeTs: 15483125756
  },
  {
    storyIdx: 25,
    writerNo: '11577950603958',
    nickNm: 'nicknameTest',
    profImg: {
      url: '',
      path: ''
    },
    contents: '사연사연사연',
    writeDt: '20200101151454',
    writeTs: 15483125756
  },
  {
    storyIdx: 25,
    writerNo: '11577950603958',
    nickNm: 'nicknameTest',
    profImg: {
      url: '',
      path: ''
    },
    contents: '사연사연사연',
    writeDt: '20200101151454',
    writeTs: 15483125756
  },
  {
    storyIdx: 25,
    writerNo: '11577950603958',
    nickNm: 'nicknameTest',
    profImg: {
      url: '',
      path: ''
    },
    contents: '사연사연사연',
    writeDt: '20200101151454',
    writeTs: 15483125756
  },
  {
    storyIdx: 25,
    writerNo: '11577950603958',
    nickNm: 'nicknameTest',
    profImg: {
      url: '',
      path: ''
    },
    contents: '사연사연사연',
    writeDt: '20200101151454',
    writeTs: 15483125756
  },
  {
    storyIdx: 25,
    writerNo: '11577950603958',
    nickNm: 'nicknameTest',
    profImg: {
      url: '',
      path: ''
    },
    contents: '사연사연사연',
    writeDt: '20200101151454',
    writeTs: 15483125756
  },
  {
    storyIdx: 25,
    writerNo: '11577950603958',
    nickNm: 'nicknameTest',
    profImg: {
      url: '',
      path: ''
    },
    contents:
      '일반 라디오방송 DJ보다 훨씬 잘하시는 것 같아요! 이번에 저 아이유 콘서트에 가는데요! 저 곡하나 신청해도 될까요? ㅎㅎ 아이유 블루밍 최신곡으로 하나 부탁드려요! 매번 좋은노래 틀어주셔서 감사합니다 :)',
    writeDt: '20200101151454',
    writeTs: 15483125756
  },
  {
    storyIdx: 25,
    writerNo: '11577950603958',
    nickNm: 'nicknameTest',
    profImg: {
      url: '',
      path: ''
    },
    contents: '마지막1',
    writeDt: '20200101151454',
    writeTs: 15483125756
  }
]

const paging = {
  total: 102,
  records: 10,
  page: 1,
  prev: 0,
  next: 2,
  totalpage: 21
}

const test = {list: list, paging: paging}
export default props => {
  //----------------------------------------------- declare start
  const [text, setText] = useState('')
  const [count, setCount] = useState(0)
  const [type, setType] = useState(true)
  const context = useContext(Context)
  const scrollbars = useRef(null)
  //----------------------------------------------- func start

  const handleChangeInput = event => {
    const {value, maxLength} = event.target
    console.log('# value', value)
    console.log('# count', count)

    setCount(value.length)
    setText(value)
  }

  // const _include = (obj, el) => {
  //   let objArr = []
  //   let flag = false

  //   if (context.customHeader.abcd != undefined) {
  //     alert('true')
  //   } else {
  //     alert('false')
  //   }

  //   obj.forEach(data => {
  //     objArr.push(Object.keys(data).toString())
  //   })

  //   el.forEach(data => {
  //     if (objArr.includes(Object.keys(data).toString()) === true) {
  //       flag = true
  //     } else {
  //       flag = false
  //     }
  //   })
  //   return flag
  // }

  useEffect(() => {
    console.log('## context : ', context)
  }, [])
  //----------------------------------------------- components start
  return (
    <Container>
      <Navi title={type ? '등록 사연' : '사연'} />
      {type ? (
        <DjMain>
          <div className="topBar">
            <div className="refresh">
              <button />
              <span>17:45:20</span>
            </div>
            <Count>사연수 : {test.list.length}개</Count>
          </div>
          <Scrollbars ref={scrollbars} style={{height: '100%'}} autoHide>
            {test.list.map((data, idx) => {
              return (
                <Contents key={idx}>
                  <UserInfo>
                    <div>
                      <Img width={40} height={40} src={'https://devimage.dalbitcast.com/images/api/profile_test5.jpg'} marginRight={8} />
                      <div>{data.nickNm}</div>
                    </div>
                    <div>
                      <span>{Util.format(data.writeDt)}</span>
                      <SaveButton>삭제</SaveButton>
                    </div>
                  </UserInfo>
                  <Story>{data.contents}</Story>
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
          <LButton title={'등록하기'} />
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
const Story = styled.div`
  display: flex;
  width: 100%;
  background: #f5f5f5;
  padding: 20px;
  margin-top: 12px;
  border-radius: 10px;

  font-size: 14px;
  font-weight: 400;
  letter-spacing: -0.35px;
`
