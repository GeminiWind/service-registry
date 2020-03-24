import { Etcd3 } from 'etcd3';
import * as R from 'ramda';
import { InternalError } from 'json-api-error';

class ServiceRegistryImplementedByEtcd {
  constructor({
    host,
    env,
  }) {
    const client = new Etcd3({
      hosts: host || '127.0.0.1:2379',
    });

    this.ns = client.namespace(env || 'dev');
  }

  async get({ name }) {
    let response;

    const get = R.pipeP(
      async key => await this.ns.get(key).string(), // eslint-disable-line no-return-await
      value => JSON.parse(value),
    );

    try {
      response = await get(name);
    } catch (error) {
      throw new InternalError(`Error in retrieving information of service: "${name}"`);
    }

    return response;
  }

  async register({
    name,
    endpoint,
    version,
  }) {
    try {
      await this.ns.put(name).value(JSON.stringify({
        name,
        endpoint,
        version,
      }));
    } catch (error) {
      throw new InternalError(`Error in registering service: "${name}"`);
    }

    return {
      name,
      endpoint,
      version,
    };
  }

  async unregister({ name }) {
    let response;

    try {
      response = await this.ns.delete().key(name);
    } catch (error) {
      throw new InternalError(`Error in unregistering service: "${name}"`);
    }

    const isDeleted = response.deleted === '1';

    return isDeleted;
  }
}

export default ServiceRegistryImplementedByEtcd;
