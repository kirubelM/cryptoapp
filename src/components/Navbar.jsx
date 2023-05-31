import React, { useState } from 'react'
// import { /*Button, Menu,*/ Typography, Avatar } from 'antd'
// import { Link } from 'react-router-dom';
// import { HomeOutlined, MoneyCollectOutlined, BulbOutlined, FundOutlined, MenuOutlined } from '@ant-design/icons';
import icon from '../img/icons8-cryptocurrency-512.png'
import "./Navbar.css";
const Navbar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleNavClick = () => {
    setIsOpen(!isOpen);
    props.handleNavClick()
    window.scroll({
      // top: 0,
    });
  }
  const closeNav = () => {
    setIsOpen(!isOpen);
    props.handleNavClick()
  }

  return (
    <div className={`navbar ${isOpen && "open"}`} >
      <div className="left-nav">
        <a href="/home"> <img src={icon} alt="cryptopia Logo" id="logo-img"></img></a>
      </div>
      <div className={`nav-items ${isOpen && "open"}`} >
        <a href="/home" onClick={closeNav} className='nav-item'>Home</a>
        <a href="/cryptocurrencies" onClick={closeNav} className='nav-item'>Cryptocurrencies</a>
        <a href="/exchanges" onClick={closeNav} className='nav-item'>Exchanges</a>
        <a href="/news" onClick={closeNav} className='nav-item'>News</a>
      </div>
      <div className={`nav-toggle ${isOpen && "open"}`} onClick={handleNavClick}>
        <div className="bar">

        </div>
      </div>
    </div >
    // <div className={`navbar ${isOpen && "open"}`} >

    //   <div >
    //     <div className='logo-container'>
    //       <Avatar src={icon} size="large" />
    //       <Typography.Title level={2} className='logo'>
    //         <Link to='/home'>Cryptopia</Link>
    //       </Typography.Title>
    //       {/* <Button className='menu-control-container' onClick={() => setActiveMenu(!activeMenu)}><MenuOutlined /></Button> */}
    //     </div>
    //     <div className={`nav-items ${isOpen && "open"}`} >
    //       <a href="/home">Home</a>
    //       <a href="/cryptocurrencies">Cryptocurrencies</a>
    //       <a href="/exchanges">Exchanges</a>
    //       <a href="/news">News</a>

    //     </div>
    //   </div>
  )
}

export default Navbar