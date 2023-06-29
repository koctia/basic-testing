import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('lodash', () => {
  const moduleLodash = jest.requireActual('lodash');

  return {
    ...moduleLodash,
    throttle: jest.fn((fn) => fn),
  };
});

describe('throttledGetDataFromApi', () => {
  const REQUEST_PATH = 'posts';

  test('should create instance with provided base url', async () => {
    const createInstance = jest.spyOn(axios, 'create');
    await throttledGetDataFromApi(REQUEST_PATH);
    expect(createInstance).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    // Write your test here
  });

  test('should return response data', async () => {
    // Write your test here
  });
});
