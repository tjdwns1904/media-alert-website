import React, { useState } from 'react';
import { Button, Input } from 'semantic-ui-react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';

import { Icon } from 'semantic-ui-react';

import './styles.css';
import CustomBreadcumb from '../CustomBreadcumb/index';

const checkIfContainsPath = (pathName) => typeof pathName === 'string' && window.location.href.includes(pathName) ? ' active' : '';

const CustomHeaderMenu = (props) => {
  const {
    childrenRender, handleSwitchView, handleSearchText, activeSearchBar, activeBreadcumb, isMainPage,
  } = props;
  const [isList, setView] = useState(true);
  /**
   * Function handle search data
   * @param {object} event 
   */
  const handleSearch = (event) => {
    const { target } = event;
    const { value } = target;
    if (handleSearchText) { handleSearchText(value); }
  }
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
      <Link id="nav-menu-logo" to="/">Media-Track.com</Link>
      <div id="nav-header-menu">
        <Link className={`nav-menu-links${checkIfContainsPath('Authentication')}`} to="/Authentication">AUTHENTICATION</Link>
        <Link className={`nav-menu-links${checkIfContainsPath('Map')}`} to="/Map">MAPS</Link>
        <Link className={`nav-menu-links${checkIfContainsPath('Subscriptions')}`} to="/Subscriptions">SUBSCRIPTIONS</Link>
        <Link className={`nav-menu-links${checkIfContainsPath('AdminPost')}`} to="/AdminPost">POST ARTICLES</Link>
        <Link className={`nav-menu-links${checkIfContainsPath('NewsPage')}`} to="/NewsPage">NEWS</Link>
        <Link className={`nav-menu-links${checkIfContainsPath('GameUpcoming')}`} to="/GameUpcoming">UPCOMING GAMES</Link>
        <Link className={`nav-menu-links${checkIfContainsPath('MovieUpcoming')}`} to="/MovieUpcoming">UPCOMING MOVIES</Link>
      </div>
    </div>
    <div className="div-clear"></div>
    {activeSearchBar && <div className="below-nav-bar">
      <div className="pagination-search">
        <CustomBreadcumb />
        <Input className="search-bar-list" icon="search" placeholder="Search" onChange={handleSearch}></Input>
      </div>
      <div className="switch-list-grid">
        <Button
          className="button-group-switch"
          size="large"
          name='gridListview'
          onClick={() => handleSwitch(!isList)}
          style={{
            // backgroundColor: isList ? '#7DA2A9' : '#242424',
            backgroundColor: 'transparent',
            color: !isList ? '#7DA2A9' : '#242424',
            textAlign: 'right',
          }}
        >
          <Icon name={isList ? 'list ul' : 'grid layout'} />
          {isList ? 'Grid view' : 'List view'}
        </Button>
      </div>
    </div>}
    {!activeSearchBar && !!activeBreadcumb && <div className="below-nav-bar">
      <div className="pagination-search">
        <CustomBreadcumb />
      </div>
      <div className="switch-list-grid">
      </div>
    </div>}
    <div className={isMainPage ? 'main-page' : ''}>
      {childrenRender || ''}
    </div>
    <div className="div-clear"></div>
  </div>);
}

CustomHeaderMenu.defaultProps = {
  activeSearchBar: true,
  activeBreadcumb: false,
  isMainPage: true,
}

CustomHeaderMenu.propTypes = {
  childrenRender: PropTypes.node,
  handleSwitchView: PropTypes.func,
  handleSearchText: PropTypes.func,
  activeSearchBar: PropTypes.bool,
  activeBreadcumb: PropTypes.bool,
  isMainPage: PropTypes.bool,
}

export default CustomHeaderMenu;
