
export default {
  keys: '1682305972817_7460',
  koa: {
    port: 7001,
  },
  jwt: {
    secret: 'task123456789',
    expiresIn: '1d',
  },
  typeorm: {
    dataSource: {
      default: {
        type: process.env.DB_TYPE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        synchronize: true,
        logging: false,
        entities: ['**/entity/*.entity{.ts,.js}'],
      },
    },
  },
  oss: {
    // normal oss bucket
    client: {
      accessKeyId: process.env.OSS_ACCESSKEYID,
      accessKeySecret: process.env.OSS_ACCESSKEYSECRET,
      bucket: process.env.OSS_BUCKET,
      endpoint: process.env.OSS_ENDPOINT,
      timeout: '60s',
    },
  },
  upload: {
    // mode: UploadMode, 默认为file，即上传到服务器临时目录，可以配置为 stream
    mode: 'file',
    // fileSize: string, 最大上传文件大小，默认为 10mb
    fileSize: '10mb',
    // cleanTimeout: number，上传的文件在临时目录中多久之后自动删除，默认为 5 分钟
    cleanTimeout: 5 * 60 * 1000,
    // base64: boolean，设置原始body是否是base64格式，默认为false，一般用于腾讯云的兼容
    base64: false,
    whitelist: [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.bmp',
      '.wbmp',
      '.webp',
      '.tif',
      '.psd',
      '.svg',
      '.js',
      '.jsx',
      '.json',
      '.css',
      '.less',
      '.html',
      '.htm',
      '.xml',
      '.pdf',
      '.zip',
      '.gz',
      '.tgz',
      '.gzip',
      '.mp3',
      '.mp4',
      '.avi',
      '.map',
      ".npy"
    ],
    prefix: process.env.UPLOAD_PREFIX
  },
}
