import React, { Component } from 'react';
import './booking.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actionCreators from '../../flux/actions';

export class Finish extends Component {
  render() {
    const {str} = this.props;

    return (<section className="container">
      <article className="booking-success">
        <header className="page-title">
          <h2>{str.title}</h2>
        </header>
        <div className="booking-success--message">
        {str.body}
        <br/>
        <Link to="/" className="booking-success--link">{str.main_page}</Link>
        </div>
      </article>
    </section>);
  }
}

function mapStateToProps(state) {
  return { app: state.app, str: state.str.currentLocalization.finish };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Finish);