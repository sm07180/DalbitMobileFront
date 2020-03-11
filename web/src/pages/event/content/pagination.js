/**
 * @title 결과값이 없습니다.
 */
import React, {useState, useEffect, useContext, Children} from 'react'
import axios from 'axios'
import Posts from './posts'
import Page from './page'
import Tab from './tab'
import styled from 'styled-components'
//context
import {Context} from 'context'
import API from 'context/api'
import useResize from 'components/hooks/useResize'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

export default props => {
  const context = useContext(Context)
  //---------------------------------------------------------------------
  const [posts, setPosts] = useState([])
  const [broadList, setBroadList] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostperpage] = useState(6)

  //context
  //---------------------------------------------------------------------
  //   useEffect(() => {
  //     const fetchPosts = async () => {
  //       const res = await axios.get('https://jsonplaceholder.typicode.com/posts')
  //       setPosts(res.data)
  //     }
  //     fetchPosts()
  //   }, [])
  //   console.log(posts)

  //api
  async function fetchData(obj) {
    const res = await API.broad_list({
      url: '/broad/list',
      method: 'get'
    })
    if (res.result === 'success') {
      setBroadList(res.data)
    }
    setPosts(res.data.list)
  }

  useEffect(() => {
    fetchData({
      data: {
        roomType: '',
        page: 1,
        records: 10
      }
    })
  }, [])

  //이벤트 리사이즈시

  useEffect(() => {
    if (window.innerWidth <= 600) {
      setPostperpage(3)
    } else if (window.innerWidth > 600) {
      setPostperpage(6)
    }
  }, [useResize()])

  //현재페이지
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)
  //체인지페이지
  const paginate = pageNumer => {
    setCurrentPage(pageNumer)
  }

  return (
    <Wrap className="container mt-5">
      {props.children}

      <Posts posts={currentPosts} />

      <Page postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate} />
      {/* <Tab postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate} /> */}
    </Wrap>
  )
}
//------------------------------------------------------------------

//styled
const Wrap = styled.div`
  & .titleBox {
    display: flex;
    padding: 48px 0 25px 0;
    font-size: 20px;
    border-bottom: 1px solid ${COLOR_MAIN};
    & h2 {
      font-size: 20px;
      color: ${COLOR_MAIN};
      margin-right: 10px;
    }
    & h3 {
      font-size: 20px;
      color: #757575;
    }
  }
`
