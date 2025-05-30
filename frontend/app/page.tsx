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
      <main className="flex flex-col items-center justify-center h-screen p-10">
        <a href="/auth/login?screen_hint=signup">
          <Button>Sign up</Button>
        </a>
        <a href="/auth/login">
          <Button>Log in</Button>
        </a>
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