// File: middleware.js
// Folder: /rwtnews

export function middleware(request) {
  const url = request.nextUrl.clone();
  if (url.pathname === '/community') {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/community',
};