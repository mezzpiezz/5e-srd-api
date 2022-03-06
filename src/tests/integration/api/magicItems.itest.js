const mongoose = require('mongoose');
const request = require('supertest');
const createApp = require('../../../server');
const { mongodbUri, redisClient } = require('../../../util');
let app;

afterEach(() => {
  jest.clearAllMocks();
});

beforeAll(async () => {
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  await mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });
  await redisClient.connect();
  app = await createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await redisClient.quit();
});

describe('/api/magic-items', () => {
  it('should list magic items', async () => {
    const res = await request(app).get('/api/magic-items');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
  });

  it('should hit the cache', async () => {
    await redisClient.del('/api/magic-items');
    const clientSet = jest.spyOn(redisClient, 'set');
    let res = await request(app).get('/api/magic-items');
    res = await request(app).get('/api/magic-items');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
    expect(clientSet).toHaveBeenCalledTimes(1);
  });

  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/magic-items');
      const name = indexRes.body.results[2].name;
      const res = await request(app).get(`/api/magic-items?name=${name}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/magic-items');
      const name = indexRes.body.results[2].name;
      const queryName = name.toLowerCase();
      const res = await request(app).get(`/api/magic-items?name=${queryName}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });
  });

  describe('/api/magic-items/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(app).get('/api/magic-items');
      const index = indexRes.body.results[0].index;
      const showRes = await request(app).get(`/api/magic-items/${index}`);
      expect(showRes.statusCode).toEqual(200);
      expect(showRes.body.index).toEqual(index);
    });

    describe('with an invalid index', () => {
      it('should return 404', async () => {
        const invalidIndex = 'invalid-index';
        const showRes = await request(app).get(`/api/magic-items/${invalidIndex}`);
        expect(showRes.statusCode).toEqual(404);
      });
    });
  });
});