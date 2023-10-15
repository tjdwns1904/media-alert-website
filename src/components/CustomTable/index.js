/**
 * Export Table Components
 */

// Import from libraries
import React, { useEffect, useState } from 'react';
import { get, sortBy, differenceWith } from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Pagination, Icon } from 'semantic-ui-react';
import './styles.css';

/**
 * TABEL COLUMN RENDER
 * @param {array} columns
 */
const tableColumns = (columns, { direction, selectedColumn, handleSort }) => {
  const headerCells = columns.map((item, idx) => <Table.HeaderCell
    className={get(item, 'colClass') || null}
    key={get(item, 'key') || idx}
    sorted={item && item.sortable && selectedColumn === get(item, 'key') ? direction : null}
    onClick={item && item.sortable ? () => handleSort(get(item, 'key')) : null}
  >
    {get(item, 'name') || ''}
    {item && item.sortable && selectedColumn !== get(item, 'key') && <Icon className="sort-icon" name="sort" />}
  </Table.HeaderCell>)
  return <Table.Header>
    <Table.Row>
      {headerCells}
    </Table.Row>
  </Table.Header>;
}

/**
 * TABEL COLUMN RENDER
 * @param {array} columns
 * @param {array} listData
 * @param {string} detailUrl
 */
const tableRowsData = (listData, columns, detailUrl) => {
  const rowData = listData.map((itemRow) => {
    const cols = columns.map((itemCol) => {
      const itemColKey = get(itemCol, 'key');
      const formatterCol = itemCol && itemCol.formatter && itemCol.formatter(itemRow);
      return <Table.Cell key={`${get(itemCol, 'key')}-cell`}>{detailUrl ? <Link className="link-to-detail-page" to={`/${detailUrl}/${get(itemRow, 'id')}`}>{formatterCol || get(itemRow, itemColKey)}</Link> : (formatterCol || get(itemRow, itemColKey))}</Table.Cell>;
    });
    return <Table.Row key={get(itemRow, 'id')}>
      {cols}
    </Table.Row>;
  });
  return <Table.Body>
    {rowData}
  </Table.Body>;
}

const tableFooterPaginator = (colSpan, paginator) => {
  return <Table.Footer>
    <Table.Row>
      <Table.HeaderCell colSpan={colSpan || 1}>
        <Pagination defaultActivePage={1} totalPages={get(paginator, 'totalPages') || 1} onPageChange={(_event, data) => paginator && paginator.onPageChange(data && data.activePage, data)} />
      </Table.HeaderCell>
    </Table.Row>
  </Table.Footer>;
}

const CustomTable = ({ listData = [], columns = [], paginator, textSearch = null, detailUrl }) => {
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [showedData, setShowedData] = useState([]);
  const [direction, setDirection] = useState(null);

  useEffect(() => {
    if (differenceWith(showedData, listData)) {
      setShowedData(listData);
    }
  }, [listData]);

  const handleSearch = () => {
    const keySearchs = columns.map((item) => item && item.key);
    const result = showedData.filter((item) => {
      let isIncluded = false;
      keySearchs.forEach((key) => {
        if (item[key].toLowerCase().includes(textSearch.toLowerCase())) {
          isIncluded = true;
          return;
        }
      });
      if (isIncluded) { return item; }
    });
    // const result = showedData.filter((item) => keySearchs.map((key) => item[key] && item[key].includes(textSearch)));
    setShowedData(result);
  }
  useEffect(() => {
    if (textSearch !== null && textSearch !== '') {
      handleSearch();
    } else if (differenceWith(showedData, listData)) {
      setShowedData(listData);
    }
  }, [textSearch]);
  const handleSort = (clickedColumn) => {
    if (selectedColumn !== clickedColumn) {
      setSelectedColumn(clickedColumn);
      setShowedData(sortBy(showedData, [clickedColumn]));
      setDirection('ascending');
    } else {
      setShowedData(showedData.reverse());
      setDirection(direction === 'ascending' ? 'descending' : 'ascending');
    }
  }
  const statePassed = {
    selectedColumn,
    direction,
    handleSort,
  }
  return (<Table sortable celled fixed singleLine color="black">
    {tableColumns(columns, statePassed)}
    {tableRowsData(showedData, columns, detailUrl)}
    {paginator && paginator.active && tableFooterPaginator(columns.length, paginator)}
  </Table>);
};

CustomTable.defaulProps = {
  paginator: {
    active: false,
  },
  detailUrl: null,
}

CustomTable.propTypes = {
  // Array of data fetch from API
  listData: PropTypes.array,
  // Array of columns will visible on table
  columns: PropTypes.array,
  // Search data of page
  // textSearch: PropTypes.string,
  // paginator active
  paginator: PropTypes.shape({
    // enable paginator
    active: PropTypes.bool,
    // handle on page change
    onPageChange: PropTypes.func,
    // total page
    totalPages: PropTypes.number,
  }),
  // Detail link
  detailUrl: PropTypes.string,
};

export default CustomTable;