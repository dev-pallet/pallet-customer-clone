import moment from 'moment';

export const convertUTC = utcTime => {
  // Calculate the UTC time zone offset in minutes
  const utcOffsetMinutes = moment(utcTime).utcOffset();

  return moment(utcTime).add(utcOffsetMinutes, 'minutes');
};
