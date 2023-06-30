import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';

describe('BankAccount', () => {
  const INITIAL_BALANCE = 100;
  const MORE_BALANCE = 888;
  const ADD_DEPOSIT = 128;
  const REMOVE_DEPOSIT = 10;
  const OTHER_BALANCE = 200;

  test('should create account with initial balance', () => {
    const account = getBankAccount(INITIAL_BALANCE);
    expect(account).toEqual({
      _balance: INITIAL_BALANCE,
    });
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(INITIAL_BALANCE);
    expect(() => account.withdraw(MORE_BALANCE)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const account = getBankAccount(INITIAL_BALANCE);
    const otherAccount = getBankAccount(INITIAL_BALANCE + 1);
    expect(() => account.transfer(MORE_BALANCE, otherAccount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(INITIAL_BALANCE);
    expect(() => account.transfer(INITIAL_BALANCE, account)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const account = getBankAccount(INITIAL_BALANCE);
    account.deposit(ADD_DEPOSIT);
    const sum = INITIAL_BALANCE + ADD_DEPOSIT;
    expect(account.getBalance()).toEqual(sum);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(INITIAL_BALANCE);
    account.withdraw(REMOVE_DEPOSIT);
    const sum = INITIAL_BALANCE - REMOVE_DEPOSIT;
    expect(account.getBalance()).toEqual(sum);
  });

  test('should transfer money', () => {
    const account = getBankAccount(INITIAL_BALANCE);
    const otherAccount = getBankAccount(INITIAL_BALANCE + 1);
    account.transfer(REMOVE_DEPOSIT, otherAccount);
    expect(account.getBalance()).toEqual(INITIAL_BALANCE - REMOVE_DEPOSIT);
    expect(otherAccount.getBalance()).toEqual(
      INITIAL_BALANCE + 1 + REMOVE_DEPOSIT,
    );
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(INITIAL_BALANCE);
    const result = await account.fetchBalance();
    typeof result === 'number' && expect(typeof result).toEqual('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(INITIAL_BALANCE);
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(OTHER_BALANCE);
    await account.synchronizeBalance();
    expect(account.getBalance()).toEqual(OTHER_BALANCE);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(INITIAL_BALANCE);
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(null);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
