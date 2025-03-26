export const isServer = typeof window === 'undefined';

export const isClient = typeof window !== 'undefined';

export const isDev = process.env.NODE_ENV === 'development';

export const isProd = process.env.NODE_ENV === 'production';


export const checkLoginInServer = async () => {
  if (isServer) {
    try {
      const headers = await import('next/headers');
      const [_cookie, _token] = await Promise.all([
        (await headers.headers()).get('cookie'),
        (await headers.cookies()).get('news-token')?.value ?? null,
      ]);
      return !!(_cookie && _token);
    } catch {
      return false;
    }
  }
  return false;
}
