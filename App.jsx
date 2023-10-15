import React from 'react'
import { connect } from 'react-redux'
import GamePage from './GamePage.jsx'
import Authentication from './Authentication.jsx'
import MoviePage from './MoviePage.jsx'
import UserProvider from "./src/UserProvider.jsx"
import HomePage from "./HomePage.jsx"
import AdminPost from "./AdminPost.jsx"
import MovieDetailPage from "./MovieDetailPage.jsx"
import GameDetailPage from "./GameDetail.jsx"
import SubMovieDetailPage from "./SubMovieDetailPage.jsx"
import { BrowserRouter as Router, Switch, Link, Route } from 'react-router-dom'
import NewsPage from './NewsPage.jsx'
import NewsDetail from './NewsDetail.jsx'
import SubscriptionsList from './SubscriptionsList.jsx';
import MapPage from './Map.jsx'
class App extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/Authentication">
            <Authentication />
          </Route>
          <Route exact path="/AdminPost">
            <AdminPost />
          </Route>
          <Route exact path="/NewsPage">
            <NewsPage />
          </Route>
          <Route exact path="/">
             <HomePage games={this.props.games} dispatch={this.props.dispatch} />
          </Route>
          <Route exact path="/GameUpcoming">
            <GamePage games={this.props.games} dispatch={this.props.dispatch} />
          </Route>
          <Route exact path="/MovieUpcoming">
            <MoviePage />
          </Route>
          <Route exact path="/MovieDetail/:id">
            <MovieDetailPage />
          </Route>
          <Route exact path="/GameDetail/:id">
            <GameDetailPage />
          </Route>
          <Route exact path="/SubscribeDetail/:id">
            <SubMovieDetailPage />
          </Route>
          <Route exact path="/NewsDetail/:title">
            <NewsDetail />
          </Route>
          <Route exact path="/Subscriptions">
            <SubscriptionsList />
          </Route>
          <Route exact path="/Map">
            <MapPage />
          </Route>
        </Switch>
      </Router>
    )
  }
}
function mapStateToProps(centralState) {
  return {
    games: centralState.games
  }
}
export default connect(mapStateToProps)(App)
