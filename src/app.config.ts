export interface MongoDbConfig {
  username: string;
  password: string;
  dbName: string;
  uri: string;
}

export interface JwtConfig {
  secret: string;
  expiration: string;
  refreshTokenSecret: string;
  refreshTokenExpiration: string;
  resetPasswordTokenSecret: string;
  resetPasswordTokenExpiration: string;
}

export default () => ({
  mongodb: {
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    dbName: process.env.MONGO_DB_NAME,
    uri: process.env.MONGO_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION || '60m',
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    refreshTokenExpiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION || '15d',
    resetPasswordTokenSecret: process.env.JWT_RESET_PASSWORD_TOKEN_SECRET,
    resetPasswordTokenExpiration:
      process.env.JWT_RESET_PASSWORD_TOKEN_EXPIRATION || '30m',
  },
});
