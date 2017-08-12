import React, { Component } from 'react';
import './booking.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import * as actionCreators from '../../flux/actions';

export class FinalForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.booking.name || '',
      phone: props.booking.phone || '',
      notes: props.booking.notes || '',
      isSubmitted: false,
    };
  }

  componentWillMount() {
    const { booking, history} = this.props;
    const hasServices = Object.keys(booking.selectedServices).length;
    if (!hasServices) {
      history.push('/booking/step1');
    }
  }

  componentDidMount() {
    const { name, phone } = this.state;
    const { str } = this.props;
    if (!name) {
      this.refs.nameInput.setCustomValidity(str.invalid_required);
    }

    if (!phone) {
      this.refs.phoneInput.setCustomValidity(str.invalid_number);
    }
  }

  render() {
    const { name, phone, notes, isSubmitted } = this.state;
    const { booking, str } = this.props;
    const hasServices = Object.keys(booking.selectedServices).length;
    return (<section className="container final-form--container">
      <article className="final-form">
        <header className="page-title">
          <h2>{str.title}</h2>
        </header>
        <ul className="final-form--booking-list">
          {hasServices && this.renderServices(booking.selectedServices)}
        </ul>
        <form onSubmit={this.handleSubmit} className={isSubmitted ? 'final-form--submitted' : ''}>
        <div className="final-form--fields clearfix">
        <div className="form-group row">
          <label className="col-sm-4 control-label" htmlFor="name-input">{str.name_label}</label>
          <div className="col-sm-6">
          <input
            type="text"
            autoFocus="true"
            name="name"
            id="name-input"
            ref="nameInput"
            className="form-control"
            value={name}
            placeholder={str.name_placeholder}
            onChange={this.nameChange}
            required={true}
            />
            </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-4 control-label" htmlFor="phone-input">{str.number_label}</label>
          <div className="col-sm-6">
            <input
              type="text"
              name="phone"
              ref="phoneInput"
              id="phone-input"
              className="form-control"
              value={phone}
              placeholder="+38 063 11 22 333"
              onChange={this.phoneChange}
              required={true}
              />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-4 control-label" htmlFor="phone-input">{str.info_label}</label>
          <div className="col-sm-6">
            <textarea
              name="notes"
              cols="40"
              rows="5"
              className="form-control"
              placeholder={str.info_placeholder}
              value={notes}
              onChange={this.notesChange}
              >
            </textarea>
          </div>
        </div>
        <div className="form-group row">
          <div className="col-sm-6 col-sm-offset-4 col-md-4 col-md-offset-4 clearfix">
          <button className="btn btn-secondary final-form__add" onClick={this.addMore}>{str.add_btn}</button>
          <input
            type="submit"
            value={str.submit}
            className="btn btn-default final-form__submit"
            onClick={this.onClickSubmit}
            />
          </div>
        </div>
        </div>
        </form>
      </article>
    </section>);
  }

  nameChange = (event) => {
    this.refs.nameInput.setCustomValidity('');
    this.setState({name: event.target.value, isSubmitted: false });
  }

  phoneChange = (event) => {
    this.refs.phoneInput.setCustomValidity('');
    this.setState({phone: event.target.value, isSubmitted: false });
  }

  notesChange = (event) => this.setState({notes: event.target.value});

  onClickSubmit = () => this.setState({isSubmitted: true})

  addMore = (event) => {
    const { name, phone, notes } = this.state;
    event.preventDefault();
    this.props.actions.saveBookingUser({ name, phone, notes });
    this.props.history.push('/booking/step1');
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.submit();
    this.props.actions.clearBooking();
    this.props.history.push('/booking/done');
  }

  deleteSelectedService = (serviceId) => () => {
    this.props.actions.deleteSelectedService(serviceId);
  }

  submit = () => {
    const { name, phone, notes } = this.state;
    const { actions, booking } = this.props;
    actions.submitBooking({ ...booking, name, phone, notes });
  }

  renderServices(services) {
    const { currentLocale } = this.props;
    const content = [];
    moment.locale(currentLocale);
    for (let id in services) {
      let service = services[id];
      const displayName = service[currentLocale] || service.name;
      content.push(<li key={id} className="final-form__selected-service">
        {displayName} {moment(service.dateStart).format('Do MMMM HH:mm')}
        <span className="glyphicon glyphicon-remove" onClick={this.deleteSelectedService(id)}></span>
      </li>);
    };
    return content;
  }
}

function mapStateToProps(state) {
  return {
    booking: state.app.booking,
    str: state.str.currentLocalization.final_form,
    currentLocale: state.str.currentLocale
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(FinalForm);
