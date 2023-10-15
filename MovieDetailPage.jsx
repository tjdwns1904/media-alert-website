/**
 * Export Detail Page
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { last } from 'lodash';
import { PropTypes } from 'prop-types';
import { get } from 'lodash';
import { Grid, Image, Button } from 'semantic-ui-react';
import { THE_MOVIE_DB } from './constants';
import CustomHeaderMenu from './src/components/CustomHeaderMenu';
import RImage from './src/images/R.svg.png';
import './moviedetail.css';
import { subscribed, auth, getSubscriptionStatusByIDandUID, removeSubscriptionByDocId } from './src/firebase';
import useReactRouter from 'use-react-router'

const formatDataDetail = (data, userId) => {
  const arrayGenres = get(data, 'genres') || [];
  const genres = arrayGenres.map((item) => get(item, 'name')).join(', ');
  console.log('data: ', data);
  return {
    itemId: `${get(data, 'id')}`,
    imagePoster: get(data, 'poster_path') ? `${THE_MOVIE_DB.folder}${get(data, 'poster_path')}` : THE_MOVIE_DB.noImage,
    title: get(data, 'title') || get(data, 'original_title'),
    isAldult: get(data, 'adult'),
    voteAverage: get(data, 'vote_average'),
    overview: get(data, 'overview'),
    releaseDate: get(data, 'release_date'),
    tagline: get(data, 'tagline'),
    userId,
    genres,
    isSent: false
  };
};

const MovieDetailPage = (props) => {
  const { pathname } = window && window.location;
  const [idDetail] = useState(last(pathname.split('/')));
  const [movieDetail, setMovieDetail] = useState({});
  const [isSubscibed, setSubscribed] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [docId, setDocId] = useState(null);
  const { history } = useReactRouter();
  const uid = get(auth, 'currentUser.uid');
  /**
   * Get Detail page
   */
  useEffect(() => {
    fetch(`${THE_MOVIE_DB.urlMovie}${idDetail}?api_key=${THE_MOVIE_DB.apiKey}&language=en-US`)
      .then(function (res) {
        return res.json()
      }).then((res) => {
        setMovieDetail(formatDataDetail(res, uid));
        getSubscriptionStatusByIDandUID(idDetail, uid, setSubscribed, setLoading, setDocId);
      }).catch((_err) => {
        setLoading(false);
      });
  }, [idDetail]);

  const handleSubscribe = () => {
    if (isSubscibed) {
      removeSubscriptionByDocId(docId, null, setSubscribed);
    } else {
      subscribed('movie', movieDetail, setSubscribed)
    }
  }

  return (
    <CustomHeaderMenu
      activeSearchBar={false}
      activeBreadcumb
      childrenRender={(<div id="app-body">
        <Grid className="detail-content">
          {/* <Grid.Column width={4}>
            <Image style={{ height: '100%' }} src={movieDetail && movieDetail.imagePoster} />
          </Grid.Column> */}
          <Grid.Column width={16}>
            <div class="movie_card" id="bright">
              <div class="info_section">
                <div class="movie_header">
                  <img class="locandina" src={movieDetail && movieDetail.imagePoster} />
                  <h1>{movieDetail && movieDetail.title} {movieDetail && movieDetail.isAldult && <Image size="mini" src={RImage} />}</h1>
                  <h4>{movieDetail && movieDetail.releaseDate} <span class="minutes">{movieDetail && movieDetail.voteAverage}</span></h4>
                  <p class="type">{movieDetail && movieDetail.genres}</p>
                </div>
                <div class="movie_desc">
                  <p class="text">
                    {movieDetail && movieDetail.overview}
                  </p>
                  <Button
                    color='red'
                    content={!isSubscibed ? 'Subscribe' : 'Unsubscribe'}
                    icon={!isSubscibed ? 'heart' : 'bell slash'}
                    loading={isLoading}
                    disabled={!uid || uid === ''}
                    onClick={() => handleSubscribe()}
                  />
                </div>
              </div>
              <div class="blur_back" style={{ background: `url(${movieDetail && movieDetail.imagePoster})`, backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}></div>
            </div>
          </Grid.Column>
        </Grid>
        <Button
          color='black'
          content='Back'
          icon='angle left'
          onClick ={()=>history.goBack()}
        />
      </div>)}
    />
  );
};

MovieDetailPage.propTypes = {

}


function mapStateToProps(centralState) {
  return {
    movies: centralState.movies,
  }
}
export default connect(mapStateToProps)(MovieDetailPage)
