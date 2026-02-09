//import React from 'react'
import "../styles/Header.css"
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const Header = () => {
    const {t, i18n}=useTranslation()
    const changeLanguage = (lng: string) =>{
        i18n.changeLanguage(lng)
    }
  return (
    <header className='header'>
    <h1 className='headerText'>Header</h1>
      <nav className='navbar'>
        
        <ul>
            <Link to="/" className='navigation'>{t("Home")} </Link>
            <Link to="/about" className='navigation'>{t("About")} </Link>
            <button id="fi" className='langbtn' onClick={()=>changeLanguage("fi")}>FI</button>
            <button id='en' className='langbtn' onClick={()=>changeLanguage("en")}>EN</button>
        </ul>
      </nav>
    </header>
  )
}

export default Header
