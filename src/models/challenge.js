const {int} = require('neo4j-driver/lib/integer');

// get remaining champions to play with limit
const championsToPlayNext = function (session, user, skip, limit) {
    return session.readTransaction(txc =>
        txc.run(
            `MATCH (s:Summoner)-[:DOING]->(c:Challenge)
            WHERE s.name = $summoner AND c.name = $challenge AND c.completed = false
            MATCH (r:Champion)
            WHERE NOT EXISTS {
                MATCH (c)-[:PLAYED]-(g:Game)-[:AS]-(h:Champion) WHERE h.name = r.name
            }
            RETURN r.name AS champion
            SKIP $skip 
            LIMIT $limit`,
            {summoner: user, challenge: `Waterdance Champion Challenge`, skip: int(skip), limit: int(limit)})
        ).then(result => result.records.map(r => ({
            champion: r.get('champion')
    })));
};

const championsToPlayNextCount = function (session, user) {
    return session.readTransaction(txc =>
        txc.run(
            `MATCH (s:Summoner)-[:DOING]->(c:Challenge)
            WHERE s.name = $summoner AND c.name = $challenge AND c.completed = false
            MATCH (r:Champion)
            WHERE NOT EXISTS {
                MATCH (c)-[:PLAYED]-(g:Game)-[:AS]-(h:Champion) WHERE h.name = r.name
            }
            RETURN count(r) as count`,
            {summoner: user, challenge: `Waterdance Champion Challenge`})
        ).then(result => result.records.map(r => ({
            count: r.get('count')
    })));
};

// get champions played
const championsPlayed = function (session, user) {
    return session.readTransaction(txc =>
        txc.run(
            `MATCH (s:Summoner)-[:DOING]->(c:Challenge)
            WHERE s.name = $summoner AND c.name = $challenge AND c.completed = false
            MATCH (c)-[:PLAYED]-(g:Game)-[:AS]->(champ:Champion)
            WITH champ, g, apoc.temporal.format(datetime({datetime: g.date, timezone: "America/New_York"}), 'yyyy/MM/dd HH:mm') AS date
            RETURN champ.name AS champion, date, g.win AS win, g.position AS position ORDER BY date`,
            {summoner: user, challenge: `Waterdance Champion Challenge`})
        ).then(result => result.records.map(r => ({
            champion: r.get('champion'),
            date: r.get('date'),
            win: r.get('win'),
            position: r.get('position')
    })));
};

// get champions played count
const championsPlayedCount = function (session, user) {
    return session.readTransaction(txc =>
        txc.run(
            `MATCH (s:Summoner)-[:DOING]->(c:Challenge)
            WHERE s.name = $summoner AND c.name = $challenge AND c.completed = false
            MATCH (c)-[:PLAYED]-(g:Game)-[:AS]->(champ:Champion)
            RETURN count(champ) as count`,
            {summoner: user, challenge: `Waterdance Champion Challenge`})
        ).then(result => result.records.map(r => ({
            count: r.get('count')
    })));
};

module.exports = {
    championsToPlayNext: championsToPlayNext,
    championsToPlayNextCount: championsToPlayNextCount,
    championsPlayed: championsPlayed,
    championsPlayedCount: championsPlayedCount
};
