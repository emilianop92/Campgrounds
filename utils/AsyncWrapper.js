// Wraps async functions to automatically pass in next.
// If there is an error, it will pass in the error to direct to error handling
function AsyncWrapper(fn) {
    return function(req, res, next){
        fn(req, res, next).catch(e => next(e))
    }
}

module.exports = AsyncWrapper