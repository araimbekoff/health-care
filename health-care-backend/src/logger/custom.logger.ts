import { LoggerService } from '@nestjs/common';

const getCallerInfo = () => {
  const err = new Error();
  const caller_line = err.stack.split('\n')[3];
  const index = caller_line.indexOf('at ');
  const file = caller_line.slice(index + 2, caller_line.length).split(':');
  return [file[1], file[2]].join(':');
};

export class CustomLogger implements LoggerService {
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  private formatMessage = (message: any, context?: string): string => {
    const callerInfo = getCallerInfo();
    const formattedContext = context || this.context;
    return `[${callerInfo}] ${formattedContext ? `[${formattedContext}] ` : ''}${message}`;
  };

  log = (message: any, context?: string) => {
    console.log(this.formatMessage(message, context));
  };

  error = (message: any, stack?: string, context?: string) => {
    console.error(this.formatMessage(message, context));
    if (stack) {
      console.error(stack);
    }
  };

  warn = (message: any, context?: string) => {
    console.warn(this.formatMessage(message, context));
  };

  debug = (message: any, context?: string) => {
    console.debug(this.formatMessage(message, context));
  };

  verbose = (message: any, context?: string) => {
    console.log(this.formatMessage(message, context));
  };
}
