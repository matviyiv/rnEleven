import moment from 'moment';
import _ from 'lodash';
import firebase from '../firebase-setup.js';
import {fetchGet} from '../utils';

export const constants = {
  SERVICES_LOADING: 'SERVICES_LOADING',
  SERVICES_LOADED: 'SERVICES_LOADED',
  SELECT_SERVICE: 'SELECT_SERVICE',
  SERVICES_FAILED: 'SERVICES_FAILED',
  MASTERS_LOADING: 'MASTERS_LOADING',
  MASTERS_LOADED: 'MASTERS_LOADED',
  MASTERS_FAILED: 'MASTERS_FAILED',
  SELECT_MASTER_NEXT_DATE: 'SELECT_MASTER_NEXT_DATE',

  BOOKING_SUBMIT: 'BOOKING_SUBMIT',
  BOOKING_SUBMITED: 'BOOKING_SUBMITED',
  BOOKING_FAILED: 'BOOKING_FAILED',
  BOOKING_CLEAR: 'BOOKING_CLEAR',
  SAVE_BOOKING_USER: 'SAVE_BOOKING_USER',
  BOOKING_DELETED: 'BOOKING_DELETED',
  BOOKING_DELETED_FAILED: 'BOOKING_DELETED_FAILED',
  BOOKING_DELETE_SERVICE: 'BOOKING_DELETE_SERVICE',
  BOOKING_UPDATED: 'BOOKING_UPDATED',
  BOOKING_UPDATE_FAILED: 'BOOKING_UPDATE_FAILED',

  MASTERS_TIME_LOADING: 'MASTERS_TIME_LOADING',
  MASTERS_TIME_LOADED: 'MASTERS_TIME_LOADED',
  MASTERS_TIME_ERROR: 'MASTERS_TIME_ERROR',
  
  ALL_EVENTS_LOADING: 'ALL_EVENTS_LOADING',
  ALL_EVENTS_LOADED: 'ALL_EVENTS_LOADED',
  ALL_EVENTS_FAILED: 'ALL_EVENTS_FAILED',

  AUTH_LOADING: 'AUTH_LOADING',
  AUTH_DONE: 'AUTH_DONE',
  AUTH_FAILED: 'AUTH_FAILED',
  LOGOUT: 'LOGOUT',

  SUB_SUCCESS: 'SUB_SUCCESS',
  SUB_FAILED: 'SUB_FAILED',
  SUB_START: 'SUB_START',

  DB_BOOKING_SUBSCRIBE: 'DB_BOOKING_SUBSCRIBE',
  DB_BOOKING_UPDATE: 'DB_BOOKING_UPDATE',

  SET_LAGUAGE: 'SET_LAGUAGE',
  LOCALIZATION_LOADED: 'LOCALIZATION_LOADED',
};

export function loadServices() {
  return dispatch => {
    dispatch({
      type: constants.SERVICES_LOADING
    });
    firebase.database().ref('lviv/services').once('value')
      .then((services) => {
        console.log('services loaded', services.val());
        dispatch({
          type: constants.SERVICES_LOADED,
          data: services.val()
        });
      })
      .catch((error) => {
        console.error('action loadServices failed', error);
        dispatch({
          type: constants.SERVICES_FAILED,
          error: error
        });
      });
  };
}

export function selectService(data) {
  return {
    type: constants.SELECT_SERVICE,
    data
  };
}

export function selectMasterNextDate(data) {
  return {
    type: constants.SELECT_MASTER_NEXT_DATE,
    data
  };
}

export function loadMasters() {
  return dispatch => {
    dispatch({
      type: constants.MASTERS_LOADING
    });
    firebase.database()
      .ref('lviv/masters')
      .once('value')
      .then((masters) => {
        const mastersList = masters.val();
        console.log('masters loaded', mastersList);
        dispatch({
          type: constants.MASTERS_LOADED,
          data: mastersList
        });
      })
      .catch((error) => {
        console.error('action loadMasters failed', error);
        dispatch({
          type: constants.MASTERS_FAILED,
          error: error
        });
      });
  };
}

export function getMastersTime(mastersList, _date_) {
  return dispatch => {
    dispatch({
      type: constants.MASTERS_TIME_LOADING
    });
    const date = moment(_date_);
    if (mastersList) {
      return Promise.all(
        mastersList.map((master) => firebase.database()
          .ref(`lviv/mastersTime/${master.id}/${date.get('year')}/${date.get('month')}/${date.get('date')}`).once('value'))
      )
      .then((timeList) => timeList.map((time) => time.val()))
      .then((result) => {
        dispatch({
          type: constants.MASTERS_TIME_LOADED,
          data: {mastersList, result, date}
        });
      })
      .catch((e) => {
        dispatch({
          type: constants.MASTERS_TIME_ERROR,
          error: e
        });
      });
    }
  };
}

export function getAllEvents() {
  return dispatch => {
    const date = moment().subtract(1, 'month');
    dispatch({
      type: constants.ALL_EVENTS_LOADING
    });

    Promise.all([
      loadMastersRequest(),
      loadBookingsRequest(date),
    ])
    .then(([masters, bookings]) => {
      dispatch({
        type: constants.MASTERS_LOADED,
        data: masters.val()
      });
      dispatch({
        type: constants.ALL_EVENTS_LOADED,
        data: bookings.val()
      });
    })
    .catch((error) => {
      console.error('action getAllEvents failed', error);
      dispatch({
        type: constants.ALL_EVENTS_FAILED,
        error: error
      });
    });
  };
}

