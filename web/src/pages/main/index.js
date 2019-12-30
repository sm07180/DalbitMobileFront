/**
 *
 */
import React from 'react'

//pages
/**
 * 상대경로
 * 
import Header from '../common/header'
import Footer from '../common/footer'
 */
import Header from '../common/header'
import Footer from '../common/footer'

const Main = () => {
  return (
    <React.Fragment>
      <Header></Header>
      <h1>
        <a href="/guide">메인페이지</a>
        <span></span>
      </h1>
      <Footer></Footer>
    </React.Fragment>
  )
}
export default Main
