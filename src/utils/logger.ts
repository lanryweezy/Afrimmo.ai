// Logger utility for the application
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context?: Record<string, any>;
}

class Logger {
  private static readonly levels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  private static readonly currentLogLevel = this.levels[process.env.REACT_APP_LOG_LEVEL || 'info'];

  private static formatLog(entry: LogEntry): string {
    const { timestamp, level, message, context } = entry;
    const contextStr = context ? `\nContext: ${JSON.stringify(context, null, 2)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
  }

  static debug(message: string, context?: Record<string, any>): void {
    if (this.levels.debug >= this.currentLogLevel) {
      const entry: LogEntry = { timestamp: new Date().toISOString(), level: 'debug', message, context };
      console.debug(this.formatLog(entry));
    }
  }

  static info(message: string, context?: Record<string, any>): void {
    if (this.levels.info >= this.currentLogLevel) {
      const entry: LogEntry = { timestamp: new Date().toISOString(), level: 'info', message, context };
      console.info(this.formatLog(entry));
    }
  }

  static warn(message: string, context?: Record<string, any>): void {
    if (this.levels.warn >= this.currentLogLevel) {
      const entry: LogEntry = { timestamp: new Date().toISOString(), level: 'warn', message, context };
      console.warn(this.formatLog(entry));
    }
  }

  static error(message: string, error?: Error | string, context?: Record<string, any>): void {
    if (this.levels.error >= this.currentLogLevel) {
      const errorMessage = typeof error === 'string' ? error : error?.message || '';
      const stackTrace = typeof error !== 'string' ? error?.stack : undefined;
      
      const entry: LogEntry = { 
        timestamp: new Date().toISOString(), 
        level: 'error', 
        message: `${message}${errorMessage ? ` - ${errorMessage}` : ''}`, 
        context: { ...context, stackTrace } 
      };
      
      console.error(this.formatLog(entry));
      
      // In production, you might want to send this to an external logging service
      if (process.env.NODE_ENV === 'production') {
        this.sendToExternalLogger(entry);
      }
    }
  }

  private static sendToExternalLogger(entry: LogEntry): void {
    // In a real application, this would send logs to an external service like Sentry, LogRocket, etc.
    // For now, we'll just log to console as a placeholder
    console.log('Sending error to external logger:', entry);
  }
}

export default Logger;