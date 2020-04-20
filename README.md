# Feathers hook ProviderPermissions

A simple hook for your feathers app to provide permissions to execute methods on services based on the provider,
the service and the method.

## Quick start

Install the package:

```bash
npm i feathers-hook-provider-permissions
```

Use it in your app:

```javascript
// app.hooks.js
const providerPermissions = require('feathers-hook-provider-permissions');

module.exports = {
  before: {
    all: [
      providerPermissions({
        rest: {
          // Only users/find method can accessible through rest provider
          users: ['find']
          // Services omitted won't be accessible by that provider
        },
        socketio: {
          // Users get and find only available methods
          users: ['get', 'find'],
          // All the methods of the posts service without 'update'
          posts: ['get', 'find', 'create', 'patch', 'remove'],
          comments: [], // All the methods of the comments service
        },
        // Providers omitted won't be allowed
      }),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
```

And the expected behavior will be:

```javascript
const app = require('./app.js')

// throws Forbidden('Provider "custom" not allowed.')
app.service('users').find({ provider: 'custom' })
// works ok
app.service('users').create(data, { provider: 'socketio' })
app.service('users').find({ query: {}, provider: 'socketio' })
app.service('users').find({ query: {}, provider: 'rest' })
// throws Forbidden('Provider "rest" not allowed to access method "find" of service "posts")
app.service('posts').find({ query: {}, provider: 'rest' })
```

## Author

- Fabián Souto <[fab.souto@gmail.com](mailto:fab.souto@gmail.com)>
