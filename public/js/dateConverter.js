export { convertToDate };

/* Converts DD.MM.YY to YYYY-MM-DD */
function convertToDate(date) {
    let dateParts = date.split('.');
    return '20'+dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0];
}