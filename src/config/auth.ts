export default {
  jwt: {
    secret: (process.env.APP_SECRET as string) ?? 'secret',
    expiresIn: '1d',
  },
};
