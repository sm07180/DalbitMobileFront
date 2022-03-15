import React, {useContext} from 'react'
import {IMG_SERVER} from 'context/config'
import {Context} from 'context'
import {useHistory} from 'react-router-dom'
import moment from 'moment'

// global components
import GenderItems from 'components/ui/genderItems/GenderItems'
// components
import RankList from '../../components/rankList/RankList'
// contents
// css
import '../style.scss'

const RoundList = (props) => {
  const {myRankInfo, rankInfo, lodingTime, moreRank, eventFixDate} = props
  const history = useHistory()
  const context = useContext(Context)
  const {token} = context

  const nowTime = moment().format('MMDDHH')
  const roundEnd = moment(eventFixDate.end).format('MMDDHH')
  const roundStart = moment(eventFixDate.start).format('MMDDHH')

  return (
    <section className="listWrap">
      <div className="rankWrap">
      {token.isLogin ?
        <RankList photoSize={55} listNum={myRankInfo.rankNo} rankList={myRankInfo} type="my">
          <div className="listContent">
            <div className="listItem">
              <GenderItems data={myRankInfo.mem_sex} />
              <div className="nick">{myRankInfo.mem_nick}</div>
            </div>
            {
              (nowTime <= roundEnd && nowTime > roundStart)&&
              <div className="listItem">
                <i className="d">{myRankInfo.ins_d_cnt}</i>
                <i className="a">{myRankInfo.ins_a_cnt}</i>
                <i className="l">{myRankInfo.ins_l_cnt}</i>
              </div>
            }            
          </div>
          <div className="listBack">
            <img src={`${IMG_SERVER}/event/rebranding/dalla_logo.png`} alt="dalla" />
            <span>{myRankInfo.dalla_cnt}</span>
          </div>
        </RankList>
        :
        <div onClick={() => history.push('/login')} style={{cursor:'pointer'}}>
          <RankList photoSize={0} type="my">
            <div className="listContent">
              <div className="text">로그인하고 달라를 모아보세요!</div>
            </div>
            <div className="listBack">
              <img src={`${IMG_SERVER}/event/rebranding/dalla_logo.png`} alt="dalla" />
              <span>{myRankInfo.dalla_cnt}</span>
            </div>
          </RankList>
        </div>
      }
      </div>
      {nowTime > lodingTime ?
        <div className="rankWrap">
          {rankInfo.map((data,index) => {
            return (
              <React.Fragment key={index}>
              {index < 20 &&
                <RankList photoSize={55} listNum={index} rankList={data}>
                  <div className="listContent">
                    <div className="listItem">
                      <GenderItems data={data.mem_sex} />
                      <div className="nick">{data.mem_nick}</div>
                    </div>
                  </div>
                  {/* <div className="listBack">
                    <span>{data.dalla_cnt}</span>
                  </div> */}
                </RankList>
              }
              </React.Fragment>
            )
          })}
          <button className="moreBtn" onClick={moreRank}>더보기</button>
        </div>
        :
        <div className="noList">
          <img src={`${IMG_SERVER}/event/rebranding/list_none.png`} />
          <span>참가자들이 dalla를 만들고 있어요!</span>
        </div>
      }
    </section>
  )
}

export default RoundList