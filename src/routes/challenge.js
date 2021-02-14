const Challenge = require('../models/challenge')
  , writeResponse = require('../helpers/response').writeResponse
  , dbUtils = require('../neo4j/dbUtils');

exports.getNext = function (req, res, next) {
    const summoner = req.params.summoner;
    const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);
    if (!summoner) throw {message: 'Invalid summoner name.', status: 400};
    Challenge.championsToPlayNext(dbUtils.getSession(req), summoner, skip, limit)
             .then(response => writeResponse(res, response))
             .catch(next);
}

exports.getNextCount = function (req, res, next) {
    const summoner = req.params.summoner;
    if (!summoner) throw {message: 'Invalid summoner name.', status: 400};
    Challenge.championsToPlayNextCount(dbUtils.getSession(req), summoner)
             .then(response => writeResponse(res, response))
             .catch(next);
}

exports.championsPlayed = function (req, res, next) {
    const summoner = req.params.summoner;
    if (!summoner) throw {message: 'Invalid summoner name.', status: 400};
    Challenge.championsPlayed(dbUtils.getSession(req), summoner)
             .then(response => writeResponse(res, response))
             .catch(next);
}
