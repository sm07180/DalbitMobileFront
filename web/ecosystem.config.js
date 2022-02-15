module.exports = {
  apps: [
    {
      name: "dalbit",
      script: "server.js",
      instances: 4,
      exec_mode: 'cluster',
      autorestart: true,
      watch : false,
      listen_timeout: 5000,
      kill_timeout: 5000,
      max_memory_restart: '450M',
      error_file: "NULL",
      out_file: "NULL",
      //log_date_format: "YYYY-MM-DD HH:mm:ss",
    }
  ]
};
