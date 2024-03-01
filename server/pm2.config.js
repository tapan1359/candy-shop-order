module.exports = {
    apps : [{
      name: 'candyStore',
      script: 'express.js', // your main file
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      }
    }],
  };
  