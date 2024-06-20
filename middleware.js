import { NextResponse } from 'next/server';
import moment from 'moment-timezone';

// Function to convert all date strings in the request body to IST
const convertDatesToIST = (body) => {
  if (typeof body === 'object' && body !== null) {
    for (const key in body) {
      if (body.hasOwnProperty(key)) {
        const value = body[key];
        if (typeof value === 'string' && !isNaN(Date.parse(value))) {
          body[key] = moment.tz(value, 'Asia/Kolkata').format("DD/MM/YYYY HH:mm:ss");
        } else if (typeof value === 'object') {
          convertDatesToIST(value); // Recursively convert dates in nested objects
        }
      }
    }
  }
};

export async function middleware(request) {
  // Rate limiting logic
  const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown';

  // Process the request body
  let body;
  if (request.method === 'POST' || request.method === 'PUT') {
    const clonedRequest = request.clone();
    try {
      body = await clonedRequest.json();
      convertDatesToIST(body);
      const modifiedRequest = new Request(request, {
        body: JSON.stringify(body),
        headers: request.headers,
        method: request.method,
      });
      return NextResponse.next(modifiedRequest);
    } catch (error) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};






// import { NextResponse } from 'next/server';

// // sliding window concept

// // Keeps track of individual users' requests
// const idToRequestCount = new Map();
// const rateLimiter = {
//   windowStart: Date.now(),
//   windowSize: 10000, // 10 seconds
//   maxRequests: 100,
// };

// const limit = (ip) => {
//   const now = Date.now();
//   const isNewWindow = now - rateLimiter.windowStart > rateLimiter.windowSize;
//   if (isNewWindow) {
//     rateLimiter.windowStart = now;
//     idToRequestCount.clear(); 
//   }

//   const currentRequestCount = idToRequestCount.get(ip) ?? 0;
//   if (currentRequestCount >= rateLimiter.maxRequests) return true;
//   idToRequestCount.set(ip, currentRequestCount + 1);

//   return false;
// };

// export function middleware(request) {
//   const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
//   const isRateLimited = limit(ip);

//   if (isRateLimited) {
//     return new NextResponse(
//       JSON.stringify({ success:false, message: 'Rate limit exceeded. Please try again in 5 minutes.' }),
//       { status: 429, headers: { 'Content-Type': 'application/json' } }
//     );
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: '/api/:path*', 
// };
