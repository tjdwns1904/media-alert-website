import React, { Fragment } from 'react'
import { THE_MOVIE_DB } from './constants';
import { Divider, Header, Image, Segment, Card, Button, Container, Label, Icon } from 'semantic-ui-react'
import CustomHeaderMenu from './src/components/CustomHeaderMenu';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { firestore, auth } from "./src/firebase.js";
import { get } from 'lodash'
class HomePage extends React.Component {
  constructor() {
    super()
    var today = new Date(),
      date = + today.getFullYear() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + today.getDate()
    this.state = {
      date: date,
      movies: [],
      itemPerSlide: 5,
      currentGameSlide: 1,
      currentMovieSlide: 1,
      currentNewsSlide: 1,
      news: [],
      subscription: [],
      isSent: false
    }
  }

  handleGameSlideChange(e) {
    this.setState({
      currentGameSlide: Number(e.target.id)
    })
  }
  handleMovieSlideChange(e) {
    this.setState({
      currentMovieSlide: Number(e.target.id)
    })
  }
  handleNewsSlideChange(e) {
    this.setState({
      currentNewsSlide: Number(e.target.id)
    })
  }
  sendEmail(email, title) {
    if (email == undefined) { return null; }
    Email.send({
      Host: "smtp.gmail.com",
      Username: "mediaalertweb@gmail.com",
      Password: "VNExpr3ss!",
      To: email,
      From: "mediaalertweb@gmail.com",
      Subject: 'Subscribed Item released!!',
      Body: 'Hello ' + title + ' Released'
    }).then(
      alert(title + ' released!')
    )
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
  loadMovies() {
    const { dispatch } = this.props;
    fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${THE_MOVIE_DB.apiKey}&language=en-US`)
      .then(function (res) {
        return res.json()
      })
      .then((payload) => {
        dispatch({ type: 'FETCH_MOVIES', payload })
      })
      .then(function (movies) {
        this.setState({ movies })
      }.bind(this))
      .catch((_error) => { });
  }
  changeActiveSlide() {
    let nextGameSlide = this.state.currentGameSlide + 1
    let nextMovieSlide = this.state.currentMovieSlide + 1
    let nextNewsSlide = this.state.currentNewsSlide + 1
    if (nextGameSlide > Math.ceil(this.props.games.results && this.props.games.results.length / this.state.itemPerSlide / 4)) {
      nextGameSlide = 1
    }
    if (nextMovieSlide > Math.ceil(this.props.movies.results && this.props.movies.results.length / this.state.itemPerSlide)) {
      nextMovieSlide = 1
    }
    if (nextNewsSlide > Math.ceil(this.state.news.length / this.state.itemPerSlide)) {
      nextNewsSlide = 1
    }
    this.setState({ currentGameSlide: nextGameSlide, currentMovieSlide: nextMovieSlide, currentNewsSlide: nextNewsSlide })
  }
  loadNews() {
    let currentComponent = this;
    firestore.collection("news").get()
      .then((snapshot) => {
        snapshot.docs.forEach(doc => {
          currentComponent.state.news.push(doc.data());
        })
      })
  }

  componentDidMount() {
    this.loadNews();
    this.loadMovies();
    this.loadGames();
    // setInterval(
    //   this.changeActiveSlide.bind(this), 8000);
  }
  render() {
    const { games, movies } = this.props;
    const { news, subscription, isSent, date } = this.state;
    const email = get(auth, 'currentUser.email')
    const uid = get(auth, 'currentUser.uid')
    firestore.collection("subscriptions").get()
      .then((snapshot) => {
        snapshot.docs.forEach(doc => {
          if (doc.data().userId == uid && doc.data().releaseDate == date) {
            if (!doc.data().isSent) {
              subscription.push(doc.data());
              doc.ref.update({ isSent: true })
            }
          }
        })
      })
    if (subscription.length > 0 && !isSent) {
      subscription.map((item) => this.sendEmail(email, item.title))
      this.setState({ isSent: true })
    }
    const indexOfLastGame = this.state.currentGameSlide * this.state.itemPerSlide
    const indexOfFirstGame = parseInt(indexOfLastGame) - this.state.itemPerSlide
    const indexOfLastMovie = this.state.currentMovieSlide * this.state.itemPerSlide
    const indexOfFirstMovie = parseInt(indexOfLastMovie) - this.state.itemPerSlide
    const indexOfLastNews = this.state.currentNewsSlide * this.state.itemPerSlide
    const indexOfFirstNews = parseInt(indexOfLastNews) - this.state.itemPerSlide
    const movie = movies.results && movies.results.slice(indexOfFirstMovie, indexOfLastMovie).map((item) =>
      <div className="home-carousel-item" key={item.id}>
        <Link className="link-to-detail-page" to={`/MovieDetail/${item.id}`}>
          <Image
            src={THE_MOVIE_DB.folder + item.poster_path}
            className="home-carousel-item-image"
          />
        </Link>
      </div>
    )
    const game = games.results && games.results.slice(indexOfFirstGame, indexOfLastGame).map((item) =>
      <div className="home-carousel-item" key={item.guid}>
        <Link className="link-to-detail-page" to={`/GameDetail/${item.guid}`}>
          <Image
            src={item.image.medium_url}
            className="home-carousel-item-image"
          />
        </Link>
      </div>
    )
    const newsSection = news.slice(indexOfFirstNews, indexOfLastNews).map((item) =>
      <Card className="card-news">
        <Link className="link-to-detail-page" to={`/NewsDetail/${item.title.replace(/ /g, '-')}`} className="details" style={{ color: 'black' }}>
          <Image src={item.imageDownloadURL} style={{ display: 'block', margin: '0 auto', width: '100%', maxHeight: '500px' }} />
        </Link>
        <h2 style={{ width: '100%', height: '100%', display: 'block', color: '#7DA2A9', backgroundColor: '#242424', margin: '0 auto', paddingTop: '20px' }}>{item.title}</h2>
      </Card>);
    const newsSlideNumber = [];
    for (let i = 1; i <= Math.ceil(news.length / 1); i++) {
      newsSlideNumber.push(i);
    }
    const gameSlideNumber = [];
    for (let i = 1; i <= Math.ceil(games.results && games.results.length / this.state.itemPerSlide / 4); i++) {
      gameSlideNumber.push(i);
    }
    const movieSlideNumber = [];
    for (let i = 1; i <= Math.ceil(movies.results && movies.results.length / this.state.itemPerSlide); i++) {
      movieSlideNumber.push(i);
    }
    return (
      <CustomHeaderMenu
        activeSearchBar={false}
        isMainPage={false}
        childrenRender={(
          <Fragment>

            {/* <Header as='h3'>
            <Label as="div" style={{ backgroundColor: '#7DA2A9', color: '#242424', fontSize: '1.2rem' }} ribbon>
              <Icon name="newspaper" />
              News
            </Label>
            <div style={{ float: 'right' }}>
              <Link to="/NewsPage">See more...</Link>
            </div>
          </Header>
          <div style={styles.clear}></div> */}
            <Container className="homenews" textAlign='center' style={{ width: '100%', height: '500px', margin: 0, padding: 0 }}>
              {newsSection}
            </Container>
            <div style={styles.clear}></div>
            {/* <Container textAlign='center' style={{ width: '100%' }}>
            <Button.Group>
              {newsSlideNumber.map((slide) => (
                <Button id={slide} style={{ backgroundColor: 'transparent', color: '#242424' }} icon='circle' onClick={this.handleNewsSlideChange.bind(this)}></Button>
              ))}
            </Button.Group>
          </Container> */}
            <Segment className="segment-home-page">
              <Header as='h3'>
                <Label as="div" style={{ backgroundColor: '#7DA2A9', color: '#242424', fontSize: '1.2rem' }} ribbon>
                  <Icon name="film" />
                  Upcoming Movies
            </Label>
                <div style={{ float: 'right' }}>
                  <Link to="/MovieUpcoming">See more...</Link>
                </div>
              </Header>
              <div style={styles.clear}></div>
              <Container textAlign='center' style={{ width: '100%' }}>
                {movie}
              </Container>
              <div style={styles.clear}></div>
              <Container textAlign='center' style={{ width: '100%' }}>
                <Button.Group>
                  {movieSlideNumber.map((slide) => (
                    <Button id={slide} style={{ backgroundColor: 'transparent', color: '#242424' }} icon='circle' onClick={this.handleMovieSlideChange.bind(this)}></Button>
                  ))}
                </Button.Group>
              </Container>
              <Divider section />
              <Header as='h3'>
                <Label as="div" style={{ backgroundColor: '#7DA2A9', color: '#242424', fontSize: '1.2rem' }} ribbon>
                  <Icon name="game" />
                  Upcoming Games
            </Label>
                <div style={{ float: 'right' }}>
                  <Link to="/GameUpcoming">See more...</Link>
                </div>
              </Header>
              <div style={styles.clear}></div>
              <Container textAlign='center' style={{ width: '100%' }}>
                {game}
              </Container>
              <div style={styles.clear}></div>
              <Container textAlign='center' style={{ width: '100%' }}>
                <Button.Group>
                  {gameSlideNumber.map((gameSlide) => (
                    <Button id={gameSlide} style={{ backgroundColor: 'transparent', color: '#242424' }} icon='circle' onClick={this.handleGameSlideChange.bind(this)}></Button>
                  ))}
                </Button.Group>
              </Container>
            </Segment>
          </Fragment>)}
      />
    )
  }
} let styles = {
  clear: {
    clear: 'both'
  }
}
function mapStateToProps(centralState) {
  return {
    movies: centralState.movies,
  }
}
export default connect(mapStateToProps)(HomePage)