export function subscribeForNewBookings() {
  return dispatch => {
    dispatch({
      type: constants.DB_BOOKING_SUBSCRIBE
    });
    firebase.database()
      .ref('lviv/bookings')
      .on('child_added', function(snapshot) {
        dispatch({
          type: constants.DB_BOOKING_UPDATE,
          data: {
            booking: snapshot.val(),
            bookingId: snapshot.key
          }
        });
      });
  }
}

function loadMastersRequest() {
  return firebase.database()
    .ref('lviv/masters')
    .once('value');
}

function loadBookingsRequest(date) {
  return firebase.database()
    .ref('lviv/bookings')
    .orderByChild('timestamp')
    .startAt(date.toDate().getTime())
    .once('value');
}

export function submitBooking(_booking_) {
  return dispatch => {
    const booking = {..._booking_};
    booking.timestamp = moment().toDate().getTime();
    booking.status = 'new';
    dispatch({
      type: constants.BOOKING_SUBMIT,
      data: {booking}
    });
    const mastersData = getMasterTime(booking.selectedServices);
    Promise.all([
      firebase.database().ref('lviv/mastersTime')
        .update(mastersData),
      firebase.database().ref('lviv/bookings')
        .push(booking)
    ])
      .then(() => {
        console.log('submitBooking done');
        dispatch({
          type: constants.BOOKING_SUBMITED
        });
      })
      .catch((error) => {
        console.error('action submitBooking failed', error);
        dispatch({
          type: constants.BOOKING_FAILED,
          error: error
        });
      });
  };
}

export function saveBookingUser(data) {
  return {
    type: constants.SAVE_BOOKING_USER,
    data
  };
}

export function clearBooking() {
  return {
    type: constants.BOOKING_CLEAR,
  };
}

export function deleteBoking(bookingId) {
  return dispatch => {
    firebase.database()
    .ref('lviv/bookings/' + bookingId)
    .once('value')
    .then((_booking) => {
      let booking = _booking.val();
      const mastersData = getMasterTime(booking.selectedServices);

      booking.status = 'deleted';
      return Promise.all([
        _.keys(mastersData).map((key) => firebase.database().ref('lviv/mastersTime/' + key).remove()),
        firebase.database().ref('lviv/bookings/' + bookingId)
          .update(booking)
      ]);
    })
    .then(() => {
      dispatch({
        type: constants.BOOKING_DELETED,
        data: {bookingId}
      });
    })
    .catch((error) => {
      dispatch({
        type: constants.BOOKING_DELETED_FAILED,
        data: {error}
      });
    });
    
  };
}

export function updateBooking(bookingId, booking, subServiceId) {
  return dispatch => {
    firebase.database().ref('lviv/bookings/' + bookingId)
      .update(booking)
      .then(() => {
        dispatch({type: constants.BOOKING_UPDATED, data: {booking, subServiceId, bookingId}})
      })
      .catch((error) => {
        dispatch({
          type: constants.BOOKING_UPDATE_FAILED,
          error: 'Failed to update booking' + error
        });
      });
  }
}

export function authenticate(email, password) {
  return dispatch => {
    dispatch({
      type: constants.AUTH_LOADING,
    });
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        dispatch({
          type: constants.AUTH_DONE,
          data: {email, id: firebase.auth().currentUser.uid}
        });
      })
      .catch((error) => {
        dispatch({
          type: constants.AUTH_FAILED,
          error
        });
      });
  };
}

export function logout() {
  return dispatch => {
    firebase.auth().signOut()
    .then(() => {
      dispatch({
        type: constants.LOGOUT
      });
    });
  };
}

export function subscribe(email) {
  return dispatch => {
    dispatch({
      type: constants.SUB_START
    });
    firebase.database().ref('lviv/subscriptions')
      .push({
        date: moment().toDate().getTime(),
        email
      })
      .then(() => dispatch({type: constants.SUB_SUCCESS}))
      .catch((error) => dispatch({type: constants.SUB_FAILED, data: {error}}));
  }
}

export function deleteSelectedService(serviceId) {
  return {
    type: constants.BOOKING_DELETE_SERVICE,
    data: {serviceId}
  }
}

function getMasterTime(bookings) {
  return _.reduce(bookings, (result, booking) => {
    let date = moment(booking.dateStart);
    result[`${booking.masterId}/${date.get('year')}/${date.get('month')}/${date.get('date')}/${date.get('hour')}/${date.get('minute')}`] = {name: booking.name, duration: booking.duration};
    return result;
  }, {});
}

export function changeLanguage(locale, str) {
  return dispatch => {
    if (str[locale]) {
      return dispatch({
        type: constants.SET_LAGUAGE,
        data: {locale}
      });
    }
   
    fetchGet(`/localization/${locale}.json`)
      .then((localization) => {
        dispatch({
          type: constants.LOCALIZATION_LOADED,
          data: {localization, locale}
        });
      })
  }
}
