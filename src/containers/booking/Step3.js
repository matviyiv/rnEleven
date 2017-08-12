import React, { Component } from 'react';
import './booking.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

import './react-datepicker.css';
import * as actionCreators from '../../flux/actions';
import * as MasterHelper from '../../utils/MasterHelper';
import FloatingButton from '../../components/FloatingButton';

export class Step3 extends Component {
  state = {
    selectedDate: moment(),
    filteredMasters: null,
    currentService: null
  }

  componentWillMount() {
    const {
      app: {masters, services},
      match: {params},
      actions,
    } = this.props;

    !masters.list && !masters.loading && actions.loadMasters();
    !services.list && !services.loading && actions.loadServices();

    if (services.list && masters.list && !this.state.currentService) {
      const mastersList = _.filter(masters.list, (m) => m.services.indexOf(params.subServiceId) > -1);
      this.setState({
        currentService: findSubService(services.list, params.subServiceId),
        filteredMasters: mastersList,
      });
      this.props.actions.getMastersTime(mastersList, this.state.selectedDate);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {filteredMasters, currentService, selectedDate} = this.state;
    const {app: {masters, services}, match: {params}} = nextProps;
    const id = params.subServiceId;

    if (!filteredMasters && masters.list) {
      let mastersList = _.filter(masters.list, (m) => m.services.indexOf(id) > -1);
      this.setState({filteredMasters: mastersList});
      this.props.actions.getMastersTime(mastersList, selectedDate);
    }

    if (!currentService) {
      this.setState({currentService: findSubService(services.list, id)});
    }
  }

  renderAvaliableTime(master) {
    const {selectedDate, currentService} = this.state;
    const {str} = this.props;
    const listOfAvaliableHours = MasterHelper.getAvaliableTime({master, selectedDate, duration: currentService.duration});
    const date = selectedDate.date();
    const dateType = MasterHelper.isEven(date) ? 'even' : 'odd';
    let content = listOfAvaliableHours.map((time) => <li key={time.format('DD-HH:mm')}>
          <a onClick={this.selectMasterNextDate(master.id, moment(time))}>
          {time.format('HH:mm')}
          </a>
        </li>);

    
    if (listOfAvaliableHours.length === 0) {
      content = [<li key="msg-no-master"><a>
        {str.doesnt_work1}
        {` ${dateType === 'even' ? str.odd : str.even} `}
        {str.doesnt_work2}
      </a></li>];
    }

    return <ul className="time-list">{content}</ul>;
  }

  render() {
    const {app: {masters, services}, str, currentLocale} = this.props;
    const {filteredMasters, currentService} = this.state;
    
    if (!currentService || masters.loading || services.loading) {return (<div>Loading ...</div>);}

    const content = filteredMasters ? this.renderMasters(filteredMasters) : 'No master found!';

    return (<div>
      <FloatingButton showBackButton history={this.props.history}/>
      <h2>{str.title}</h2>
      <DatePicker
        dateFormat="DD/MM/YYYY"
        todayButton={str.today}
        utcOffset={+2}
        locale={currentLocale}
        readOnly={true}
        selected={this.state.selectedDate}
        onChange={this.handleDateChange}
        minDate={moment()}
        maxDate={moment().add(30, 'days')}
        ref="datepicker"
        placeholderText={str.placeholderText} />
      {content}
    </div>);
  }

  selectMasterNextDate = (masterId, date) => {
    const {match: {params}} = this.props;
    const serviceId = params.subServiceId;
    return () => {
      this.props.actions.selectMasterNextDate({masterId, serviceId, date});
      this.props.history.push('/booking/form');
    };
  }

  handleDateChange = (selectedDate) => {
    const {filteredMasters} = this.state;
    this.refs.datepicker.cancelFocusInput();
    this.props.actions.getMastersTime(filteredMasters, selectedDate);
    this.setState({selectedDate});
  }

  renderMasters(list) {
    const {currentLocale} = this.props;
    const items = _.values(list)
    .sort((masterA, masterB) => masterA.sort - masterB.sort)
    .map((master) => {
      const displayName = currentLocale == 'ua' ? master.name : master[currentLocale];
      const timeList = this.renderAvaliableTime(master);
      return <li key={master.id} className="clearfix">
        <div><img className="masterPhoto" src={`/img/avatars/${master.avatar}`}/></div>
        <a>{displayName}</a>
        <br/>{timeList}
      </li>;
    });

    return (<ul className="masters">
      {items}
    </ul>);
  }
}

function findSubService(services, subServiceId) {
  for (let serviceIndex in services) {
    let subservice = services[serviceIndex].sub.find((sub) => sub.id === subServiceId);
    if (subservice) {return subservice;}
  }
}

function mapStateToProps(state) {
  return {app: state.app, str: state.str.currentLocalization.step3, currentLocale: state.str.currentLocale};
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Step3);