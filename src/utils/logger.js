/**
 * Logger Utility
 * Provides consistent logging across the application
 */

const logLevels = {
  DEBUG: '🔍 DEBUG',
  INFO: 'ℹ️  INFO',
  SUCCESS: '✅ SUCCESS',
  WARNING: '⚠️  WARNING',
  ERROR: '❌ ERROR'
};

class Logger {
  constructor(module) {
    this.module = module;
  }

  debug(message, data = null) {
    console.log(`${logLevels.DEBUG} [${this.module}]`, message, data || '');
  }

  info(message, data = null) {
    console.log(`${logLevels.INFO} [${this.module}]`, message, data || '');
  }

  success(message, data = null) {
    console.log(`${logLevels.SUCCESS} [${this.module}]`, message, data || '');
  }

  warn(message, data = null) {
    console.warn(`${logLevels.WARNING} [${this.module}]`, message, data || '');
  }

  error(message, error = null) {
    console.error(`${logLevels.ERROR} [${this.module}]`, message, error?.message || error || '');
  }

  divider() {
    console.log('─'.repeat(60));
  }
}

module.exports = Logger;
