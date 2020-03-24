import { NotImplementedError } from 'json-api-error';
import ServiceRegistryImplementedByEtcd from './ServiceRegistryImplementedByEtcd';

class ServiceRegistryFactory {
  static create(options) {
    let registry;

    switch (options.driver) {
      case 'etcd':
        registry = new ServiceRegistryImplementedByEtcd({
          host: options.host,
          env: options.env || 'dev',
        });
        break;

      default:
        throw new NotImplementedError('Your driver is not supported');
    }

    return registry;
  }
}

export default ServiceRegistryFactory;
