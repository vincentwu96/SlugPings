import React, { Component } from 'react';

import "../styles/Chat.css";

class Chat extends Component {
  constructor(props) {
    super(props);

    this._onClose = this._onClose.bind(this);
    this._getEvents = this._getEvents.bind(this);
  }

  componentsDidMount() {
  }

  _onClose(e) {
    e.stopPropagation();
    const { hideChat } = this.props;
    hideChat();
  }

  _getEvents() {

    // let events = markers.map((marker, index) => {
    //   return (
    //     <div className="event" key={`${marker.title}-${index}`}>
    //       <span>
    //         {marker.startTime} - {marker.endTime} {marker.title} @ {marker.loc}
    //         <i className="fas fa-ellipsis-v fa-1x" />
    //       </span>
    //     </div>
    //   )
    // });
    // return events;
  }

  render() {
    const { chat } = this.props;
    const { isChatOpen } = chat;

    return !isChatOpen ? null : (
      <div className="chat">
        <div className="chat-content">
          <span
            className="chat-close"
            onClick={this._onClose}
          >
            &times;
          </span>
          <div className="chat-header">
            <span>Chat</span>
          </div>
          <div className="chat-body">
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;