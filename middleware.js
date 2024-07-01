import { NextResponse } from 'next/server';
import { rate_limit_msg, rate_limit_request, rate_limit_time } from './important_data/important_data';

// Keeps track of individual users' requests
const idToRequestCount = new Map();
const rateLimiter = {
  windowStart: Date.now(),
  windowSize: rate_limit_time, // time in ms
  maxRequests: rate_limit_request, // number of maximum requests in the given period of time
};

const limit = (ip) => {
  const now = Date.now();
  const isNewWindow = now - rateLimiter.windowStart >= rateLimiter.windowSize;

  // console.log(`IP: ${ip}, Current Time: ${now}, Window Start: ${rateLimiter.windowStart}, Is New Window: ${isNewWindow}`);

  if (isNewWindow) {
    rateLimiter.windowStart = now;
    idToRequestCount.clear();
    console.log(`New window started. Resetting request counts.`);
  }

  const currentRequestCount = idToRequestCount.get(ip) ?? 0;
  // console.log(`IP: ${ip}, Current Request Count: ${currentRequestCount}, Max Requests: ${rateLimiter.maxRequests}`);

  if (currentRequestCount >= rateLimiter.maxRequests) {
    // console.log(`IP: ${ip} is rate limited.`);
    return true;
  }

  idToRequestCount.set(ip, currentRequestCount + 1);
  // console.log(`IP: ${ip}, Updated Request Count: ${idToRequestCount.get(ip)}`);
  return false;
};

export function middleware(request) {
  const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
  // console.log(`Incoming request from IP: ${ip}`);

  const isRateLimited = limit(ip);

  if (isRateLimited) {
    // console.log('Rate limit exceeded. Returning 429 response.');
    return new NextResponse(
      JSON.stringify({ success: false, message: rate_limit_msg }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
