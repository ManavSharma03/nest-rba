export default () => {
  return {
    port: parseInt(process.env.PORT || "3000", 10),
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || "5432", 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      name: process.env.DB_NAME || 'nestjs_db',
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'supersecretkey',
      expiresIn: '1h',
    },
  };
};
