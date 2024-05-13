import { SignIn } from "@clerk/remix";

export default function SignInPage() {
  return (
    <div className="flex h-screen justify-center items-center">
      <SignIn />
    </div>
  );
}
