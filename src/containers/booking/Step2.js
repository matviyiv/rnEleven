import React, { Component } from 'react';
import './booking.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as actionCreators from '../../flux/actions';
import FloatingButton from '../../components/FloatingButton';

const DISCOUNT = 0.3;
export class Step2 extends Component {
  componentWillMount() {
    const {app: {services}, actions } = this.props;
    !services.list && !services.loading && actions.loadServices();
  }

  render() {
    const {app, match: {params}, str} = this.props;
    const id = params.serviceId;
    
    if (app.services.loading) {return (<div>'Loading ...'</div>);}

    const service = app.services.list.find((s) => s.id === id);
    const content = service ? this.renderSubServices(service.sub) : 'No service found!';
    return (<div>
      <FloatingButton showBackButton history={this.props.history}/>
      <section>
        <article role="sub-step" className="sub-step-pan">
          <header className="page-title">
            <h2>{str.title}</h2>
          </header>
          {content}
        </article>
      </section>
    </div>);
  }

  selectService = (serviceId, serviceName) => () => {
    const {app: {masters}, actions, history} = this.props;
    !masters.list && !masters.loading && actions.loadMasters();
    history.push('/booking/step3/' + serviceId);
  }

  renderSubServices(list) {
    const {currentLocale, str} = this.props;
    const items = list
    .sort((serviceA, serviceB) => serviceA.order - serviceB.order)
    .map((service) => {
      const displayName = currentLocale == 'ua' ? service.name : service[currentLocale];
      return <li
        key={service.id}
        onClick={this.selectService(service.id, service.name)}>
        <div className="step2__service-name">{_.capitalize(displayName)}</div>
        <div className="step2__service-price">{str.priceTag.replace('{price}', service.price)}</div>
      </li>;
    });
    return (<ul className="step2-list">
      {items}
    </ul>);
  }
}

function mapStateToProps(state) {
  return {
    app: state.app,
    str: state.str.currentLocalization.step2,
    currentLocale: state.str.currentLocale
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Step2);