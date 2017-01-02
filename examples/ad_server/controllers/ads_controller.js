module.exports = class AdsController {
  constructor({ dbConn }) {
    this.dbConn = dbConn;
  }

  index(req, res, next) {
    return this.dbConn.select().from('ads')
    .then(res.json.bind(res))
    .catch(next);
  }

  show(req, res, next) {
    return this.dbConn.first().from('ads').where({ id: req.params.id })
    .then((result) => {
      if (!result) return res.sendStatus(404);
      return res.json(result);
    })
    .catch(next);
  }

  update(req, res, next) {
    return this.dbConn('ads').update(req.body).where({ id: req.params.id }).returning('*')
    .then((result) => {
      if (!result || result.length === 0) return res.sendStatus(404);
      return res.json(result[0]);
    })
    .catch(next);
  }

  create(req, res, next) {
    return this.dbConn('ads').insert(req.body).returning('*')
    .then((result) => res.json(result[0]))
    .catch(next);
  }

  destroy(req, res, next) {
    return this.dbConn('ads').del().where({ id: req.params.id }).returning('*')
    .then((result) => {
      if (!result || result.length === 0) return res.sendStatus(404);
      return res.json(result[0]);
    })
    .catch(next);
  }
};
