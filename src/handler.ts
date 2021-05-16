import serverless from 'serverless-http';
import app from './app';
import MongoConnection from './mongo-connection';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import logger from './logger';
import { getJsonSecret } from './utils/secret-utils'

const handlerAuto = serverless(app);

module.exports.handler = async (event: APIGatewayProxyEvent, context: Context) => {
  logger.info('--------------------request handling--------------------')
  const mongoConnection: MongoConnection = new MongoConnection(await getJsonSecret('MONGO_URL'));
  
  mongoConnection.connect(() => {
    app.listen(app.get('port'), (): void => {
      logger.info('\x1b[36m%s\x1b[0m', // eslint-disable-line
        `🌏 Express server started at http://localhost:${3000}`);
    });
  });
  return handlerAuto(event, context);
};
