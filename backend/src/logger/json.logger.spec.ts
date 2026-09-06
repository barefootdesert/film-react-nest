import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('форматирует сообщение в JSON с уровнем log', () => {
      const result = logger.formatMessage('log', 'Hello');

      expect(JSON.parse(result)).toEqual({
        level: 'log',
        message: 'Hello',
        optionalParams: [],
      });
    });

    it('включает дополнительные параметры в JSON', () => {
      const result = logger.formatMessage('error', 'Failed', ['detail']);

      expect(JSON.parse(result)).toEqual({
        level: 'error',
        message: 'Failed',
        optionalParams: ['detail'],
      });
    });
  });

  describe('log', () => {
    it('выводит JSON-строку через console.log', () => {
      logger.log('Test message');

      expect(consoleLogSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'log',
          message: 'Test message',
          optionalParams: [],
        }),
      );
    });
  });

  describe('error', () => {
    it('выводит JSON-строку через console.error', () => {
      logger.error('Error message', { code: 500 });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'error',
          message: 'Error message',
          optionalParams: [{ code: 500 }],
        }),
      );
    });
  });

  describe('warn', () => {
    it('выводит JSON-строку через console.warn', () => {
      logger.warn('Warning');

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'warn',
          message: 'Warning',
          optionalParams: [],
        }),
      );
    });
  });

  describe('debug', () => {
    it('выводит JSON-строку через console.debug', () => {
      logger.debug('Debug info');

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'debug',
          message: 'Debug info',
          optionalParams: [],
        }),
      );
    });
  });

  describe('verbose', () => {
    it('выводит JSON-строку через console.log', () => {
      logger.verbose('Verbose info');

      expect(consoleLogSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'verbose',
          message: 'Verbose info',
          optionalParams: [],
        }),
      );
    });
  });
});
