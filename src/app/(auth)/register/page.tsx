import { registerAction } from './actions';

export default function RegisterPage() {
  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <form action={registerAction} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Create account</h1>

        <div className="space-y-1">
          <label className="text-sm">Name</label>
          <input name="name" className="w-full rounded border p-2" required />
        </div>

        <div className="space-y-1">
          <label className="text-sm">Email</label>
          <input name="email" type="email" className="w-full rounded border p-2" required />
        </div>

        <div className="space-y-1">
          <label className="text-sm">Password</label>
          <input name="password" type="password" className="w-full rounded border p-2" required />
        </div>

        <button type="submit" className="w-full rounded bg-black p-2 text-white">
          Sign up
        </button>
      </form>
    </main>
  );
}
