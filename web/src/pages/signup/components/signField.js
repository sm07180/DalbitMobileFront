import React from 'react'

// global components
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'

const SignField = (props) => {
  const {title, subTitle, onClick, children} = props

  return (
    <section className='signField'>
      <div className='title'>
        <h2>{title}</h2>
        <h3>{subTitle}</h3>
      </div>
      <form>
        <div className='inputWrap'>
          {children}
        </div>
        <SubmitBtn text="다음" onClick={onClick} />
      </form>
    </section>
  )
}

export default SignField