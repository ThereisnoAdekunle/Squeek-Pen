import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import ArenaPanel from "../components/ArenaPanel";

const render = (props: Partial<Parameters<typeof ArenaPanel>[0]> = {}) =>
  renderToString(
    createElement(ArenaPanel, {
      host: "https://rooms.example.workers.dev",
      token: null,
      authenticated: false,
      onLogin: () => {},
      settledRound: "239",
      ...props,
    }),
  );

test("the panel is hidden when there is no game server to talk to", () => {
  assert.equal(render({ host: null }), "");
  assert.equal(render({ host: "" }), "");
  assert.equal(render({ host: "not a url" }), "");
});
test("signed-out visitors see the question, the reward and a way to sign in", () => {
  const html = render();
  assert.match(html, /Will the next settled round be Zoomies\?/);
  assert.match(html, /round #240/);
  assert.match(html, /10 points/);
  assert.match(html, /Connect with X to guess/);
  assert.doesNotMatch(html, /Not Zoomies/);
});
test("signed-in players can pick, and both boards have friendly empty states", () => {
  const html = render({ authenticated: true, token: "t" });
  assert.match(html, />Zoomies</);
  assert.match(html, /Not Zoomies/);
  assert.doesNotMatch(html, /Connect with X to guess/);
  assert.match(html, /No Zoomies goals yet/);
  assert.match(html, /Zoomies goals/);
  assert.match(html, /Oracles/);
});
test("the panel works before the settled round is known", () => {
  const html = render({ settledRound: null });
  assert.match(html, /Guess before the wheel settles\./);
});