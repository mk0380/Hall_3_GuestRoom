import { NextResponse } from 'next/server';

// sliding window concept

// Keeps track of individual users' requests
const idToRequestCount = new Map();
const rateLimiter = {
  windowStart: Date.now(),
  windowSize: 10000, // 10 seconds
  maxRequests: 10,
};

const limit = (ip) => {
  const now = Date.now();
  const isNewWindow = now - rateLimiter.windowStart > rateLimiter.windowSize;
  if (isNewWindow) {
    rateLimiter.windowStart = now;
    idToRequestCount.clear(); 
  }

  const currentRequestCount = idToRequestCount.get(ip) ?? 0;
  if (currentRequestCount >= rateLimiter.maxRequests) return true;
  idToRequestCount.set(ip, currentRequestCount + 1);

  return false;
};

export function middleware(request) {
  const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
  const isRateLimited = limit(ip);

  if (isRateLimited) {
    return new NextResponse(
      JSON.stringify({ success:false, message: 'Rate limit exceeded. Please try again in 5 minutes.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*', 
};
