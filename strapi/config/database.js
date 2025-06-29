module.exports = ({ env }) => {
  const databaseUrl = new URL(env('DATABASE_URL'));
  
  return {
    connection: {
      client: 'postgres',
      connection: {
        host: databaseUrl.hostname,
        port: databaseUrl.port,
        database: databaseUrl.pathname.slice(1),
        user: databaseUrl.username,
        password: databaseUrl.password,
        ssl: env('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      },
      debug: false,
    },
  };
};