const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })

module.exports = {
  apps: [
    {
      name: 'rolla',
      script: '.output/server/index.mjs',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: process.env.NUXT_PORT || 10060,
        NUXT_PORT: process.env.NUXT_PORT || 10060,
        ...process.env
      }
    }
  ]
}
