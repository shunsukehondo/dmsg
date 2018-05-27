import React from 'react'
import PropTypes from 'prop-types'

import './ChatInput.styl'

export default class ChatInput extends React.Component {
  render() {
      const userImgURL = "//robohash.org/" + "0x777" + "?set=set2&bgset=bg2&size=70x70"
      const friendImgURL = "//robohash.org/" + "0xFFF" + "?set=set2&bgset=bg2&size=70x70"

      return (
        <footer className="teal">
          <form className="container">
            <div className="row">
              <div className="input-field col s10">
                <i className="prefix material-icons">chat</i>
                <input ref="txtMessage" type="text" placeholder="Type your message" />
                <span className="chip left">
                  <img src={ userImgURL } />
                  <span>You: 0x777 </span>
                </span>
                <span className="chip left">
                  <img src={ friendImgURL } />
                  <span>Friend: 0xFFF </span>
                </span>
              </div>
              <div className="input-field col s2">
                <button type="submit" className="waves-effect waves-light btn-floating btn-large">
                  <i className="material-icons">send</i>
                </button>
              </div>
            </div>
          </form>
        </footer>
      )
  }
}

