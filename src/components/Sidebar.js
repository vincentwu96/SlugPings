import React, { Component } from 'react';

import "../styles/Sidebar.css";

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this._onHide = this._onHide.bind(this);
    this._onShow = this._onShow.bind(this);
    this._onListings = this._onListings.bind(this);
    this._onChat = this._onChat.bind(this);
    this._onLogin = this._onLogin.bind(this);
    this._onSignup = this._onSignup.bind(this);
  }

  _onHide() {
    const { hideSidebar } = this.props;
    hideSidebar();
  }

  _onShow() {
    const { showSidebar } = this.props;
    showSidebar();
  }

  _onListings(e) {
    e.stopPropagation();
    const { showListings } = this.props;
    showListings();
  }

  _onChat(e) {
    e.stopPropagation();
    const { showChat } = this.props;
    showChat();
  }

  _onLogin(e) {
    e.stopPropagation();
    const { showLogin } = this.props;
    showLogin();
  }

  _onSignup(e) {
    e.stopPropagation();
    const { showSignup } = this.props;
    showSignup();
  }

  render() {
    const { sidebar } = this.props;
    const { isSidebarOpen } = sidebar;

    return !isSidebarOpen ? (
      <div className="sidebar-min">
        <div
          className="arrow-container"
          onClick={this._onShow}
        >
          <div className="arrow-right" />
        </div>
      </div>
    ) : (
        <div className="sidebar">
          <div className="hide-container">
            <span
              className="hide-btn"
              onClick={this._onHide}
            >
              &times;
            </span >
          </div >
          <div
            className="sb-item"
            onClick={this._onListings}
          >
            <i className="fas fa-file-alt fa-2x"></i>
            <span>Listings</span>
          </div>
          <div
            className="sb-item"
            onClick={this._onChat}
          >
            <i className="fas fa-comments fa-2x"></i>
            <span>Chat</span>
          </div>
          <div className="support">
            <div
              className="sp-item"
              onClick={this._onLogin}
            >
              <span>Login</span>
            </div>
            <div
              className="sp-item"
              onClick={this._onSignup}
            >
              <span>Sign up</span>
            </div>
            <div className="sp-item">
              <a href="https://www.github.com/hueyjj/SlugPings" target="_blank">
                <i className="fas fa-question fa-2x"></i>
                <span>Help</span>
              </a>
            </div>
          </div>
        </div >
      );
  }
}

export default Sidebar;