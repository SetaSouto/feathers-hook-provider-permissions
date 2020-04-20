const logger = require('winston-namespace')('hooks:providerPermissions');
const { Forbidden, GeneralError } = require('@feathersjs/errors');


/**
 * Set permissions per provider, service and method.
 * 
 * Keep in mind that this hook is designed to be used in the `before.all` hook
 * of the app.
 * 
 * If you want that some actions should only be available through some providers you should
 * use this hook with a configuration like:
 * 
 * ```
 * {
 *   <providerName>: {
 *     <serviceName>: ['create'], // Only the create method
 *     <serviceName>: [], // All the methods
 *     // Services omitted won't be accessible by that provider
 *   }
 *   // Providers omitted won't be allowed
 * }
 * ```
 */
module.exports = config => context => {
  const { path, method, params } = context;

  if (!params.provider) {
    logger.error('There is no provider in the "context.params" object');
    throw new GeneralError();
  }

  const { provider } = params;
  const habilitatedProviders = Object.keys(config);

  if (!habilitatedProviders.includes(provider)) {
    logger.error(`Provider "${provider}" not allowed.`);
    throw new Forbidden();
  }

  const habilitatedServices = Object.keys(config[provider]);

  if (!habilitatedServices.includes(path)) {
    logger.error(`Provider "${provider}" not allowed to access service "${path}"`);
    throw new Forbidden();
  }

  const habilitatedMethods = config[provider][path];

  if (habilitatedMethods.length && !habilitatedMethods.includes(method)) {
    logger.error(`Provider "${provider}" not allowed to access method "${method}" of service "${path}"`);
    throw new Forbidden();
  }
};
