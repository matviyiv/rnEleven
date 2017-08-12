import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './whywe.css';
import FloatingButton from '../../components/FloatingButton';
import { connect } from 'react-redux';

export class Whywe extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }
  render() {
    const {str} = this.props;
    return (<div>
        <FloatingButton showBookingButton history={this.props.history}/>
         <section  className="">
          <article role="whywe" className="whywe-pan">
            <header className="page-title">
              <h2>{str.title}</h2>
            </header>
             <ul role="services">
                <li> <i className="fa fa-diamond" aria-hidden="true"></i>
                  <h6>{str.style_heading}</h6>
                  <p dangerouslySetInnerHTML={{__html: str.style_body}}></p>
                </li>
                <li> <i className="fa fa-coffee" aria-hidden="true"></i>
                  <h6>{str.cosy_heading}</h6>
                  <p dangerouslySetInnerHTML={{__html: str.cosy_body}}></p>
                </li>
                <li> <i className="fa fa-heart" aria-hidden="true"></i>
                  <h6>{str.emoji_heading}</h6>
                  <p dangerouslySetInnerHTML={{__html: str.emoji_body}}></p>
                </li>
              </ul>
             </article>
      </section>
    </div>);
  }
}

function mapStateToProps(state) {
  return { str: state.str.currentLocalization.whywe };
}

export default connect(mapStateToProps)(Whywe);