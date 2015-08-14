'use strict';
/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');
var uncase = require('to-no-case');
var includes = require('includes');
var foldl = require('foldl');
var Identify = require('facade').Identify;

/**
 * Expose `Outbound` integration.
 */

var Outbound = module.exports = integration('Outbound')
  .global('outbound')
  .option('publicApiKey', '')
  .tag('<script src="//cdn.outbound.io/{{ publicApiKey }}.js">');

/**
 * Initialize.
 *
 * @api public
 */

Outbound.prototype.initialize = function() {
  window.outbound = window.outbound || [];
  window.outbound.methods = [
    'identify',
    'track',
    'registerApnsToken',
    'registerGcmToken',
    'disableApnsToken',
    'disableGcmToken',
    'hasIdentified'
  ];

  window.outbound.factory = function(method) {
    return function() {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(method);
      window.outbound.push(args);
      return window.outbound;
    };
  };

  for (var i = 0; i < window.outbound.methods.length; i++) {
    var key = window.outbound.methods[i];
    window.outbound[key] = window.outbound.factory(key);
  }

  this.load(this.ready);
};


/**
 * Identify.
 *
 * @api public
 * @param {Identify} identify
 */

Outbound.prototype.identify = function(identify) {
  var specialTraits = [
    'id',
    'user id',
    'email',
    'phone',
    'first name',
    'last name'
  ];

  var userId = identify.userId() || identify.anonymousId();

  var attributes = foldl(function(acc, val, key) {
    if (!includes(uncase(key), specialTraits)) acc.attributes[key] = val;
    return acc;
  }, {
    attributes: {},
    email: identify.email(),
    phoneNumber: identify.phone(),
    firstName: identify.firstName(),
    lastName: identify.lastName()
  }, identify.traits());

  window.outbound.identify(userId, attributes);
};

/**
 * Track.
 *
 * @api public
 * @param {Track} track
 */

Outbound.prototype.track = function(track) {
  if (!this.hasIdentified()) {
    var user = new Identify({ userId: track.userId() || track.anonymousId() });
    this.identify(user);
  }
  window.outbound.track(track.event(), track.properties(), track.timestamp());
};

/**
 * Alias.
 *
 * @api public
 * @param {Alias} alias
 */

Outbound.prototype.alias = function(alias) {
  window.outbound.identify(alias.userId(), { previousId: alias.previousId() });
};

/**
 * Has Identified?
 *
 * @api private
 * @return {boolean}
 */

Outbound.prototype.hasIdentified = function() {
  return window.outbound.hasIdentified();
};
