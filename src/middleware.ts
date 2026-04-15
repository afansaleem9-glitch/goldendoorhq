import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// All routes are currently public while Clerk keys are being configured.
// Once real Clerk API keys are added to Vercel env vars, uncomment the
// auth.protect() block below to enforce authentication.
const isPublicRoute = createRouteMatcher([
  '/(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  // TODO: Re-enable auth once Clerk keys are configured on Vercel
  // if (!isPublicRoute(request)) {
  //   await auth.protect();
  // }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
