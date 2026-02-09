//import React from 'react'
import { useTranslation } from 'react-i18next'

const MyContainer = () => {

  const {t}=useTranslation()

  return (
    
    <div className='container'>
        
      <h2> {t("This is the front page")}</h2>
    </div>
  )
}

export default MyContainer
