import { login } from '../api/auth/login.js';
import { save, load, remove } from '../storage/index.js';

class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock();

const validLoginCredentials = {
  email: 'tomhardy@noroff.no',
  password: '1234512345',
};

function fetchSuccess(status = 200) {
  return Promise.resolve({
    ok: true,
    status,
    json: () => Promise.resolve(validLoginCredentials),
  });
}

describe('Login', () => {
  it('logs user in with valid credentials', async () => {
    global.fetch = jest.fn(() => fetchSuccess());
    const item = await login();
    expect(item).toEqual(validLoginCredentials);
  });
});

describe('Data in localStorage', () => {
  it('saves array to localStorage', () => {
    const key = 'token';
    const value = ['email', 'password'];
    const serializedValue = JSON.stringify(value);
    save(key, value);
    expect(localStorage.getItem(key)).toEqual(serializedValue);
  });

  it('loads array from localStorage', () => {
    const key = 'token';
    const value = ['email', 'password'];
    save(key, value);
    expect(load(key)).toEqual(value);
  });
});

describe('Logs out user by removing data from localStorage', () => {
  it('removes array from storage', () => {
    const key = 'token';
    const value = ['email', 'password'];
    save(key, value);
    expect(load(key)).toEqual(value);
    remove(key);
    expect(load(key)).toEqual(null);
  });
});
