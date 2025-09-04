import React from 'react';
import logo from '../assets/logo2.png';

const Header = () => {
  return (
    <div className="header">
      <img src={logo} alt="Logo" className="header-logo" />
      <h1 className="header-title mt-10px">IntrvuFit - Know your fit. Close the gap with AI.</h1>
    </div>
  );
};

export default Header;
