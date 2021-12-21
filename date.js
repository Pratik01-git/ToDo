
module.exports.getDate = getDate;
function getDate(){
    let today = new Date();
    let date = today.toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"});
    return date;
}

module.exports.getDay = getDay;
function getDay(){
    let today = new Date();
    let day = today.toLocaleString("en-IN",{weekday:"long"});
    return day;
}
