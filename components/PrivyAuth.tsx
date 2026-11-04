"use client";
import { memo, useEffect, useRef, type ReactNode } from "react";
import {
  PrivyProvider,
  usePrivy,
  useIdentityToken,
  type PrivyClientConfig,
} from "@privy-io/react-auth";
import type { AuthState } from "./auth";

// Defined once at module level so Privy never sees a new config object per render.
const PRIVY_CONFIG: PrivyClientConfig = {
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
};

function Bridge({
  onState,
  children,
}: {
  onState: (state: AuthState) => void;
  children: ReactNode;
}) {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { identityToken } = useIdentityToken();

  // Privy may return new function identities every render. Keep the latest in
  // refs and expose stable wrappers so they never retrigger the effect below.
  const loginRef = useRef(login);
  const logoutRef = useRef(logout);
  useEffect(() => {
    loginRef.current = login;
    logoutRef.current = logout;
  });
  const actions = useRef({
    login: () => {
      loginRef.current({ loginMethods: ["twitter"] });
    },
    logout: () => {
      void logoutRef.current();
    },
  });

  // Reduce objects to plain values so the effect only fires on real changes.
  const account = user?.twitter;
  const hasTwitter = !!account;
  const username = account?.username ?? null;
  const avatar = account?.profilePictureUrl ?? null;
  const userId = user?.id ?? null;

  useEffect(() => {
    onState({
      ready,
      authenticated: authenticated && hasTwitter,
      handle: username ? `@${username}` : null,
      avatar: avatar || null,
      id: userId,
      token: identityToken || null,
      login: actions.current.login,
      logout: actions.current.logout,
    });
  }, [
    ready,
    authenticated,
    hasTwitter,
    username,
    avatar,
    userId,
    identityToken,
    onState,
  ]);

  return <>{children}</>;
}

function PrivyAuth({
  appId,
  onState,
  children,
}: {
  appId: string;
  onState: (state: AuthState) => void;
  children: ReactNode;
}) {
  return (
    <PrivyProvider appId={appId} config={PRIVY_CONFIG}>
      <Bridge onState={onState}>{children}</Bridge>
    </PrivyProvider>
  );
}

export default memo(PrivyAuth);