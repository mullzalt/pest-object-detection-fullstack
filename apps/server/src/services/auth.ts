import type { Context } from "hono";
import type { LuciaContext } from "../lib/lucia-context";
import type { SignIn, SignUp } from "@hama/data-access";
import { db } from "@hama/database";
import { ConflictError, ForbiddenError } from "../utils/http-error";
import { lucia } from "../lib/lucia";
import { users } from "@hama/database/schemas";

export const authService = <TContext extends Context<LuciaContext>>(
  c: TContext,
) => {
  const signIn = async ({ email, password }: SignIn) => {
    const user = await db.query.users.findFirst({
      where: (col, { eq }) => eq(col.email, email),
    });

    if (!user) throw new ForbiddenError("Wrong email or password");

    const isPasswordValid = await Bun.password.verify(
      password,
      user.passwordHashed,
    );

    if (!isPasswordValid) throw new ForbiddenError("Wrong email or password");

    const newSession = await lucia.createSession(user.id, {
      email: user.email,
    });
    const sessionCookie = lucia.createSessionCookie(newSession.id).serialize();
    c.header("Set-Cookie", sessionCookie, { append: true });
  };

  const signOut = async () => {
    const session = c.get("session");
    if (session) {
      await lucia.invalidateSession(session.id);
    }

    c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize());
  };

  const checkEmailUsed = async (email: string) => {
    const user = await db.query.users.findFirst({
      where: (col, { eq }) => eq(col.email, email),
    });

    if (user) throw new ConflictError("Email taken");
  };

  const signUp = async (value: SignUp) => {
    const { email, password } = value;

    await checkEmailUsed(email);

    const passwordHashed = await Bun.password.hash(password);

    const [user] = await db
      .insert(users)
      .values({ email, passwordHashed })
      .returning();

    const newSession = await lucia.createSession(user.id, {
      email: user.email,
    });
    const sessionCookie = lucia.createSessionCookie(newSession.id).serialize();
    c.header("Set-Cookie", sessionCookie, { append: true });
  };

  return { signIn, signOut, signUp };
};
