import {
  createRemoteJWKSet,
  jwtVerify,
  type JWTPayload,
  type JWTVerifyGetKey,
} from "jose";
export type Identity = {
  id: string;
  handle: string;
  avatar: string | null;
  expiresAt: number;
};
export function identityFromClaims(payload: JWTPayload): Identity {
  if (
    !payload.sub ||
    !payload.exp ||
    typeof payload.linked_accounts !== "string"
  )
    throw new Error("A Privy identity token is required.");
  const accounts = JSON.parse(payload.linked_accounts);
  if (!Array.isArray(accounts)) throw new Error("Invalid identity.");
  const twitter = accounts.find((a) => a.type === "twitter_oauth");
  if (
    !twitter ||
    typeof twitter.username !== "string" ||
    !/^\w{1,50}$/.test(twitter.username)
  )
    throw new Error("Connect an X account to play online.");
  let avatar: string | null = null;
  const source = twitter.profile_picture_url || twitter.profilePictureUrl;
  if (typeof source === "string") {
    try {
      const u = new URL(source);
      if (u.protocol === "https:") avatar = u.href;
    } catch {}
  }
  return {
    id: payload.sub,
    handle: `@${twitter.username}`,
    avatar,
    expiresAt: payload.exp * 1000,
  };
}
const keySets = new Map<string, ReturnType<typeof createRemoteJWKSet>>();
export async function verifySignedIdentity(
  token: string,
  appId: string,
  key: JWTVerifyGetKey,
): Promise<Identity> {
  const { payload } = await jwtVerify(token, key, {
    issuer: "privy.io",
    audience: appId,
    algorithms: ["ES256"],
    requiredClaims: ["sub", "iat", "exp"],
  });
  return identityFromClaims(payload);
}
export async function verifyIdentity(
  token: string,
  appId: string,
): Promise<Identity> {
  if (!appId || !/^c[a-z0-9]+$/i.test(appId))
    throw new Error("The match service needs its Privy app configuration.");
  if (!keySets.has(appId))
    keySets.set(
      appId,
      createRemoteJWKSet(
        new URL(`https://auth.privy.io/api/v1/apps/${appId}/jwks.json`),
      ),
    );
  return verifySignedIdentity(token, appId, keySets.get(appId)!);
}
