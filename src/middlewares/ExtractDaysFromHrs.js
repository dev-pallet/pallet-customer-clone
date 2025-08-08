import moment from 'moment';
export const extractDaysFromHrs = (hrs, min) => {
  let temp = '';
  var days = Math.floor(hrs / 24);
  var d = Math.floor(Number(min) / 60 / 24);

  var h =
    d > 0
      ? Math.floor((Number(min) / 60) % (24 * d))
      : Math.floor(Number(min) / 60);

  var m = Math.floor(Number(min) % 60);

  // if (days > 0) {
  let getHrs = new Date().getHours();
  temp = moment(new Date().setHours(getHrs + hrs));
  // }

  return {
    expected: temp,
    within:
      d > 0
        ? `${d}d ${h}hr ${m}mins.`
        : h > 0
        ? `${h}hr ${m}mins.`
        : `${m}mins.`,
  };
};
