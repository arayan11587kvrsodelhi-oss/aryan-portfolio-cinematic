export async function GET() {
  return new Response('google-site-verification: google42d7c263f2a29e3a.html', {
    headers: { 'Content-Type': 'text/html' },
  });
}
