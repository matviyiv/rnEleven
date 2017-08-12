import React, { Component } from 'react';
import Modal from 'react-modal';
import moment from 'moment';

import './calendar.css';
const modalStyles = {
  overlay: {
    zIndex: 100
  }
}

export default class Calendar extends Component {
  state = {
    name: '',
    phone: '',
    notes: '',
    duration: 1,
    title: '',
    bookingStatus: 'new'
  }

  static defaultProps = {
    selectedBooking: {
      id: '',
      data: {
        name: '',
        phone: '',
        notes: '',
        title: ''
      }
    },
    onCloseModal: () => {}
  }

  componentWillReceiveProps(nextProps) {
    const {selectedBooking:{data, subServiceId, title}} = nextProps;
    if (this.props.selectedBooking.subServiceId !== subServiceId) {
      let selectedService = data.selectedServices[subServiceId];
      this.setState({
        name: data.name,
        phone: data.phone,
        notes: data.notes,
        title: title,
        duration: selectedService.duration,
        bookingStatus: data.status,
        dateStart: selectedService.dateStart,
        dateEnd: selectedService.dateEnd
      });
    }
  }

  render() {
    const {isOpen, onCloseModal} = this.props;
    const {name, phone, notes, duration, title, bookingStatus, dateStart, dateEnd} = this.state;

    return (<div>
      <Modal
        isOpen={isOpen}
        onRequestClose={onCloseModal}
        style={modalStyles}
        contentLabel="Modal"
      >
        <h1>
          редагувати бронювання
          <span className="close" onClick={onCloseModal}>x</span>
        </h1>
        <form onSubmit={this.onSubmit} className="edit__form">
          <div>Start: {dateStart}</div>
          <div>End: {dateEnd}</div>
          <div>{title}</div>
          <div className="form-group row">
            <label className="col-sm-4 control-label" htmlFor="name-input">{"Ім'я:"}</label>
            <div className="col-sm-6">
            <input
              type="text"
              autoFocus="true"
              name="name"
              id="name-input"
              ref="nameInput"
              className="form-control"
              value={name}
              placeholder="як до тебе звертатися"
              onChange={this.nameChange}
              required={true}
              />
              </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 control-label" htmlFor="name-input">Мобільний номер:</label>
            <div className="col-sm-6">
            <input
              type="tel"
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
            <label className="col-sm-4 control-label" htmlFor="phone-input">Додаткова інформація:</label>
            <div className="col-sm-6">
              <textarea
                name="notes"
                cols="40"
                rows="5"
                className="form-control"
                placeholder="мені потрібно ..."
                value={notes}
                onChange={this.notesChange}
                >
              </textarea>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 control-label" htmlFor="name-input">Тривалість</label>
            <div className="col-sm-6">
            <input
              type="number"
              name="duration"
              id="duration-input"
              ref="durationInput"
              className="form-control"
              min="0.5"
              max="6"
              step="0.5"
              value={duration}
              placeholder="тривалість"
              onChange={this.durationChange}
              required={true}
              />
              </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 control-label" htmlFor="state-input">Статус бронювання</label>
            <div className="col-sm-6">
              <select className="form-control" id="state-input" value={bookingStatus} onChange={this.bookingStatusChange}>
                <option value="new">нове</option>
                <option value="confirmed">підтверджено</option>
              </select>
            </div>
          </div>
          <div className="edit__controls">
            <input type="submit" value="Зберегти зміни" className="btn btn-primary pull-left"/>
            <button onClick={onCloseModal} className="btn btn-default pull-left">Закрити</button>
            <button onClick={this.onDelete} className="btn btn-danger pull-right">Видалити</button>
          </div>
        </form>
      </Modal>
    </div>)
  }

  nameChange = (event) => this.setState({name: event.target.value})
  phoneChange = (event) => this.setState({phone: event.target.value})
  notesChange = (event) => this.setState({notes: event.target.value})
  durationChange = (event) => this.setState({duration: event.target.value})
  bookingStatusChange = (event) => this.setState({bookingStatus: event.target.value})
  onDelete = () => {
    this.props.onDelete(this.props.selectedBooking.id);
    this.props.onCloseModal();
  }
  onSubmit = (event) => {
    event.preventDefault();
    const {data, id, subServiceId} = this.props.selectedBooking;
    const {name, phone, notes, duration, bookingStatus} = this.state;
    let booking = {
      ...data,
      name,
      phone,
      notes,
      status: bookingStatus
    }
    let subService = booking.selectedServices[subServiceId];
    if (subService.duration !== +duration) {
      subService.duration = +duration;
      subService.dateEnd = moment(subService.dateStart).add(+duration, 'hours').toString();
    }

    this.props.updateBooking(id, booking, subServiceId);
    this.props.onCloseModal();
  }
}
