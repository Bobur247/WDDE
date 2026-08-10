import React from 'react'
import './Navbar.css'
import { logoImg, avatarImg } from '../../../assets/index'
export const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        <img src={logoImg} className="logoImg" alt="Alog" />
        <div className="navbarText">
          <h3>WDDE</h3>
          <p>Word Document Toolkit</p>
        </div>
      </div>
      <div className="user">
        <form action="" className="language">
          <select name="" id="">
            <option value="">Uzbek</option>
            <option value="">Узбек</option>
            <option value="">English</option>
          </select>
        </form>
        <div className="userAvatar">
          <img src={avatarImg} alt="" />
        </div>
      </div>
    </div>
  )
}
