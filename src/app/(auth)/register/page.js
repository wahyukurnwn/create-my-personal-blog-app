"use client";
import { Button, Input, Alert } from "@heroui/react";
import { useActionState } from "react";
import doRegisterAction from "./action";
import Link from "next/link";
import { OauthButton } from "../_components/oauthButton";

export default function Page() {
  const [state, formAction, isPending] = useActionState(doRegisterAction, null);

  return (
    <main className="space-y-6">
      <section className="text-center">
        <h3 className="font-semibold text-lg">Register</h3>
        <p>Create an account to continue</p>
      </section>

      <form action={formAction} className="space-y-6">
        <Input name="name" placeholder="Input your name" />
        <Input type="email" name="email" placeholder="Input your Email" />
        <Input type="password" name="password" placeholder="Input your Password" />
        <Button type="submit" isLoading={isPending} color="primary" fullWidth>
          Register
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
          Have an account ? <Link href="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}
