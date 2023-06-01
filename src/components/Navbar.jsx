import React, { useState } from 'react'
import icon from '../img/logo.png'
import "./Navbar.css";
const Navbar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleNavClick = () => {
    setIsOpen(!isOpen);
    props.handleNavClick()
    window.scroll({
    });
  }
  const closeNav = () => {
    setIsOpen(!isOpen);
    props.handleNavClick()
  }

  return (
    <div className={`navbar ${isOpen && "open"}`} >
      <div className="left-nav">
        <a href="/"> <img src={icon} alt="cryptopia Logo" id="logo-img"></img></a>
        <a href="/homepage" className='logo-name'>CRYPTOPIA</a>

      </div>

      <div className={`nav-toggle ${isOpen && "open"}`} onClick={handleNavClick}>
        <div className="bar">

        </div>
      </div>
      <div className={`nav-items ${isOpen && "open"}`} >
        <a href="/cryptocurrencies" onClick={closeNav} className='nav-item'>Cryptocurrencies</a>
        <a href="/news" onClick={closeNav} className='nav-item'>News</a>
        <a href="/portfolio" onClick={closeNav} className='nav-item'>Portfolio</a>
      </div>
    </div >
  )
}

export default Navbar