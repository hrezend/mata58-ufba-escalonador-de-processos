import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import HomeImage from '../../assets/logo.svg';

export function HomePage(){
  const actualYear = new Date().getFullYear();

  return(
    <div className="home-container">
      <div className="home-content">
        <img src={HomeImage} alt="Process"></img>
        <h1>UFBA-MATA-58 Operating System</h1>
        <h2>Process Scheduling</h2>
        <Link to="/scheduler" className="button-get-started">
            Get Started
        </Link>
      </div>
      <div className="home-footer">
        <footer>
          <span>All rights reserved ©{actualYear}</span>
        </footer>
      </div>
    </div>
  );
}
