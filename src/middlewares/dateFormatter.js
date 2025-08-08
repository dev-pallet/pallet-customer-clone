export const DateFormatter = ({date}) => {
    const moment = require('moment');
    const formattedDate = moment(date).format("DD/MM/YY");
    return formattedDate;
}