import React, { Component } from 'react';
import './calendar.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import 'moment/locale/uk';
import BigCalendar from 'react-big-calendar';
import _ from 'lodash';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import * as actionCreators from '../../flux/actions';
import FloatingButton from '../../components/FloatingButton';
import EditBooking from './EditBooking.js';
import {classes} from '../../utils';

moment.locale('uk_UA');

export class Calendar extends Component {
  state = {
    filterMaster: '',
    email: '',
    password: '',
    openEdit: false,
    selectedBookingId: '',
  }

  componentWillMount() {
    Notification && Notification.requestPermission();
    BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
  }

  componentWillUnmount() {
    this.props.actions.logout();
  }

  componentWillReceiveProps(nextProps) {
    const {
      app: {allEvents, auth, db},
      actions
    } = nextProps;
    if (auth.status === 'success') {
      !allEvents.list.length && !allEvents.loading && actions.getAllEvents();
      !db.subscribed && actions.subscribeForNewBookings();
    }
  }

  render() {
    const {app: {allEvents, auth, masters}} = this.props;
    const {filterMaster, openEdit, selectedBooking} = this.state;
    let events = allEvents.list;

    if (auth.loading) {
      return (<h2>Loading...</h2>);
    }

    if (auth.status !== 'success') {
      return this.renderLoginForm();
    }

    if (allEvents.list.length === 0) {
      return (<h2>{allEvents.loading ? 'Loading...' : 'No events found'}</h2>);
    }

    if (filterMaster !== '') {
      events = _.filter(events, {masterId: filterMaster});
    }

    return (<div className="calendar--container">
      <FloatingButton showBookingButton history={this.props.history}/>
      <div>User: {auth.email}</div>
      Календар усіх подій
      <div>Filters:
      <select onChange={this.changeMaster} value={filterMaster}>
        <option value=''>filter by masters</option>
        {this.renderMasters()}
      </select>
      </div>
      <BigCalendar
        selectable
        events={events}
        defaultView='week'
        popup={true}
        min={moment('10:00', 'hh:mm').toDate()}
        max={moment('21:00', 'hh:mm').toDate()}
        messages={{
          allDay: 'цілий день',
          previous: '<<',
          next: '>>',
          today: 'сьогодні',
          month: 'місяць',
          week: 'тиждень',
          day: 'день',
        }}
        views={['month', 'week', 'day', 'agenda']}
        scrollToTime={new Date(1970, 1, 1, 6)}
        defaultDate={moment().toDate()}
        onSelectEvent={!isNoEditUser(auth.id) && this.onSelectEvent}
        eventPropGetter={this.eventPropGetter}
      />
      <EditBooking
        isOpen={openEdit}
        masters={masters}
        selectedBooking={selectedBooking}
        updateBooking={this.updateBooking}
        onCloseModal={this.onCloseModal}
        onDelete={this.onDelete}
      />
    </div>);
  }

  renderMasters() {
    const {app:{masters}} = this.props;
    return _.map(masters.list, (master) => (<option value={master.id} key={master.id}>
      {master.name}
    </option>));
  }

  changeMaster = (event) => {
    this.setState({filterMaster: event.target.value});
  }

  onDelete = (bookingId) => {
    if (window.confirm('Ви впевнені що хочете идалити бронювання?')) {
      this.props.actions.deleteBoking(bookingId);
    }
  }

  onSelectEvent = (event) => {
    this.setState({
      openEdit: !this.state.openEdit,
      selectedBooking: {
        id: event.bookingId,
        data: event.booking,
        subServiceId: event.subServiceId,
        title: event.title,
      }
    })
    
  }

  updateBooking = (bookingId, booking, subServiceId) => {
    this.props.actions.updateBooking(bookingId, booking, subServiceId);
  }

  onEmailChange = (event) => this.setState({email: event.target.value});
  onPasswordChange = (event) => this.setState({password: event.target.value});

  login = (event) => {
    const {email, password} = this.state;
    event.preventDefault();
    this.props.actions.authenticate(email, password);
  }

  onCloseModal = () => {
    this.setState({openEdit: false})
  }

  eventPropGetter(data) {
    const status = data.booking.status || 'new';
    const eventClasses = classes({
      'booking--confirmed': status === 'confirmed'
    });
    return {className: eventClasses, style: {}};
  }

  renderLoginForm() {
    const { email, password } = this.state;
    return (<div className="calendar__login-form">
      <form onSubmit={this.login}>
        <div className="form-group">
          <label>Користувач</label>
          <input type="email" className="form-control" onChange={this.onEmailChange} value={email} placeholder="Email"/>
        </div>
        <div className="form-group">
          <label>Пароль</label>
          <input type="password" className="form-control" onChange={this.onPasswordChange} value={password} placeholder="Password"/>
        </div>
          <button className="btn btn-default" onClick={this.login}>Увійти</button>
      </form>
    </div>);
  }
}

function isNoEditUser(uid) {
  return uid && uid === 'FoLpSC6zk9cWy1qWdOhN5R5NrMg1';
}

function mapStateToProps(state) {
  return { app: state.app };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);