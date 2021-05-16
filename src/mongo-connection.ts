import mongoose, { ConnectionOptions } from 'mongoose';
import logger from './logger';

interface IOnConnectedCallback {
    (): void;
}
  

export default class MongoConnection {

    /** URL to access mongo */
    private readonly mongoUrl: string;

    private onConnectedCallback: IOnConnectedCallback;

    /** Mongo connection options to be passed Mongoose */
  private readonly mongoConnectionOptions: ConnectionOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  };
    
    constructor(mongoUrl: string) {
        this.mongoUrl = mongoUrl;
    }


    public startConnection = () => {
        logger.log({
          level: 'info',
          message: 'Connecting to MongoDB '
        });
        mongoose.connect(this.mongoUrl, this.mongoConnectionOptions).catch(() => { });
    }
    public connect(onConnectedCallback: IOnConnectedCallback) {
        this.onConnectedCallback = onConnectedCallback;
        this.startConnection();
    }
}