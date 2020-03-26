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

### register

> register(opts: Service): Service

`.register()` create a new service in service catalog

```javascript
import ServiceRegistryFactory from @hai.dinh/service-registry

const registry = ServiceRegistryFactory.create({
    driver: 'etcd',
    hosts: '127.0.0.1:2379',
    env: 'dev'
})


const response = await registry.register({
    id: 'storage-service',
    name: 'storage service',
    endpoint: 'http://storage-service:3001',
    category: 'core',
    version: '0.0.1'
})
```

**Parameter**
- **opts**: [Service](#service)

**Return** [Service](#service)

### unregister

> unregister(id: string): boolean

`.unregister()` delete the specified service in service catalog

```javascript
import ServiceRegistryFactory from @hai.dinh/service-registry

const registry = ServiceRegistryFactory.create({
    driver: 'etcd',
    hosts: '127.0.0.1:2379',
    env: 'dev'
})


const isDeleted = await registry.unregister('storage-service');

```
**Parameter**
- **id**: string

**Return** boolean

### get()

> get(id: string): Service 

`.get()` to retrieve the specified service in service catalog

```javascript
import ServiceRegistryFactory from @hai.dinh/service-registry

const registry = ServiceRegistryFactory.create({
    driver: 'etcd',
    hosts: '127.0.0.1:2379',
    env: 'dev'
})


const storageService = await registry.get('storage-service')
```

**Parameter**
- **id**: string

**Return** [Service](#service)

### list

> list(): []Service

`.list()` to retrieve service catalog

```javascript
import ServiceRegistryFactory from @hai.dinh/service-registry

const registry = ServiceRegistryFactory.create({
    driver: 'etcd',
    hosts: '127.0.0.1:2379',
    env: 'dev'
})


const services = await registry.list()
```


**Return** [][Service](#service)

## Interfaces

### Service

| Property | Description   |
|-----------|---------------|
| id                   | This is id of service, which is handled as identification for register, get or unregister service.<br /><br />Type: `string` |
| name                   | This is name of service, which should be readable.<br />For e.g: "storage service".<br /><br />Type: `string`
| category                   | The category of service. <br />For e.g: "security", "logging", "storage".<br /><br />Type: `string` 
| endpoint                   | The endpoint of service for other services can consume.<br />For e.g: "http://storage-service:3000".<br /><br />Type: `string` 
| version                   | The current version of service, which should be meet [semver](https://semver.org/).<br />For e.g: "1.0.0".<br /><br />Type: `string` 


## LICENSE

[MIT](https://github.com/GeminiWind/service-registry/blob/HEAD/LICENSE)