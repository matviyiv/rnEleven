import {constants} from './actions';
import moment from 'moment';
import _ from 'lodash';

const initialState = {
  services: {},
  masters: {},
  booking: {
    selectedServices: {}
  },
  allEvents: {
    list: [],
    loading: false,
  },
  auth: {
    status: '',
    loading: false,
    email: '',
  },
  subscription: {},
  db: {}
};
const {
  SERVICES_LOADING,
  SERVICES_LOADED,
  MASTERS_LOADED,
  MASTERS_LOADING,
  SELECT_MASTER_NEXT_DATE,
  MASTERS_TIME_LOADED,
  SAVE_BOOKING_USER,
  ALL_EVENTS_LOADED,
  ALL_EVENTS_LOADING,
  BOOKING_DELETED,
  BOOKING_SUBMITED,
  BOOKING_CLEAR,
  BOOKING_DELETE_SERVICE,
  BOOKING_UPDATED,
  AUTH_LOADING,
  AUTH_DONE,
  LOGOUT,
  SUB_START,
  SERVICES_FAILED,
  BOOKING_FAILED,
  BOOKING_DELETED_FAILED,
  MASTERS_TIME_ERROR,
  ALL_EVENTS_FAILED,
  AUTH_FAILED,
  DB_BOOKING_UPDATE,
  DB_BOOKING_SUBSCRIBE,
} = constants;

export function appReducer(state = initialState, action) {
  const actions = {
    [SERVICES_LOADING]: (st) => {
      st.services.loading = true;
      return { ...st };
    },
    [SERVICES_LOADED]: (st, data) => {
      st.services.loading = false;
      st.services.list = data;
      return { ...st };
    },
    [MASTERS_LOADING]: (st) => {
      st.masters.loading = true;
      return {...st};
    },
    [MASTERS_LOADED]: (st, data) => {
      st.masters.loading = false;
      st.masters.list = data;
      return { ...st };
    },
    [SELECT_MASTER_NEXT_DATE]: (st, {serviceId, masterId, date}) => {
      const service = findSubService(st.services.list, serviceId);
      const dateEnd = moment(date).add(service.duration, 'hours');
      const selectedService = {
        masterId: masterId,
        dateStart: moment(date).toString(),
        dateEnd: moment(dateEnd).toString(),
        name: service.name,
        en: service.en,
        serviceId: serviceId,
        duration: service.duration,
      };

      st.booking.selectedServices[serviceId + '+' + date.valueOf()] = selectedService;

      return { ...st };
    },
    [MASTERS_TIME_LOADED]: (st, {mastersList, result, date}) => {
      const time = moment(date).format('YYYY/M/D');
      mastersList.forEach((master, index) => {
        _.setWith(st.masters.list[master.id], `booked.${time}`, result[index], Object);
      });
      return { ...st };
    },
    [BOOKING_SUBMITED]: (st) => {
      st.booking = initialState.booking;
      return {...st};
    },
    [SAVE_BOOKING_USER]: (st, {name, phone, notes}) => {
      st.booking.name = name;
      st.booking.phone = phone;
      st.booking.notes = notes;
      st.booking.status = 'active';
      return {...st};
    },
    [BOOKING_CLEAR]: (st) => {
      st.booking.selectedServices = {};
      return {...st};
    },
    [ALL_EVENTS_LOADING]: (st) => {
      st.allEvents.loading = true;
      return {...st};
    },
    [ALL_EVENTS_LOADED]: (st, bookings) => {
      let eventsList = st.allEvents.list;
      _.forEach(bookings, (booking, bookingId) => {
        if (booking.status === 'deleted') {return;}
        eventsList = [].concat(eventsList, prepareCalendarEvent(booking, bookingId, st.masters));
      });
      st.allEvents.loading = false;
      st.allEvents.list = eventsList;
      return {...st};
    },
    [BOOKING_DELETED]: (st, {bookingId}) => {
      let index = _.findIndex(st.allEvents.list, {bookingId});
      delete st.allEvents.list[index];
      return {...st};
    },
    [BOOKING_UPDATED]: (st, {booking, bookingId, subServiceId}) => {
      let eventsList = st.allEvents.list;
      let index = _.findIndex(eventsList, {subServiceId: subServiceId});
      eventsList[index] = _.find(prepareCalendarEvent(booking, bookingId, st.masters), {subServiceId: subServiceId});
      st.allEvents.list = eventsList;
      return {...st};
    },
    [AUTH_LOADING]: (st) => {
      st.auth.loading = true;
      return {...st};
    },
    [AUTH_DONE]: (st, {email, id}) => {
      st.auth.email = email;
      st.auth.id = id;
      st.auth.status = 'success';
      st.auth.loading = false;
      return {...st};
    },
    [LOGOUT]: (st) => {
      st.auth.email = '';
      st.auth.status = '';
      return {...st};
    },
    [SUB_START]: (st) => {
      st.subscription.success = true;
      return {...st};
    },
    [BOOKING_DELETE_SERVICE]: (st, {serviceId}) => {
      const booking = {...st.booking};
      delete booking.selectedServices[serviceId];
      st.booking = booking;
      return {...st};
    },
    [DB_BOOKING_SUBSCRIBE]: (st, data) => {
      st.db.subscribed = true;
      return {...st};
    },
    [DB_BOOKING_UPDATE]: (st, {booking, bookingId}) => {
      if (booking.status === 'deleted' || !st.masters.list) {return st;}
      let eventsList = st.allEvents.list;
      if (_.find(eventsList, {bookingId: bookingId})) {return st;}
      eventsList = [].concat(eventsList, prepareCalendarEvent(booking, bookingId, st.masters));
      st.allEvents.loading = false;
      st.allEvents.list = eventsList;
      showNotification(booking);
      return {...st};
    },
    default: (st) => st
  },
  modifier = actions[action.type] || actions.default;
  if ([
      SERVICES_FAILED,
      BOOKING_FAILED,
      BOOKING_DELETED_FAILED,
      MASTERS_TIME_ERROR,
      ALL_EVENTS_FAILED,
      AUTH_FAILED,
    ].indexOf(action.type) > -1) {console.error(action.error || action.data.error);}
  const newState = modifier(state, action.data);
  console.log('----', action.type, newState);
  return newState;
}

function findSubService(services, subServiceId) {
  for (let serviceIndex in services) {
    let subservice = services[serviceIndex].sub.find((sub) => sub.id === subServiceId);
    if (subservice) {return subservice;}
  }
}

function prepareCalendarEvent(booking, bookingId, masters) {
  return _.map(booking.selectedServices, (service, subServiceId) => ({
    title: `Сервіс: ${service.name} майстер: ${_.get(masters, `list[${service.masterId}].name`, 'removed')} клієнт: ${booking.name} тел: ${booking.phone} дод: ${booking.notes}`,
    start: new Date(service.dateStart),
    end: new Date(service.dateEnd),
    desc: `${booking.name} ${booking.phone}`,
    masterId: service.masterId,
    bookingId,
    booking,
    subServiceId,
  }));
}

function showNotification(booking) {
  new Notification('Нове бронювання', {
    body: JSON.stringify(booking.selectedServices)
  })
}