module.exports = ({ env }) => {
  console.log('NODE_ENV:', env('NODE_ENV'));
  console.log('SSL config will be:', env('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false);
  
  return {
    connection: {
      client: 'postgres',
      connection: {
        connectionString: env('DATABASE_URL'),
        ssl: env('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      },
      debug: false,
    },
  };
};