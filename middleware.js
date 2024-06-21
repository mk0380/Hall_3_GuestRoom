import { NextResponse } from 'next/server';
import { rate_limit_msg, rate_limit_request, rate_limit_time } from './important_data/important_data';

// sliding window concept

// Keeps track of individual users' requests
const idToRequestCount = new Map();
const rateLimiter = {
  windowStart: Date.now(),
  windowSize: rate_limit_time, // time
  maxRequests: rate_limit_request, // number of maximum request in the given period of time possible
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
      JSON.stringify({ success:false, message: rate_limit_msg }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*', 
};
