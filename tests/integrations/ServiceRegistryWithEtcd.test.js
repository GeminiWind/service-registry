import { NotFoundError } from 'json-api-error';
import ServiceRegistryFactory from '../../src/ServiceRegistryFactory';

describe('ServiceRegistryFactory with etcd driver', () => {
  const registry = ServiceRegistryFactory.create({
    driver: 'etcd',
    hosts: '127.0.0.1:2379',
    env: 'dev',
  });

  it('can register new service', async () => {
    const response = await registry.register({
      id: 'storage-service',
      name: 'storage service',
      category: 'core',
      endpoint: 'http://storage-service',
      version: '0.0.1',
    });

    expect(response).toEqual({
      id: 'storage-service',
      name: 'storage service',
      category: 'core',
      endpoint: 'http://storage-service',
      version: '0.0.1',
    });
  });

  it('can update service information if service is already registered', async () => {
    const response = await registry.register({
      id: 'storage-service',
      name: 'storage service',
      category: 'core',
      endpoint: 'http://storage-service:3000',
      version: '0.0.2',
    });

    expect(response).toEqual({
      id: 'storage-service',
      name: 'storage service',
      category: 'core',
      endpoint: 'http://storage-service:3000',
      version: '0.0.2',
    });
  });

  it('can get service information if service is already registered', async () => {
    const response = await registry.get('storage-service');

    expect(response).toEqual({
      id: 'storage-service',
      name: 'storage service',
      category: 'core',
      endpoint: 'http://storage-service:3000',
      version: '0.0.2',
    });
  });

  it('throw NotFoundError in getting service information if service is not registered', async () => {
    let error;

    try {
      await registry.get('not-exist-service');
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(NotFoundError);
  });

  it('can list service catalog with more than 1 service has been registered', async () => {
    const response = await registry.list();

    expect(response).toStrictEqual([{
      id: 'storage-service',
      name: 'storage service',
      category: 'core',
      endpoint: 'http://storage-service:3000',
      version: '0.0.2',
    }]);
  });

  it('return true for unregister operation if service is already registered', async () => {
    const response = await registry.unregister('storage-service');

    expect(response).toBe(true);
  });

  it('return false for unregister operation if service is already registered', async () => {
    const response = await registry.unregister('not-registered-service');

    expect(response).toBe(false);
  });

  it('can list service catalog with no service in catalog', async () => {
    const response = await registry.list();

    expect(response).toStrictEqual([]);
  });
});
