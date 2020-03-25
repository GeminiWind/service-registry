import { Etcd3 } from 'etcd3';
import * as R from 'ramda';
import { InternalError, NotFoundError } from 'json-api-error';

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

  async get(id) {
    const response = await R.pipeP(
      async (key) => {
        let next;

        try {
          next = await this.ns.get(key).json();
        } catch (e) {
          throw new InternalError('Error in getting service information');
        }

        return next;
      },
      (next) => {
        if (!next) {
          throw new NotFoundError(`Service with id: ${id} has not been register.`);
        }

        return next;
      },
    )(id);

    return response;
  }

  async list() {
    const response = await R.pipeP(
      async () => {
        let next;

        try {
          next = await this.ns.getAll().json();
        } catch (e) {
          throw new InternalError('Error in getting service information');
        }

        return next;
      },
      (next) => {
        if (!next) {
          return {};
        }

        return next;
      },
      R.values,
    )();

    return response;
  }

  async register({
    id,
    name,
    category = '',
    endpoint,
    version,
  }) {
    try {
      await this.ns.put(id).value(JSON.stringify({
        id,
        name,
        category,
        endpoint,
        version,
      }));
    } catch (error) {
      throw new InternalError(`Error in registering service: "${name}"`);
    }

    return {
      id,
      name,
      category,
      endpoint,
      version,
    };
  }

  async unregister(id) {
    let response;

    try {
      response = await this.ns.delete().key(id);
    } catch (error) {
      throw new InternalError(`Error in unregistering service with id: "${id}"`);
    }

    const isDeleted = response.deleted === '1';

    return isDeleted;
  }
}

export default ServiceRegistryImplementedByEtcd;
