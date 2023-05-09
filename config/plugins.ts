module.exports = () => {
  return {
    ckeditor: true,
    'repositories': {
      enabled: true,
      resolve: './src/plugins/repositories'
    },
    email: {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: 'localhost',
          port: 1025,
          ignoreTLS: true,
        },
      },
    },
  }
}
