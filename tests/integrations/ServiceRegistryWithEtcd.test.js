import ServiceRegistryFactory from '../../src/ServiceRegistryFactory';

describe('ServiceRegistryFactory with etcd driver', () => {
  const registry = ServiceRegistryFactory.create({
    driver: 'etcd',
    hosts: '127.0.0.1:2379',
    env: 'dev',
  });

  it('can register new service', async () => {
    const response = await registry.register({
      name: 'storage-service',
      endpoint: 'http://storage-service',
      version: '0.0.1',
    });

    expect(response).toEqual({
      name: 'storage-service',
      endpoint: 'http://storage-service',
      version: '0.0.1',
    });
  });

  it('can update service information if service is already registered', async () => {
    const response = await registry.register({
      name: 'storage-service',
      endpoint: 'http://storage-service:3000',
      version: '0.0.2',
    });

    expect(response).toEqual({
      name: 'storage-service',
      endpoint: 'http://storage-service:3000',
      version: '0.0.2',
    });
  });

  it('can get service information if service is already registered', async () => {
    const response = await registry.get({
      name: 'storage-service',
    });

    expect(response).toEqual({
      name: 'storage-service',
      endpoint: 'http://storage-service:3000',
      version: '0.0.2',
    });
  });

  it('return true for unregister operation if service is already registered', async () => {
    const response = await registry.unregister({
      name: 'storage-service',
    });

    expect(response).toBe(true);
  });

  it('return false for unregister operation if service is already registered', async () => {
    const response = await registry.unregister({
      name: 'not-registered-service',
    });

    expect(response).toBe(false);
  });
});
