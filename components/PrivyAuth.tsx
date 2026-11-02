"use client";
import { useEffect, type ReactNode } from "react";
import {
  PrivyProvider,
  usePrivy,
  useIdentityToken,
} from "@privy-io/react-auth";
import type { AuthState } from "./auth";

function Bridge({
  onState,
  children,
}: {
  onState: (state: AuthState) => void;
  children: ReactNode;
}) {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { identityToken } = useIdentityToken();
  useEffect(() => {
    const account = user?.twitter;
    onState({
      ready,
      authenticated: authenticated && !!account,
      handle: account?.username ? `@${account.username}` : null,
      avatar: account?.profilePictureUrl || null,
      id: user?.id || null,
      token: identityToken || null,
      login: () => login({ loginMethods: ["twitter"] }),
      logout,
    });
  }, [ready, authenticated, user, identityToken, login, logout, onState]);
  return <>{children}</>;
}
export default function PrivyAuth({
  appId,
  onState,
  children,
}: {
  appId: string;
  onState: (state: AuthState) => void;
  children: ReactNode;
}) {
  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ["twitter"],
        appearance: {
          theme: "dark",
          accentColor: "#ffad5c",
          showWalletLoginFirst: false,
        },
        embeddedWallets: {
          showWalletUIs: false,
          ethereum: { createOnLogin: "users-without-wallets" },
        },
      }}
    >
      <Bridge onState={onState}>{children}</Bridge>
    </PrivyProvider>
  );
}
