"use strict";

const dbUtils = require('./dbUtils');

exports.createDBConstraintsAndIndexes = function() {
  const session = dbUtils.driver.session();
  session.readTransaction(txc =>
    txc.run(`MATCH (s:Summoner) RETURN s.name`)
  ).then(result => result.records.map(r => console.log(r.get('s.name')))).catch(err => console.log(err));
}