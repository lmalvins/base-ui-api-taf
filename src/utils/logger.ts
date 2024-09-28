import Logger from 'pino';

const logger = Logger({
  level: process.env.LOG_LEVEL || 'info', // Set log level from environment variable or default to 'info'
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true, // Colorize the logs for better readability in the console
      translateTime: 'yyyy-mm-dd HH:MM:ss.l o', // Add timestamp in readable format
    },
  },
});

// Export the configured logger
export default logger;
