import React from 'react';

const Footer = ({ version }) => {
  return (
    <div className="footer">
      Job Match Assistant v{version}<br />
      All rights reserved ©2025 IntrvuFit - Resume optimizer
    </div>
  );
};

export default Footer;
