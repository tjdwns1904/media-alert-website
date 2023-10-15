/**
 * Export List with tabs Components
 */

// Import from libraries
import React, { useState, useEffect } from 'react';
import { get, uniqBy } from 'lodash';
import PropTypes from 'prop-types';
import './styles.css';
import { Rail, Image, Button, Header, Sticky, Menu, Segment, Divider, Label, Icon } from 'semantic-ui-react';

const CustomList = ({ listData = [], handleUnsubscribe }) => {
  const [isMovie, setIsMovie] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const uniqArray = uniqBy(listData, 'itemId');
  const filterType = isMovie ? ' movie' : 'game';
  const [amountSub, setAmountSub] = useState({ movie: 0, game: 0 });
  const [arrData, setArrData] = useState(uniqArray.filter((item) => item.type === filterType));

  useEffect(() => {
    const type = isMovie ? 'movie' : 'game';
    const filterArray = uniqArray.filter((item) => item.type === type);
    setArrData(filterArray);
    const movie = isMovie ? filterArray.length : uniqArray.length - filterArray.length;
    const game = isMovie ? uniqArray.length - filterArray.length : filterArray.length;
    setAmountSub({ movie, game })
  }, [isMovie, listData]);

  const unsubscribe = (id) => {
    if (handleUnsubscribe) {
      handleUnsubscribe(id, setSelectedItem);
    }
  }

  const handleChangeTab = (isMovie) => {
    setIsMovie(isMovie);
    setSelectedItem(null);
  }

  const { movie, game } = amountSub;

  return (<div className="custom-list-subscription">
    <Sticky>
      <Menu
        attached='top'
        tabular
        style={{ backgroundColor: '#fff', paddingTop: '1em' }}
        onItemClick={(item) => console.log(item)}
      >
        <Menu.Item as='a' active={isMovie} name='movie' style={{ display: 'block', textAlign: 'center' }} onClick={() => handleChangeTab(true)}>
          Movie
          <Label style={{ backgroundColor: 'transparent' }}>
            <Icon name='heart' color='red' children={movie} />
          </Label>
        </Menu.Item>
        <Menu.Item as='a' active={!isMovie} name='game' style={{ display: 'block', textAlign: 'center' }} onClick={() => handleChangeTab(false)}>
          Game
          <Label style={{ backgroundColor: 'transparent' }}>
            <Icon name='heart' color='red' children={game} />
          </Label>
        </Menu.Item>
      </Menu>
    </Sticky>
    <Segment attached='bottom'>
      {arrData.map((item) => (
        <div key={get(item, 'docId')} onClick={() => setSelectedItem(item)}>
          <div className="subscriptions-list-image">
            <Image key={get(item, 'itemId')} src={get(item, 'imagePoster')} size='tiny' verticalAlign='middle' />
          </div>
          <div className="subscriptions-list-detail">
            <Header as='h1' size="large">{get(item, 'title')}</Header>
            <p className="color-grey-and-bold">{get(item, 'genres')}</p>
          </div>
          <Divider />
        </div>
      ))}
      <Rail position='right'>
        <Sticky active={selectedItem}>
          <Header as='h1' size="large">{get(selectedItem, 'title')}</Header>
          <Image src={get(selectedItem, 'imagePoster')} size='medium' rounded style={{ marginBottom: '20px' }} />
          {selectedItem && <p className="color-grey-and-bold">{get(selectedItem, 'genres')}</p>}
          {selectedItem && <p className="color-grey-and-bold">{isMovie ? 'Tagline' : 'Platforms'}: <span style={{ color: 'black', fontSize: '1rem' }}>{get(selectedItem, isMovie ? 'tagline' : 'platforms') || 'none'}</span></p>}
          {selectedItem && <Button
            color='red'
            content="Unsubscribe"
            icon="bell slash"
            // disabled={!uid || uid === ''}
            onClick={() => unsubscribe(get(selectedItem, 'docId'))}
          />}
        </Sticky>
      </Rail>
    </Segment>
  </div>);
};

CustomList.defaulProps = {
  paginator: {
    active: false,
  },
}

CustomList.propTypes = {
  // Array of data fetch from API
  listData: PropTypes.array,
  // Text search grid
  textSearch: PropTypes.string,
  // paginator active
  paginator: PropTypes.shape({
    // enable paginator
    active: PropTypes.bool,
    // handle on page change
    onPageChange: PropTypes.func,
    // total page
    totalPages: PropTypes.number,
  }),
  // url to detail page
  detailUrl: PropTypes.string,
  handleUnsubscribe: PropTypes.func,
};

export default CustomList;