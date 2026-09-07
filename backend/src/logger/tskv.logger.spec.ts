import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let stdoutWriteSpy: jest.SpyInstance;
  let stderrWriteSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    stdoutWriteSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
    stderrWriteSpy = jest
      .spyOn(process.stderr, 'write')
      .mockImplementation(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('форматирует сообщение в TSKV-формат', () => {
      const result = logger.formatMessage('log', 'Hello');

      expect(result).toBe('level=log\tmessage=Hello\n');
    });

    it('включает дополнительные параметры как строку', () => {
      const result = logger.formatMessage('error', 'Failed', ['detail']);

      expect(result).toBe(
        'level=error\tmessage=Failed\toptionalParams=["detail"]\n',
      );
    });

    it('преобразует все значения в строки', () => {
      const result = logger.formatMessage('log', 42);

      expect(result).toBe('level=log\tmessage=42\n');
    });
  });

  describe('log', () => {
    it('выводит TSKV-строку в stdout', () => {
      logger.log('Test message');

      expect(stdoutWriteSpy).toHaveBeenCalledWith(
        'level=log\tmessage=Test message\n',
      );
    });
  });

  describe('error', () => {
    it('выводит TSKV-строку в stderr', () => {
      logger.error('Error message');

      expect(stderrWriteSpy).toHaveBeenCalledWith(
        'level=error\tmessage=Error message\n',
      );
    });
  });

  describe('warn', () => {
    it('выводит TSKV-строку в stderr', () => {
      logger.warn('Warning');

      expect(stderrWriteSpy).toHaveBeenCalledWith(
        'level=warn\tmessage=Warning\n',
      );
    });
  });

  describe('debug', () => {
    it('выводит TSKV-строку в stdout', () => {
      logger.debug('Debug info');

      expect(stdoutWriteSpy).toHaveBeenCalledWith(
        'level=debug\tmessage=Debug info\n',
      );
    });
  });

  describe('verbose', () => {
    it('выводит TSKV-строку в stdout', () => {
      logger.verbose('Verbose info');

      expect(stdoutWriteSpy).toHaveBeenCalledWith(
        'level=verbose\tmessage=Verbose info\n',
      );
    });
  });
});
