const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');

console.log(`Starting server in ${process.env.NODE_ENV} mode`);
console.log(`Using MongoDB URI: ${config.MONGODB_URI}`);
console.log(`Listening on port ${config.PORT}`);

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
