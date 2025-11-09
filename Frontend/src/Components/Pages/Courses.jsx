import React from 'react'
import Header from '../Header';
import Footer from '../Footer';
import Course from '../Course';
import "../../style.css"

function Courses() {
  return (
    <>
    <Header/>
    <div className='coursePage'>
       <Course/>
    </div>
    
    <Footer/>
    </>
  )
}

export default Courses
