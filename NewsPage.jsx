import React from 'react';
import { Image, Button, Table, Input, Card, Icon } from 'semantic-ui-react';
import CustomHeaderMenu from './src/components/CustomHeaderMenu';
import { Link } from 'react-router-dom';
import { storage } from "./src/firebase.js";
import { firestore } from "./src/firebase.js";

export default class NewsPage extends React.Component {
  constructor() {
    super()
    var today = new Date(),
      date = + today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate()
    this.state = {
      date: date,
      isList: true,
      currentPage: 1,
      itemsPerPage: 20,
      news: [],
      isLoaded: false

    }
  }

  componentDidMount() {
    let currentComponent = this;
    firestore.collection("news").get()
      .then((snapshot) => {
        snapshot.docs.forEach(doc => {
          currentComponent.state.news.push(doc.data());

        })
        currentComponent.setState({
          isLoaded: true,
          news: currentComponent.state.news.sort(function (a, b) {
            var dateA = new Date(a.date), dateB = new Date(b.date);
            return dateB - dateA;
          })
        })
        console.log(this.state.news);

      })

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
  render() {
    const indexOfLastItem = this.state.itemsPerPage * this.state.currentPage;
    const indexOfFirstItem = indexOfLastItem - this.state.itemsPerPage;
    const currentItem = this.state.news.slice(indexOfFirstItem, indexOfLastItem).map((news) => {
      const newsTitle = news.title;
      const newsURL = newsTitle.replace(/ /g, '-');
      if (this.state.isList == true && this.state.isLoaded == true) {
        return (
          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Image</Table.HeaderCell>
                <Table.HeaderCell>Title</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell style={styles.mainList}><Link className="link-to-detail-page" to={`/NewsDetail/${newsURL}`} className="details" style={{ color: 'black' }}>
                  <Image src={news.imageDownloadURL} width="250px" height="350px" /></Link>
                </Table.Cell>
                <Table.Cell style={styles.mainList}><Link className="link-to-detail-page" to={`/NewsDetail/${newsURL}`} className="details" style={{ color: 'black' }}>
                  {news.title}</Link>
                </Table.Cell>
              </Table.Row>
            </Table.Body>

          </Table>

        )
      } else if (this.state.isList == false && this.state.isLoaded == true) {
        return (
          <div style={styles.mainGrid}>
            <Card>
              <Link className="link-to-detail-page" to={`/NewsDetail/${newsURL}`} className="details" style={{ color: 'black' }}>

                <Image src={news.imageDownloadURL} width="300px" height="350px" />
                <Card.Content style={styles.text}>
                  {news.title}
                </Card.Content>
              </Link>
            </Card>

          </div>
        )
      }
    })
    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(this.state.news.length / this.state.itemsPerPage); i++) {
      pageNumbers.push(i);
    }


    return (
      <CustomHeaderMenu
        activeSearchBar
        handleSwitchView={(checkList) => this.setState({ isList: checkList })}
        activeBreadcumb
        childrenRender={(
          <div id="app-body">
            <div style={styles.newsContainer}>
              {currentItem}
            </div>
            <div style={styles.clear}></div>
            <nav>
              <ul style={styles.pagination} className="pagination">
                {pageNumbers.map((number) =>
                  <li key={number} className="page-item" >
                    <a id={number} onClick={this.handlePageChange.bind(this)} className="page-link">{number}</a>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        )} />
    )
  }
}
let styles = {
  mainGrid: {
    width: 300,
    height: 500,
    float: 'left',
    paddingLeft: 40,
    paddingTop: 10
  },
  mainList: {
    width: 400
  },
  text: {
    textDecoration: 'none',
    fontSize: 16,
  },
  newsContainer: {
    width: '100%',
    margin: 30,
    padding: 20
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