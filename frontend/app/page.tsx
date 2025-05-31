"use client";

import Chat from "@/components/Chat";
import SettingsForm from "@/components/Settings";
import { Button } from "@/components/ui/button";
import { useUser } from "@auth0/nextjs-auth0";

export default function Page() {
  // Extract the user object and loading state from Auth0.
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  // If no user, show sign-up and login buttons.
  if (!user) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-sky-50 p-6">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 space-y-6 text-center">
          <h1 className="text-2xl font-semibold text-sky-700">Welcome</h1>
          <p className="text-gray-500">Get started by creating an account or logging in.</p>

          <div className="space-y-4">
            <a href="/auth/login?screen_hint=signup">
              <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 rounded-md shadow">
                Sign up
              </Button>
            </a>

            <a href="/auth/login">
              <Button className="w-full bg-white text-sky-600 border border-sky-500 hover:bg-sky-100 font-medium py-2 rounded-md shadow">
                Log in
              </Button>
            </a>
          </div>
        </div>
      </main>

    );
  }

  // If user exists, show a welcome message and logout button.
  return (
    <main className="w-full  flex flex-col items-center justify-center min-h-screen bg-sky-50 p-8">
      <div className="w-full bg-white shadow-xl rounded-2xl p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-sky-700 text-center">
          Welcome, {user.name}!
        </h1>

        <div>
          <SettingsForm />
        </div>

        <div className="text-center">
          <a href="/auth/logout">
            <Button className="bg-sky-500 hover:bg-sky-600 text-white font-medium px-4 py-2 rounded-md shadow">
              Log out
            </Button>
          </a>
        </div>
      </div>
    </main>
  );
}