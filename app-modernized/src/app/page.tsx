import { Navigation } from '@/components/Navigation';

export default function HomePage() {
  return (
    <>
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to the JWT Auth Example
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This is a modernized version of the React Redux JWT authentication example. The
            application demonstrates secure authentication using JSON Web Tokens with a modern React
            stack including Next.js, TypeScript, and Tailwind CSS.
          </p>
          <div className="mt-8 space-x-4">
            <a
              href="/login"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Login
            </a>
            <a
              href="/protected"
              className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              View Protected Content
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
