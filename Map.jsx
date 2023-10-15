import React from 'react'
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react'
import CustomHeaderMenu from './src/components/CustomHeaderMenu'

const mapStyle = {
  width: '80%',
  height: '500px',
  margin: '0 auto',
}
class MapPage extends React.Component {
  constructor() {
    super()
    this.state = {
      latitude: 0,
      longitude: 0,
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      results: []
    }
  }
  search() {
    fetch('https://cors-anywhere.herokuapp.com/' + `https://maps.googleapis.com/maps/api/place/textsearch/json?query=movie&type=movie_theater&location=${this.state.latitude},${this.state.longitude}&radius=10000&key=AIzaSyANyk06iuUKh8sEPn4EKMkX4jE1ylboXYs`)
      .then(res => res.json())
      .then(res => res.results.map((item) => {
        if (item.name.toLowerCase().includes("cgv"))
          if (item.business_status == "OPERATIONAL") {
            this.state.results.push(item)
          }
      }))
  }

  onMarkerClick(props, marker, e) {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    })
  }
  onClose() {
    this.setState({
      showingInfoWindow: false,
      activeMarker: null
    })
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => this.setState({ latitude: position.coords.latitude, longitude: position.coords.longitude })
    )

  }

  render() {
    const { latitude, longitude, results } = this.state
    this.search()
    console.log(results)
    return (
      <CustomHeaderMenu
        activeBreadcumb={false}
        activeSearchBar={false}
        childrenRender={
          <div className="map-body">
            <h3 
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'center',
                color: '#71B9B5',
                fontSize: '2rem',
                marginBottom: 30,
              }}
            >
              Movie theaters nearby
            </h3>
            <Map
              google={this.props.google}
              zoom={15}
              style={mapStyle}
              initialCenter={{
                lat: latitude,
                lng: longitude
              }}
              center={{
                lat: latitude,
                lng: longitude
              }}
            >
              {results.map((item) =>
                <Marker
                  name={"Theaters"}
                  position={{ lat: item.geometry.location.lat, lng: item.geometry.location.lng }}

                />
              )}
              <Marker
                onClick={this.onMarkerClick.bind(this)}
                name={"Current location"}
                position={{ lat: latitude, lng: longitude }}
              />
              <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
              >
                <div>
                  <h4>{this.state.selectedPlace.name}</h4>
                </div>
              </InfoWindow>

            </Map>
          </div>
        }
      />
    )
  }
}
export default GoogleApiWrapper({
  apiKey: 'AIzaSyANyk06iuUKh8sEPn4EKMkX4jE1ylboXYs'
})(MapPage)