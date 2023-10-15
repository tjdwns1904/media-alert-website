/**
 * Export Detail Page
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { last, get } from 'lodash';
import RImage from './src/images/R.svg.png';
import { Grid, Button } from 'semantic-ui-react';
import CustomHeaderMenu from './src/components/CustomHeaderMenu';
import { auth, firestore } from './src/firebase';
import "./moviedetail.css"
import useReactRouter from 'use-react-router'

const SubMovieDetailPage = (props) => {
  const { pathname } = window && window.location;
  const [idDetail] = useState(last(pathname.split('/')));
  const movieDetail = [];
  const [subMovieDetail, setSubMovieDetail] = useState({});
  const { history } = useReactRouter();
  const uid = get(auth, 'currentUser.uid');
  /**
  * Get Detail page
  */
  useEffect(() => {
    firestore.collection("subscriptions").get()
      .then((snapshot) => {
        snapshot.docs.forEach(doc => {
          movieDetail.push(doc.data());
        })
        setSubMovieDetail(movieDetail.filter(item => uid == item.userId && idDetail == item.itemId))
      }
      )
      .catch((err) => console.log('err: ', err));
  }, [idDetail]);
  console.log(subMovieDetail)
  const title = subMovieDetail[0] && subMovieDetail[0].title
  const isAldult = subMovieDetail[0] && subMovieDetail[0].isAldult
  const releaseDate = subMovieDetail[0] && subMovieDetail[0].releaseDate
  const voteAverage = subMovieDetail[0] && subMovieDetail[0].voteAverage
  const genres = subMovieDetail[0] && subMovieDetail[0].genres
  const overview = subMovieDetail[0] && subMovieDetail[0].overview
  const image = subMovieDetail[0] && subMovieDetail[0].imagePoster
  console.log(title)
  return (
    <CustomHeaderMenu
      activeSearchBar={false}
      activeBreadcumb={true}
      childrenRender={(
        <div id="app-body">
          <Grid className="detail-content">
            <Grid.Column width={16}>
              <div class="movie_card" id="bright">
                <div class="info_section">
                  <div class="movie_header">
                    <img class="locandina" src={image} />
                    <h1>{title} {isAldult && <Image size="mini" src={RImage} />}</h1>
                    <h4>{releaseDate} <span class="minutes">{voteAverage}</span></h4>
                    <p class="type">{genres}</p>
                  </div>
                  <div class="movie_desc">
                    <p class="text">
                      {overview}
                    </p>
                    <Button
                      color='red'
                      content='Unsubscribe'
                      icon='bell slash'
                    />
                  </div>
                </div>
                <div class="blur_back" style={{ background: `url(${image})`, backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}></div>
              </div>
            </Grid.Column>
          </Grid>
          <Button
            color='black'
            content='Back'
            icon='angle left'
            onClick={() => history.goBack()}
          />
        </div>)} />
  );
};
function mapStateToProps(centralState) {
  return {
    movies: centralState.movies,
  }
}
export default connect(mapStateToProps)(SubMovieDetailPage)
