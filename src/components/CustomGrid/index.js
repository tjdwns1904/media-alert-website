/**
 * Export Grid Components
 */

// Import from libraries
import React, { useState, useEffect } from 'react';
import { get, chunk, differenceWith } from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './styles.css';
import { Grid, Card, Image, Pagination, Icon } from 'semantic-ui-react';

const KEY_SEARCH = ['title', 'releaseDate', 'overview', 'score'];

const styleCard = {
  // border: '1px solid black',
};

const styleNoWrap = {
  whiteSpace: 'nowrap',
  maxWidth: '250px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

/**
 * TABEL COLUMN RENDER
 * @param {array} listData
 */
const gridRowsData = (listData, detailUrl) => {
  const arrayRow = chunk(listData, 4).map((row) => {
    const arrCol = row.map((col) => {
      return (
        <Grid.Column largeScreen={4} computer={4} tablet={4} mobile={4} style={styleCard}>
          {detailUrl &&
            <Link
              className="link-to-detail-page"
              to={`/${detailUrl}/${get(col, 'id')}`}
            >
              <Card>
                <Image src={get(col, 'image')} wrapped ui={false} />
                <Card.Content>
                  <Card.Header style={styleNoWrap}>{get(col, 'title')}</Card.Header>
                  <Card.Meta>
                    <span className='date'>{get(col, 'releaseDate')}</span>
                  </Card.Meta>
                  <Card.Description style={styleNoWrap}>
                    {get(col, 'overview')}
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <a>
                    <Icon name='star' />
                    {get(col, 'score')}
                  </a>
                </Card.Content>
              </Card>
            </Link>}

        </Grid.Column>
      )
    });
    return <Grid.Row columns={4}>
      {arrCol}
    </Grid.Row>
  });
  return arrayRow;
}

const tableFooterPaginator = (paginator) => {
  return <Grid.Row>
    <Grid.Column width={16} textAlign="center">
      <Pagination
        style={{}}
        defaultActivePage={1}
        totalPages={get(paginator, 'totalPages') || 1}
        onPageChange={(_event, data) => paginator && paginator.onPageChange(data && data.activePage, data)}
      />
    </Grid.Column>
  </Grid.Row>;
}

const CustomGrid = ({ listData = [], paginator, textSearch = null, detailUrl }) => {
  const [showedData, setShowedData] = useState([]);

  useEffect(() => {
    if (differenceWith(showedData, listData)) {
      setShowedData(listData);
    }
  }, [listData]);

  const handleSearch = () => {
    const result = showedData.filter((item) => {
      let isIncluded = false;
      KEY_SEARCH.forEach((key) => {
        if (item[key] && item[key].toString().toLowerCase().includes(textSearch.toLowerCase())) {
          isIncluded = true;
          return;
        }
      });
      if (isIncluded) { return item; }
    });
    setShowedData(result);
  }
  useEffect(() => {
    if (textSearch !== null && textSearch !== '') {
      handleSearch();
    } else if (differenceWith(showedData, listData)) {
      setShowedData(listData);
    }
  }, [textSearch]);
  return (<Grid className="main-grid">
    {gridRowsData(showedData, detailUrl)}
    {paginator && paginator.active && tableFooterPaginator(paginator)}
  </Grid>);
};

CustomGrid.defaulProps = {
  paginator: {
    active: false,
  },
}

CustomGrid.propTypes = {
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
};

export default CustomGrid;