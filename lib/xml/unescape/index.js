module.exports = function unescapexml(str) {
    return str.replace(/&([a-zA-Z0-9]*);/g, function(orig, entity) {
        var entities = {
            gt: '>',
            lt: '<',
            quot: '"',
            nbsp: '\xa0',
            amp: '&' };
        if(entities[entity]) {
            return entities[entity];
        }
        throw({
            error: 'Internal error, cannot convert entity',
            entity: entity,
            str: str
        });
    });
};