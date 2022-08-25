const dev = process.env.NODE_ENV !== 'production';

export const config = dev ? 'http://localhost:3000' : 'https://moneymanager.preview.damar.dev';
// export const config = dev ? 'http://localhost:3000' : 'http://localhost:3000';