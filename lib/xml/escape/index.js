module.exports = function escapexml(str) {
    return str.replace(/[^ !#-;=?-~\n\r\t]/g, function(c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
};