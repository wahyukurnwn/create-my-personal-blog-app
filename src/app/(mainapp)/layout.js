import { prisma } from "@/utils/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@heroui/react";

export default async function Layout({ children }) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  // isSessionId?
  if (!sessionId) {
    redirect("/login");
  }

  const checkedSession = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: true,
    },
  });

  if (!checkedSession) {
    redirect("/login");
  }

  async function doLogoutAction() {
    "use server";
    const cookieStore = await cookies();
    cookieStore.delete("sessionId");

    await prisma.session.delete({
      where: {
        id: sessionId,
      },
    });
  }

  return (
    <main className="space-y-6 p-6 mx-auto">
      <header className="flex justify-between items-center bg-slate-200 p-6 rounded-md">
        <div>My Blogs</div>
        <div className="flex flex-col items-center gap-3">
          <div>{checkedSession.user.name}</div>
          <form action={doLogoutAction}>
            <Button type="submit" size="sm" color="secondary">
              Logout
            </Button>
          </form>
        </div>
      </header>
      <div>{children}</div>
    </main>
  );
}
