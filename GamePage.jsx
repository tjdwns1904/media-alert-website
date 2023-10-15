import React from 'react';
import { Image, Button, Table, Input, Card, Icon } from 'semantic-ui-react';
import CustomHeaderMenu from './src/components/CustomHeaderMenu';
import CustomBreadcumb from './src/components/CustomBreadcumb';

import { Link } from 'react-router-dom';
export default class GamePage extends React.Component {
  constructor() {
    super()
    var today = new Date(),
      date = + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    this.state = {
      date: date,
      isList: true,
      currentPage: 1,
      itemsPerPage: 20,
      filterSearch: ''
    }
  }
  loadGames() {
    fetch('https://cors-anywhere.herokuapp.com/' +
      'https://www.giantbomb.com/api/games/?api_key=64c47efd809a2e99bf25f2aa81f185443cb66de2&format=json&filter=original_release_date:' +
      this.state.date + '|2200-06-09')
      .then(function (res) {
        return res.json()
      })
      .then(games => this.props.dispatch({ type: 'FETCH_GAME', payload: games }))
      .catch((_error) => { });
  }
  componentDidMount() {
    this.loadGames()
  }
  handleOptionChange(isList) {
    this.setState({
      isList
    })
  }
  handlePageChange(e) {
    this.setState({
      currentPage: Number(e.target.id)
    })
  }
  handleSearch(e) {
    this.setState({
      filterSearch: e.target.value,
      currentPage: 1
    })
  }
  isActive(e) {
    e.target.style.color = 'lightgreen'
  }
  render() {
    const indexOfLastItem = this.state.currentPage * this.state.itemsPerPage;
    const indexOfFirstItem = parseInt(indexOfLastItem) - this.state.itemsPerPage;
    const games = this.props.games.results && this.props.games.results.filter((game) => {
      if (this.state.filterSearch == '') {
        return game
      } else if (game.name.toLowerCase().includes(this.state.filterSearch.toLowerCase())) {
        return game
      }
    }).slice(indexOfFirstItem, indexOfLastItem).map((game) => {
      if (this.state.isList == true) {
        return (
          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Image</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Release Date</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row key={game.guid}>
                <Table.Cell style={styles.mainList}><Link className="link-to-detail-page" to={`/GameDetail/${game.guid}`} className="details" style={{ color: 'black' }}>
                  <Image src={game.image.medium_url} width="250px" height="350px" /></Link></Table.Cell>
                <Table.Cell style={styles.mainList}><Link className="link-to-detail-page" to={`/GameDetail/${game.guid}`} className="details" style={{ color: 'black' }}>
                  {game.name}</Link></Table.Cell>
                <Table.Cell style={styles.mainList}><Link className="link-to-detail-page" to={`/GameDetail/${game.guid}`} className="details" style={{ color: 'black' }}>
                  {game.expected_release_year}-{game.expected_release_month}-{game.expected_release_day}</Link></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>)
      } else {
        return (

          <div key={game.guid} style={styles.mainGrid}>
            <Card>
              <Link className="link-to-detail-page" to={`/GameDetail/${game.guid}`} className="details" style={{ color: 'black', marginTop: 0 }}>
                <Image src={game.image.medium_url} width="300px" height="350px" />
                <Card.Content style={styles.text}>
                  {game.name}</Card.Content>
                <Card.Description>
                  <p style={{ fontSize: 14, color: "#959595", paddingLeft: 20 }}>{game.expected_release_year}-{game.expected_release_month}-{game.expected_release_day}</p>
                </Card.Description>
              </Link>
            </Card>
          </div>
        )
      }
    }
    )
    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(this.props.games.results && this.props.games.results.filter((game) => {
      if (this.state.filterSearch == '') {
        return game
      } else if (game.name.toLowerCase().includes(this.state.filterSearch.toLowerCase())) {
        return game
      }
    }).length / this.state.itemsPerPage); i++) {
      pageNumbers.push(i)
    }
    return (
      <CustomHeaderMenu
        activeSearchBar={false}
        childrenRender={(<div id="app-body">
          {<div className="below-nav-bar">
            <div>
              <CustomBreadcumb />
              <Input className="search-bar-list" icon="search" placeholder="Search" onChange={this.handleSearch.bind(this)}></Input>
            </div>
            <div style={{ margin: '20px 0', height: '50px' }}>
              <Button
                className="button-group-switch"
                size="large"
                name='gridListview'
                onClick={() => this.handleOptionChange(!this.state.isList)}
                style={{
                  // backgroundColor: isList ? '#7DA2A9' : '#242424',
                  backgroundColor: 'transparent',
                  color: !this.state.isList ? '#7DA2A9' : '#242424',
                  textAlign: 'right',
                }}
              >
                <Icon name={this.state.isList ? 'list ul' : 'grid layout'} />
                {this.state.isList ? 'Grid view' : 'List view'}
              </Button>
            </div>
          </div>}
          <div style={styles.clear}></div>
          <div style={styles.gameContainer}>
            {games}
          </div>
          <div style={styles.clear}></div>
          <nav>
            <ul className="pagination" style={styles.pagination}>
              {pageNumbers.map((number) =>
                <li key={number} className="page-item" >
                  <a id={number} onClick={this.handlePageChange.bind(this)} className="page-link">{number}</a>
                </li>
              )}
            </ul>
          </nav>
        </div>)}
      />)

  }
}
let styles = {
  mainGrid: {
    width: 300,
    height: 500,
    float: 'left',
    paddingTop: 10,
    marginTop: 0,
  },
  mainList: {
    width: 400
  },
  text: {
    'white-space': 'nowrap',
    width: '280px',
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
    marginTop: 20,
    marginBottom: 20,
    textDecoration: 'none',
    fontSize: 16,
    paddingLeft: 20,
  },
  gameContainer: {
    width: '100%',
    // margin: 30,
    // padding: 20
  },
  clear: {
    clear: 'both'
  },
  belowNavBar: {
    position: 'relative',
    margin: '0 auto',
    top: -50,
  },
  searchBar: {
    position: 'absolute',
    margin: '0 auto',
    right: 0,
    height: 30,
    width: 180
  },
  view: {
    position: 'absolute',
    margin: '0 auto',
    right: 0,
    top: 40
  },
  pagination: {
    position: 'relative',
    left: 600,
    top: -10
  }
}