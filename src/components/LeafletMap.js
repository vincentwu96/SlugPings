import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer, ZoomControl, Tooltip } from 'react-leaflet'

import "../styles/LeafletMap.css";

import MarkerModal from "../components/MarkerModal";
import EditMarkerModal from '../components/EditMarkerModal';
import { isMarkerInDatabase } from "../utils/utils";

class LeafletMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latlng: {
        lat: 36.99694,
        lng: -122.05954,
      }
    }

    this._onClick = this._onClick.bind(this);
    this._onCog = this._onCog.bind(this);
    this._onDelete = this._onDelete.bind(this);
    this._onSync = this._onSync.bind(this);

    // Initialize database markers on start up
    this.props.retrieveDatabaseMarkers();
  }

  _onClick(e) {
    const { showMarkerModal, setLastLoc } = this.props;
    setLastLoc(e.latlng);
    showMarkerModal();
  }

  _onCog(id, dbID = null) {
    const {
      showEditMarkerModal,
      setEditMarkerID,
      setEditDBMarkerID,
    } = this.props;
    setEditMarkerID(id);
    setEditDBMarkerID(dbID);
    showEditMarkerModal();
  }

  _onDelete(id, dbID = null) {
    const {
      removeMarker,
      deleteDatabaseMarker,
      retrieveDatabaseMarkers,
      map,
      database,
    } = this.props;

    let check = () => {
      isMarkerInDatabase(id)
        .then(async (resp) => {
          resp = await resp.json();
          console.log(resp.status);
          if (resp.status === 500) {
            throw Error("No marker in database");
          }
        })
        .then(() => {
          for (let m of map.markers) {
            console.log(m.id + " " + id);
            if (m.id === id) {
              removeMarker(id);
              deleteDatabaseMarker(dbID);
            }
          }
        })
        .catch(error => console.log(error))
    };

    let magic = false;
    for (let m of map.markers) {
      if (m.id === id) {
        magic = true;
      }
    }

    if (magic) {
      check();
    } else {
      alert("Can only delete your own markers");
    }
  }

  _getMarkers() {
    let createMarkers = (m) => {
      return m.map(({ _id, lat, lng, title, loc, startTime, endTime, moreInfo }, index) => {
        let id = `${lat}-${lng}`;
        return (
          <Marker position={{ lat: lat, lng: lng }} key={id}>
            <Popup>
              <div>
                <span>{title}</span>
                <br />
                <span>{loc}</span>
                <br />
                <span>Start: {startTime} End: {endTime}</span>
                <br />
                <span>{moreInfo}</span>
                <br />
                <div
                  className="marker-options cog"
                  onClick={() => { this._onCog(id, _id) }} >
                  <i className="fas fa-cog fa-2x"></i>
                </div>
                <div
                  className="marker-options delete"
                  onClick={() => { this._onDelete(id, _id) }} >
                  <i className="fas fa-minus-circle fa-2x"></i>
                </div>
              </div>
            </Popup>
            <Tooltip>
              <div>
                {title}
              </div>
            </Tooltip>
          </Marker>
        );
      })
    };

    const { map, database } = this.props;
    const markers = map.markers;
    const dbMarkers = database.markers;
    let localMarkers = createMarkers(markers);
    let databaseMarkers = dbMarkers ? createMarkers(dbMarkers) : [];

    return [...localMarkers, ...databaseMarkers];
  }

  _onSync(event) {
    event.preventDefault();
    event.stopPropagation();
    const { retrieveDatabaseMarkers } = this.props;
    retrieveDatabaseMarkers();
  }

  render() {
    const {
      map,
      database,
      hideMarkerModal,
      addMarker,
      hideEditMarkerModal,
      updateMarker,
      retrieveDatabaseMarkers,
    } = this.props;
    const {
      isMarkerModalOpen,
      isEditMarkerModalOpen,
      lastLoc
    } = map;

    return (
      <div className="map-container">
        <MarkerModal
          isMarkerModalOpen={isMarkerModalOpen}
          hideMarkerModal={hideMarkerModal}
          addMarker={addMarker}
          lastLoc={lastLoc}
        />
        <EditMarkerModal
          isEditMarkerModalOpen={isEditMarkerModalOpen}
          hideEditMarkerModal={hideEditMarkerModal}
          updateMarker={updateMarker}
          retrieveDatabaseMarkers={retrieveDatabaseMarkers}
          map={map}
          database={database}
        />
        <div
          id="refreshbtn"
          className="marker-options"
          onClick={this._onSync} >
          <i className="fas fa-sync fa-2x"></i>
        </div>
        <Map
          center={this.state.latlng}
          zoom={16}
          onClick={this._onClick}
          zoomControl={false}
        >
          <ZoomControl position="topright" />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          {this._getMarkers()}
        </Map>
      </div>
    );
  }
}

export default LeafletMap;
