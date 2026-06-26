module.exports = {
  apps: [{
    script: 'npm run start',
    name: 'Satyam-Admin',
    watch: false,
    env: {
      NODE_ENV: 'production'
    }
  }],

  deploy: {
    production: {
      user: process.env.SSH_USERNAME || 'SSH_USERNAME',
      host: process.env.SSH_HOSTMACHINE || 'SSH_HOSTMACHINE',
      ref: process.env.GIT_REF || 'origin/main',
      repo: process.env.GIT_REPOSITORY || 'GIT_REPOSITORY',
      path: process.env.DESTINATION_PATH || '/var/www/satyam-admin',
      'pre-deploy-local': '',
      'post-deploy': 'npm install --production=false && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
}
