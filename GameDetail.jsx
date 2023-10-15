/**
 * Export Detail Page
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { last, get } from 'lodash';
import { Grid, Button } from 'semantic-ui-react';
import CustomHeaderMenu from './src/components/CustomHeaderMenu';
import { subscribed, auth, getSubscriptionStatusByIDandUID, removeSubscriptionByDocId } from './src/firebase';
import './gameDetail.css';
import useReactRouter from 'use-react-router'

const GameDetailPage = (props) => {
  const { pathname } = window && window.location;
  const [idDetail] = useState(last(pathname.split('/')));
  const [gameDetail, setGameDetail] = useState({});
  const [isSubscibed, setSubscribed] = useState(false);
  const [docId, setDocId] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const { history } = useReactRouter();
  const uid = get(auth, 'currentUser.uid');
  /**
  * Get Detail page
  */
  useEffect(() => {
    fetch('https://cors-anywhere.herokuapp.com/' + `https://www.giantbomb.com/api/game/${idDetail}/?api_key=64c47efd809a2e99bf25f2aa81f185443cb66de2&format=json`)
      .then(function (res) { return res.json() })
      .then((res) => {
        setGameDetail(res);
        getSubscriptionStatusByIDandUID(idDetail, uid, setSubscribed, setLoading, setDocId);
      })
      .catch((_err) => {
        setLoading(false);
      });
  }, [idDetail]);

  const handleSubscribe = () => {
    if (isSubscibed) {
      console.log('docId: ', docId);
      removeSubscriptionByDocId(docId, null, setSubscribed);
    } else {
      subscribed('game', detailGame, setSubscribed);
    }
  }

  const title = gameDetail.results && gameDetail.results.name;
  const releaseDay = gameDetail.results && gameDetail.results.expected_release_day;
  const releaseMonth = gameDetail.results && gameDetail.results.expected_release_month;
  const releaseYear = gameDetail.results && gameDetail.results.expected_release_year;
  const overview = gameDetail.results && gameDetail.results.deck;
  const image1 = gameDetail.results && gameDetail.results.image.medium_url;
  const image2 = gameDetail.results && gameDetail.results.image.icon_url;
  var genres = null;
  var platforms = null;
  if (gameDetail.results && gameDetail.results.genres === undefined || gameDetail.results && gameDetail.results.genres === null) {
    genres = null
  } else {
    genres = gameDetail.results && gameDetail.results.genres.map((item) => <p class="type"> {item.name} </p>);
  }
  if (gameDetail.results && gameDetail.results.platforms === undefined || gameDetail.results && gameDetail.results.platforms === null) {
    platforms = null
  } else {
    platforms = gameDetail.results && gameDetail.results.platforms.map((item) => <p class="type"> {item.name} </p>)
  }
  const arrayGernes = gameDetail && gameDetail.results && gameDetail.results.genres;
  const arrayPlatforms = gameDetail && gameDetail.results && gameDetail.results.platforms;
  const detailGame = {
    itemId: idDetail,
    title,
    releaseDate: `${releaseYear}-${releaseMonth}-${releaseDay}`,
    overview,
    imagePoster: image1,
    imagePoster1: image2,
    userId: uid,
    genres: Array.isArray(arrayGernes) ? arrayGernes.map((item) => item && item.name).join(', ') : '',
    platforms: Array.isArray(arrayPlatforms) ? arrayPlatforms.map((item) => item && item.name).join(', ') : '',
    isSent: false
  };

  return (
    <CustomHeaderMenu
      activeSearchBar={false}
      activeBreadcumb
      childrenRender={(<div id="app-body">
        <Grid className="detail-content">
          <Grid.Column width={16}>
            <div class="game_card" id="bright">
              <div class="info_section">
                <div class="game_header">
                  <img class="locandina" src={image1} />
                  <h1>{title}</h1>
                  <h4>{releaseYear}-{releaseMonth}-{releaseDay}</h4>
                  {genres}
                  <p>{platforms}</p>
                </div>
                <div class="game_desc">
                  <p class="text">
                    {overview}
                  </p>
                  <Button
                    color='red'
                    content={!isSubscibed ? 'Subscribe' : 'Unsubscribe'}
                    icon={!isSubscibed ? 'heart' : 'bell slash'}
                    loading={isLoading}
                    disabled={!uid || uid === ''}
                    onClick={handleSubscribe}
                  />
                </div>
              </div>
              <div class="blur_back" style={{ background: `url(${image2})`, backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}></div>
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
function mapStateToProps(centralState) {
  return {
    games: centralState.games,
  }
}
export default connect(mapStateToProps)(GameDetailPage)
