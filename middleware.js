import { NextResponse } from 'next/server';
import moment from 'moment-timezone';

// Keeps track of individual users' requests
const idToRequestCount = new Map();
const rateLimiter = {
  windowStart: Date.now(),
  windowSize: 10000, // 10 seconds
  maxRequests: 20,
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

// Function to convert all date strings in the response body to IST
const convertResponseDatesToIST = async (response) => {
  const clonedResponse = response.clone();
  let body;

  try {
    body = await clonedResponse.json();
  } catch (error) {
    return response;
  }

  convertDatesToIST(body);

  const modifiedResponse = new NextResponse(JSON.stringify(body), {
    status: response.status,
    headers: {
      ...response.headers,
      'Content-Type': 'application/json',
    },
  });

  return modifiedResponse;
};

export async function middleware(request) {
  const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
  const isRateLimited = limit(ip);

  if (isRateLimited) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Rate limit exceeded. Please try again in 5 minutes.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Clone the request to modify the body
  const clonedRequest = request.clone();

  // Parse the request body
  let body;
  try {
    body = await clonedRequest.json();
  } catch (error) {
    return NextResponse.next();
  }

  // Convert dates to IST
  convertDatesToIST(body);

  // Create a new request with the modified body
  const modifiedRequest = new Request(clonedRequest, {
    body: JSON.stringify(body),
    headers: clonedRequest.headers,
    method: clonedRequest.method,
  });

  // Process the response
  const response = await NextResponse.next(modifiedRequest);

  // Convert response dates to IST
  const modifiedResponse = await convertResponseDatesToIST(response);

  return modifiedResponse;
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
