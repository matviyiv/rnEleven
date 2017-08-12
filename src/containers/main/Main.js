import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import './main.css';
import FloatingButton from '../../components/FloatingButton';

export class Main extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }
  render() {
    const {str, history} = this.props;
    return (<div>
      <FloatingButton showBookingButton history={history}/>
         <section  className="">
          <article role="main" className="main-pan">
            <header className="page-title">
              <h2>{str.title}</h2>
            </header>
              <p dangerouslySetInnerHTML={{__html: str.bodyText}}></p>
              <p>
              <Link to="/booking/step1" className="app__link">{str.booknow}</Link>
              </p>
          </article>
      </section>
    </div>);
  }
}

function mapStateToProps(state) {
  return { str: state.str.currentLocalization.main };
}

export default connect(mapStateToProps)(Main);

