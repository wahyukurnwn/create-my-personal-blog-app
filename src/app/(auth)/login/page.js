"use client";
import { Button, Input, Alert } from "@heroui/react";
import { useActionState } from "react";
import Link from "next/link";
import doLoginAction from "./action";
import { OauthButton } from "../_components/oauthButton";

export default function Page() {
  const [state, formAction, isPending] = useActionState(doLoginAction, null);

  return (
    <main className="space-y-6">
      <section className="text-center">
        <h3 className="font-semibold text-lg">Login</h3>
        <p>Sign in to continue</p>
      </section>

      <form action={formAction} className="space-y-6">
        <Input type="email" name="email" placeholder="Input your Email" />
        <Input type="password" name="password" placeholder="Input your Password" />
        <Button type="submit" isLoading={isPending} color="primary" fullWidth>
          Login
        </Button>

        {state?.status !== undefined && (
          <div className="text-center flex items-center justify-center w-full">
            <Alert color={state.status ? "success" : "danger"} description={state?.message} />
          </div>
        )}
      </form>

      <OauthButton />

      <section className="text-center">
        <p>
          Don&apos;t have an account ? <Link href="/register">Register</Link>
        </p>
      </section>
    </main>
  );
}
