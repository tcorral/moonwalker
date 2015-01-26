module.exports = function (errors){
    var error = ['There'];
    if(errors.length === 1){
        error.push('is an error');
    }else{
        error.push('are some errors');
    }
    error.push('launching your selenese test/s, please review');
    if(errors.length === 1){
        error.push('it.');
    }else{
        error.push('them.');
    }
    return error.join(' ');
};