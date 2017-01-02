const Promise = require('bluebird');
const _ = require('lodash');

module.exports = class UsersAdsController {
  constructor({ dbConn }) {
    this.dbConn = dbConn;
  }

  requestAds(req, res, next) {
    this.dbConn.transaction(Promise.coroutine(function* (trx) {
      // Get the target ads along with their counts
      const targetAds = yield trx.raw(`
        SELECT id, brand, COALESCE(view_count, 0) AS view_count FROM ads LEFT OUTER JOIN
          (SELECT * FROM user_ad_map WHERE user_id=?) AS uam ON id=ad_id
          ORDER BY view_count ASC LIMIT ?
      `, [req.params.id, req.body.count]);

      const valueArray = targetAds.rows.map((r) => `(${req.params.id}, ${r.id})`);
      if (valueArray.length < req.body.count) {
        const err = new Error('too many ads requested');
        err.statusCode = 400;
        throw err;
      }

      const values = valueArray.join(',\n');

      const inserted = yield trx.raw(`
        INSERT INTO user_ad_map (user_id, ad_id) VALUES ${values}
          ON CONFLICT (user_id, ad_id) DO UPDATE SET view_count = user_ad_map.view_count + 1
          RETURNING *
      `);
      return inserted;
    }))
    .then((result) => {
      if (!result) return res.sendStatus(404);
      return res.json(result.rows);
    })
    .catch((err) => {
      if (_.has(err, 'statusCode')) {
        return res.status(err.statusCode).send(err.message);
      }
      throw err;
    })
    .catch(next);
  }
};
