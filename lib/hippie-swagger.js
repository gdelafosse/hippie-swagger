'use strict'

var hippie = require('hippie')
var middleware = require('./middleware')
var settings = require('./settings')
var swaggerValidator = require('./swagger-validator')

/**
 * Stores parameters in the url path for later substitution
 * @param  {Object} parameters - { pathVariableName: value }
 * @return {Object <hippie>} - current hippie instance
 */
hippie.prototype.pathParams = function (parameters) {
  var self = this
  this.swaggerParams = this.swaggerParams || {}
  this.swaggerParams.path = this.swaggerParams.path || {}

  Object.keys(parameters).forEach(function (key) {
    self.swaggerParams.path[key] = parameters[key]
  })
  return this
}

module.exports = function (app, swaggerDef, overrides) {
  settings.store(overrides)

  swaggerValidator(swaggerDef)

  var api = hippie(app)
  api.json()
  api.use(middleware.bind(api, swaggerDef))

  return api
}
