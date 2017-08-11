import moment from 'moment';
import _ from 'lodash';

import * as reducers from '../reducers';
import * as actions from '../actions';

describe('reducers', () => {
  let st;

  beforeEach(() => {
    st = {
      booking: {
        selectedServices: {}
      },
      services: {
        id: 's2',
        list: [{
          sub: [{
            id: 's2_1',
            duration: 1,
            name: 'service2'
          }]
        }]
      }
    }
  })
  it('SELECT_MASTER_NEXT_DATE', () => {
    const data = {
      serviceId: 's2_1',
      masterId: 'e1',
      date: moment(new Date('Wed Jun 14 2017 11:00:00 GMT+0300 (EEST)')).hours(11).minutes(0).seconds(0)
    };
    const result = reducers.appReducer(st, actions.selectMasterNextDate(data));
    expect(result.booking.selectedServices).toMatchSnapshot();
  });
});