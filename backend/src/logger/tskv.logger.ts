import { Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger {
  formatMessage(level: string, message: unknown, optionalParams: unknown[] = []) {
    const fields: Record<string, string> = {
      level,
      message: String(message),
    };

    if (optionalParams.length) {
      fields.optionalParams = JSON.stringify(optionalParams);
    }

    return (
      Object.entries(fields)
        .map(([key, value]) => `${key}=${value}`)
        .join('\t') + '\n'
    );
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    process.stdout.write(this.formatMessage('log', message, optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    process.stderr.write(this.formatMessage('error', message, optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    process.stderr.write(this.formatMessage('warn', message, optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    process.stdout.write(this.formatMessage('debug', message, optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]) {
    process.stdout.write(this.formatMessage('verbose', message, optionalParams));
  }
}
