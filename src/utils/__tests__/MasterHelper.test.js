import moment from 'moment';
import _ from 'lodash';
import MockDate from 'mockdate';
import * as MasterHelper from '../MasterHelper';

describe('MasterHelper', () => {
  describe('isEven', () => {
    it('should be even date', () => {
      expect(MasterHelper.isEven(12)).toBe(true);
    });

    it('should be even date', () => {
      expect(MasterHelper.isEven(13)).toBe(false);
    });
  });

  describe('getAvaliableTime', () => {
    let master;

    beforeEach(() => {
      master = {
        work: ['odd', 'even'],
        booked: {}
      };
    });

    it('should return list of booking times', () => {
      const data = {
        master,
        selectedDate: moment().add(1, 'day'),
        duration: 1
      };
      expect(MasterHelper.getAvaliableTime(data).length).toBeGreaterThan(0);
    });

    it('should return 20 booking times, whole day is free', () => {
      const data = {
        master,
        selectedDate: moment().add(1, 'day'),
        duration: 0.5
      };
      expect(MasterHelper.getAvaliableTime(data).length).toBe(20)
    });

    it('should return 15 booking times, 1 hour booked and 1 hour before booking', () => {
      const tomorrow = moment().add(1, 'day');
      const data = {
        master,
        selectedDate: tomorrow,
        duration: 1
      };
      data.master.booked[`${tomorrow.format('YYYY/M/D')}`] = {
        12: {
          0: {
            duration: 1,
            name: 'all inclusive (зняття + чистка + покриття)'
          }
        }
      }
      let result = MasterHelper.getAvaliableTime(data);
      let resultString = result.toString();
      expect(result.length).toBe(15);
      // remove booking one hour before
      expect(resultString).not.toContain(moment(tomorrow).hours(11).minutes(0).seconds(0));
      expect(resultString).not.toContain(moment(tomorrow).hours(11).minutes(30).seconds(0));
      // remove booked time
      expect(resultString).not.toContain(moment(tomorrow).hours(12).minutes(0).seconds(0));
      expect(resultString).not.toContain(moment(tomorrow).hours(12).minutes(30).seconds(0));
      // remove one hour before closing
      expect(resultString).not.toContain(moment(tomorrow).hours(19).minutes(30).seconds(0));
    });

    it('should return today only one left booking', () => {
      const data = {
        master,
        selectedDate: moment(),
        duration: 1
      };
      MockDate.set(moment().hours(18).minutes(0).toDate());
      expect(MasterHelper.getAvaliableTime(data).length).toBe(1);
      MockDate.reset();
    });

    it('should return today 20 booking avaliable', () => {
      const data = {
        master,
        selectedDate: moment(),
        duration: 0.5
      };
      MockDate.set(moment().hours(7).minutes(0).toDate());
      expect(MasterHelper.getAvaliableTime(data).length).toBe(20);
      MockDate.reset();
    });

    it('should return empty list if master is not working', () => {
      const isEvenDate = MasterHelper.isEven(moment().date());
      master.work = [isEvenDate ? 'odd' : 'even'];
      const data = {
        master,
        selectedDate: moment(),
        duration: 1
      };
      expect(MasterHelper.getAvaliableTime(data).length).toBe(0);
    });
  });

});