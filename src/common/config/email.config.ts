import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  smtp: {
    host: process.env.SMTP_HOST || 'localhost',
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  defaults: {
    fromName: process.env.APP_NAME || 'MyApp',
    fromEmail: `noreply@${process.env.APP_URL || 'localhost'}`,
  },
}));
