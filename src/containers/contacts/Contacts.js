import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import './contacts.css';
import FloatingButton from '../../components/FloatingButton';
import * as actionCreators from '../../flux/actions';

export class Contacts extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  state = {
    subscribeEmail: ''
  }

  render() {
    const {app:{subscription}, str} = this.props;
    return (<div>
      <FloatingButton showBookingButton history={this.props.history}/>
          <article role="contact" className="contact-pan">
            <header className="page-title">
              <h2>{str.title}</h2>
            </header>
            <div className ="box">
            <div className="ntify_form">
            <div className="contact--content">
            {subscription.success ? str.submit_success : this.renderForm()}
            </div>
              <br/>
              <h3 className="contact__company-mail"><a href="mailto:Contact@eleven.lviv.ua" className="contact__email-link">info@eleven.lviv.ua </a></h3>
          <ul className="contact__list">
            <li><i className="fa fa-map-marker" aria-hidden="true"></i> <a href="https://goo.gl/maps/uhZfiKZjZWp">{str.address}</a></li>
            <li><i className="fa fa-phone" aria-hidden="true"></i> <a href="tel:0975271332">(097) 52 71 332</a></li>
            <li><i className="fa fa-phone" aria-hidden="true"></i> <a href="tel:0730094421">(073) 00 94 421</a></li>
          </ul>
             </div>
          </div>
        </article>
      </div>);
  }

  renderForm() {
    const {str} = this.props;
    return (<form  className="contact__form" onSubmit={this.submit} name="subscribeform" id="subscribeform">
      <input
        className="contact__email-input"
        name="email"
        type="email"
        id="subemail"
        placeholder={str.placeholder}
        onChange={this.onEmailChange}
      />
      <label>
        <input name="" type="submit" className="button-icon" />
        <i className="fa fa-paper-plane" aria-hidden="true" onClick={this.submit}></i>
      </label>
      <p>{str.subscribe}</p> 
    </form>);
  }

  onEmailChange = (e) => this.setState({subscribeEmail: e.target.value})

  submit = (e) => {
    e.preventDefault();
    this.props.actions.subscribe(this.state.subscribeEmail);
  }
}


function mapStateToProps(state) {
  return { app: state.app, str: state.str.currentLocalization.contacts };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);