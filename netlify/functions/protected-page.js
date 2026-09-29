const basicAuth = (req) => {
  const authHeader = req.headers.get('authorization') || '';
  if (!authHeader.startsWith('Basic ')) {
    return { ok: false };
  }
  const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf8');
  const [user, pass] = decoded.split(':');
  return { ok: user === 'vpn-appendix' && pass === 'StrongPass2026', user };
};

export default async (request, context) => {
  const { ok, user } = basicAuth(request);
  if (!ok) {
    return new Response('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="VPN Appendix"',
        'Content-Type': 'text/plain',
      },
    });
  }

  const res = await fetch(new URL('/', request.url));
  const text = await res.text();
  return new Response(text, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};
