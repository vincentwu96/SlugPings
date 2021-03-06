import React, { Component } from 'react';

import "../styles/Listings.css";

import ListingInfo from "../components/ListingInfo";

class Listings extends Component {
  constructor(props) {
    super(props);

    this._onClose = this._onClose.bind(this);
    this._getHome = this._getHome.bind(this);
    this._getListingInfo = this._getListingInfo.bind(this);
    this._getEvents = this._getEvents.bind(this);
  }

  componentsDidMount() {
  }

  _onClose(e) {
    e.stopPropagation();
    const { hideListings } = this.props;
    hideListings();
  }

  _getHome() {
    return (
      <div className="listings-content">
        <span
          className="listings-close"
          onClick={this._onClose}
        >
          &times;
          </span>
        <div className="listings-header">
          <span>Listings</span>
        </div>
        <div className="listings-body">
          {this._getEvents()}
        </div>
      </div>
    )
  }

  _getListingInfo() {
    const { map, database, listings, showListingInfo, hideListingInfo } = this.props;
    let markers = [...map.markers, ...database.markers];
    
    let info = null;
    for (let marker of markers) {
      if (marker.id === listings.listingInfoID)
        info = marker;
    }
    return (
      <ListingInfo 
      info={info} 
      listings={listings} 
      showListingInfo={showListingInfo} 
      hideListingInfo={hideListingInfo}
      />
    )
  }

  _getEvents() {
    const { map, database, showListingInfo, setListingInfoID } = this.props;
    let markers = [...map.markers, ...database.markers];

    let events = markers.map((marker, index) => {
      let openListingInfo = () => {
        setListingInfoID(marker.id);
        showListingInfo();
      }
      return (
        <div className="event" key={`${marker.id}`} onClick={openListingInfo}>
          <span>
            {marker.startTime} - {marker.endTime} {marker.title} @ {marker.loc}
            <i className="fas fa-ellipsis-v fa-1x" />
          </span>
        </div>
      )
    });
    return events;
  }

  render() {
    const { listings } = this.props;
    const { isListingsOpen, isListingInfoOpen } = listings;

    return !isListingsOpen ? null : (
      <div
        id="myListings"
        className="listings"
      >
        {isListingInfoOpen ? this._getListingInfo() : this._getHome()}
      </div>
    );
  }
}

export default Listings;