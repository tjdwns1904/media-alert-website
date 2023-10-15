/**
 * Export App Breadcumb
 */
import React from 'react'
import { Breadcrumb } from 'semantic-ui-react'
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import './styles.css';


const arraySections = () => {
  const { pathname } = window.location;
  const defaultArray = [{ key: 'Home', content: <Link to="/">Home</Link>, link: true }];
  if (pathname.includes('MovieDetail')) {
    defaultArray.push({ key: 'MovieUpcoming', content: <Link to="/MovieUpcoming">Upcoming Movies</Link>, link: true })
    defaultArray.push({ key: 'MovieDetail', content: 'Movie Detail', active: true })
    
  } else if (pathname.includes('MovieUpcoming')) {
    defaultArray.push({ key: 'MovieUpcoming', content: 'Upcoming Movies', active: true })
  } else if (pathname.includes('GameDetail')) {
    defaultArray.push({ key: 'GameUpcoming', content: <Link to="/GameUpcoming">Upcoming Games</Link>, link: true })
    defaultArray.push({ key: 'GameDetail', content: 'Game Detail', active: true })
    
  } else if (pathname.includes('GameUpcoming')) {
    defaultArray.push({ key: 'GameUpcoming', content: 'Upcoming Games', active: true })
  } else if (pathname.includes('Authentication')){
    defaultArray.push({ key: 'Authentication', content: 'Authentication', active: true})
  } else if (pathname.includes('AdminPost')){
    defaultArray.push({ key: 'AdminPost', content: 'Posting Article', active: true})
  } else if (pathname.includes('NewsPage')){
    defaultArray.push({ key: 'NewsPage', content: 'News', active: true})
  } else if (pathname.includes('Subscriptions')){
    defaultArray.push({ key: 'Subscriptions', content: <Link to="Subscriptions">Subscriptions</Link>, active: true})
  } else if (pathname.includes('NewsDetail')){
    defaultArray.push({ key: 'NewsPage', content: <Link to="/NewsPage">News</Link>, active: true})
    defaultArray.push({key: 'NewsDetail', content: 'News Detail', active: true})
  }
  return defaultArray;
}

const CustomBreadcumb = (props) => (
  <Breadcrumb size="big" {...props} icon='right angle' sections={arraySections()} />
);

CustomBreadcumb.propTypes = {
  sections: PropTypes.array,
};

export default CustomBreadcumb
