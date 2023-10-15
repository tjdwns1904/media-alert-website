import React, { useState } from 'react';
import { Button, Input } from 'semantic-ui-react';
import { PropTypes } from 'prop-types';
import './styles.css';
const CustomHeaderMenu = (props) => {
  /**
   * Function handle search data
   * @param {object} event 
   */

  /**
   * Function handle switch view of list or grid
   * @param {boolean} isList 
   */
  const handleSwitch = (isList) => {
    if (handleSwitchView) { handleSwitchView(isList) }
    setView(isList);
  };
  return (<div>
    <div id="navbar">
      <a href="http://localhost:8080/" id="nav-menu-logo">Media-Track.com</a>
      <a href="" className="nav-menu-links" >Movies</a>
      <a href="" className="nav-menu-links" >Games</a>
      <a href="" className="nav-menu-links" >News</a>
      <a href="" className="nav-menu-links" >Subscription</a>
      <a href="" className="nav-menu-links">User A</a>
    </div>
    <div className="div-clear"></div>
  </div>);
}

CustomHeaderMenu.propTypes = {
}

export default CustomHeaderMenu;
