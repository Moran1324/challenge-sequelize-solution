async function optionsHandler(options) {
if (options.hasOwnProperty('include')) await require('./include')
if (options.hasOwnProperty('attributes')) await require('./attributes')
if (options.hasOwnProperty('limit')) await require('./limit')
if (options.hasOwnProperty('order')) await require('./order')
if (options.hasOwnProperty('where')) await require('./where')
};

module.exports = optionsHandler;
