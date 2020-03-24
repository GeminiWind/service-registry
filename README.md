# Service Registry

![CI](https://github.com/GeminiWind/service-registry/workflows/CI/badge.svg?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A client-side service discovery for microservice using `etcd`.

## Installation
The easiest way to install `service-registry` is using NPM. If you have Node.js installed, it is most likely that you have NPM installed as well.

```
$ npm install @hai.dinh/service-registry
```

## API

### register(options)

```javascript
import ServiceRegistryFactory from @hai.dinh/service-registry

const registry = new ServiceRegistryFactory.create({
    driver: 'etcd',
    hosts: '127.0.0.1:2379',
    env: 'dev'
})


registry.register({
    name: 'storage-service',
    endpoint: 'http://storage-service:3001',
    version: '0.0.1'
})
```

| options  | Description  |  Type | Required  |
|---|---|---|---|
| name | Name of the service you want to register | _string_ | yes
| endpoint | Endpoint of the service, which is used to consume by other provides | _string_ | yes
| version | Current version of the service, which must be follow by __*semver*__ specification | _string_ | yes

### unregister(options)

```javascript
import ServiceRegistryFactory from @hai.dinh/service-registry

const registry = new ServiceRegistryFactory.create({
    driver: 'etcd',
    hosts: '127.0.0.1:2379',
    env: 'dev'
})


registry.unregister({
    name: 'storage-service',
})
```

| options  | Description  |  Type | Required  |
|---|---|---|---|
|name | Name of the service you want to unregister | _string_ | yes

### get

```javascript
import ServiceRegistryFactory from @hai.dinh/service-registry

const registry = new ServiceRegistryFactory.create({
    driver: 'etcd',
    hosts: '127.0.0.1:2379',
    env: 'dev'
})


registry.get({
    name: 'storage-service',
})
```

| options  | Description  |  Type | Required  |
|---|---|---|---|
| name | Name of the service you want to get information | _string_ | yes