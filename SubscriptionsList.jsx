import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// Import react semantic ui css
import 'semantic-ui-css/semantic.min.css';
import { Image, Button } from 'semantic-ui-react';
import CustomTable from './src/components/CustomTable/index';
import CustomGrid from './src/components/CustomGrid/index';

import { get } from 'lodash';
import { THE_MOVIE_DB } from './constants';
import './styles.css';
import CustomHeaderMenu from './src/components/CustomHeaderMenu/index';
import { getSubScriptionByUID, auth, removeSubscriptionByDocId } from './src/firebase';
import CustomList from './src/components/CustomList';

const SubscriptionsList = (props) => {
  const uid = get(auth, 'currentUser.uid');
  const [isReload, setReload] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    getSubScriptionByUID(uid, handleSetListSubscriptions);
  }, [uid]);

  useEffect(() => {
    getSubScriptionByUID(uid, handleSetListSubscriptions);
  }, [isReload])

  const handleSetListSubscriptions = (data) => setSubscriptions(data);

  const handleReloadPage = () => setReload(!isReload);

  const handleUnsubscribe = (id, setSelectedItem) => {
    if (removeSubscriptionByDocId) {
      removeSubscriptionByDocId(id, handleReloadPage, setSelectedItem);
    }
  }

  return (
    <CustomHeaderMenu
      activeBreadcumb
      activeSearchBar={false}
      // handleSearchText={(searchText) => this.setState({ textSearch: searchText })}
      // handleSwitchView={(checkList) => this.setState({ isList: checkList })}
      childrenRender={(<div id="app-body">
        <CustomList
          handleUnsubscribe={handleUnsubscribe}
          listData={subscriptions}
        />
      </div>)}
    />
  );
};

// class SubscriptionsList extends React.Component {
//   constructor(props) {
//     super(props);
//     this.props = props;
//     this.state = {
//       subscriptionsList: [],
//       textSearch: null,
//       isList: true,
//     }
//   }

//   componentWillMount() {
//     getSubScriptionByUID(this.handleSetListSubscriptions.bind());
//   }

//   componentDidMount() {
//     // this.loadMovies();
//   }

//   handleSetListSubscriptions(data) {
//     console.log('data: ', data);
//     this.setState({ subscriptionsList: data })
//   }


//   loadMovies(page) {
//     const { dispatch } = this.props;
//     fetch(`${THE_MOVIE_DB.urlUpcoming}?api_key=${THE_MOVIE_DB.apiKey}&language=en-US&page=${page || 1}`)
//       .then(function (res) {
//         return res.json()
//       })
//       .then((payload) => {
//         dispatch({ type: 'FETCH_MOVIES', payload })
//       })
//       .then(function (subscriptionsList) {
//         this.setState({ subscriptionsList })
//       }.bind(this))
//       .catch((_error) => { });
//   }

//   formatMoviesDataGrid(listMovies = []) {
//     return listMovies.map((item) => ({
//       id: get(item, 'id'),
//       image: get(item, 'poster_path') ? `${THE_MOVIE_DB.folder}${get(item, 'poster_path')}` : THE_MOVIE_DB.noImage,
//       title: get(item, 'original_title'),
//       releaseDate: get(item, 'release_date'),
//       overview: get(item, 'overview'),
//       score: get(item, 'vote_average'),
//     }));
//   }

//   columnsMovies() {
//     return [
//       {
//         key: 'poster_path',
//         name: 'Image',
//         formatter: (rowValue) => <Image src={get(rowValue, 'poster_path') ? `${THE_MOVIE_DB.folder}${get(rowValue, 'poster_path')}` : THE_MOVIE_DB.noImage} width="100px" height="100px" />,
//         sortable: false,
//       },
//       {
//         key: 'original_title',
//         name: 'Title',
//         sortable: true,
//       },
//       {
//         key: 'release_date',
//         name: 'Release Date',
//         sortable: true,
//       },
//       {
//         key: 'overview',
//         name: 'Description',
//         sortable: true,
//         // formatter: (rowValue) => <div style={{ whiteSpace: 'pre-wrap' }}>{get(rowValue, 'overview') || ''}</div>,
//       },
//     ];
//   }

//   onPaginator(activePage) {
//     this.loadMovies(activePage);
//   }

//   render() {
//     const { isList, textSearch } = this.state;
//     const { subscriptionsList } = this.props;
//     console.log('subscriptionsList: ', subscriptionsList);
//     return (
//       <CustomHeaderMenu
//         handleSearchText={(searchText) => this.setState({ textSearch: searchText })}
//         handleSwitchView={(checkList) => this.setState({ isList: checkList })}
//         childrenRender={(<div id="app-body">

//         </div>)}
//       />
//     )
//   }
// }

function mapStateToProps(centralState) {
  return {
    subscriptionsList: centralState.subscriptionsList,
  }
}
export default connect(mapStateToProps)(SubscriptionsList)