import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './services.css';
import FloatingButton from '../../components/FloatingButton';

export class Services extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }
  render() {
    const {str} = this.props;

    return (<div>
      <FloatingButton showBookingButton history={this.props.history}/>
      <section  className="services">
        <article role="services" className="services-pan">
          <header className="page-title">
            <h2>{str.title}</h2>
          </header>
          <ul role="services">
            <li onClick={this.selectService('s1')}> <i className="fa fa-scissors" aria-hidden="true"></i>
              <h6>{str.hair_heading}</h6>
              <p dangerouslySetInnerHTML={{__html: str.hair_body}}></p>
            </li>
            <li onClick={this.selectService('s2')}> <i className="fa fa-diamond" aria-hidden="true"></i>
              <h6>{str.makeup_heading}</h6>
              <p dangerouslySetInnerHTML={{__html: str.makeup_body}}></p>
            </li>
            <li onClick={this.selectService('s3')}> <i className="fa fa-hand-peace-o" aria-hidden="true"></i>
              <h6>{str.nail_heading}</h6>
              <p dangerouslySetInnerHTML={{__html: str.nail_body}}></p>
            </li>
            <li onClick={this.openContacts}> <i className="fa fa-gift" aria-hidden="true"></i>
              <h6>{str.certificate_heading}</h6>
              <p dangerouslySetInnerHTML={{__html: str.certificate_body}}></p>
            </li>
          </ul>
        </article>
      </section>
    </div>);
  }

  selectService = (serviceId) => () => {
    this.props.history.push('/booking/step2/' + serviceId);
  }

  openContacts = () => {
    this.props.history.push('/contacts');
  }
}

function mapStateToProps(state) {
  return { str: state.str.currentLocalization.services };
}

export default connect(mapStateToProps)(Services);
