import { SignUp } from "@clerk/remix";

export default function SignUpPage() {
  return (
    <div className="flex h-screen justify-center items-center">
      <SignUp />
    </div>
  );
}
