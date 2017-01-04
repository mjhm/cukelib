module.exports = class UsersController {
  constructor({ dbConn }) {
    this.dbConn = dbConn;
  }

  index(req, res, next) {
    return this.dbConn.select().from('users')
    .then(res.json.bind(res))
    .catch(next);
  }

  show(req, res, next) {
    return this.dbConn.first().from('users').where({ id: req.params.id })
    .then((result) => {
      if (!result) return res.sendStatus(404);
      return res.json(result);
    })
    .catch(next);
  }

  update(req, res, next) {
    return this.dbConn('users').update(req.body).where({ id: req.params.id }).returning('*')
    .then((result) => {
      if (!result || result.length === 0) return res.sendStatus(404);
      return res.json(result[0]);
    })
    .catch(next);
  }

  create(req, res, next) {
    return this.dbConn('users').insert(req.body).returning('*')
    .then((result) => res.json(result[0]))
    .catch(next);
  }

  destroy(req, res, next) {
    return this.dbConn('users').del().where({ id: req.params.id }).returning('*')
    .then((result) => {
      if (!result || result.length === 0) return res.sendStatus(404);
      return res.json(result[0]);
    })
    .catch(next);
  }
};
