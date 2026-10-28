import test from "node:test";
import assert from "node:assert/strict";
import { verifyHostPasscode, DEFAULT_INVITATION_CONFIG } from "../lib/invitation-store.ts";

test("verifyHostPasscode accepts valid host demo passcodes", () => {
  assert.equal(verifyHostPasscode("admin"), true);
  assert.equal(verifyHostPasscode("ADMIN"), true);
  assert.equal(verifyHostPasscode("1234"), true);
  assert.equal(verifyHostPasscode("inviti"), true);
  assert.equal(verifyHostPasscode("mikha"), true);
  assert.equal(verifyHostPasscode("clara"), true);
  assert.equal(verifyHostPasscode("wedding"), true);
});

test("verifyHostPasscode rejects invalid passcodes", () => {
  assert.equal(verifyHostPasscode("wrong-code"), false);
  assert.equal(verifyHostPasscode(""), false);
  assert.equal(verifyHostPasscode("0000"), false);
});

test("DEFAULT_INVITATION_CONFIG contains all luxury invitation features and toggles", () => {
  assert.ok(DEFAULT_INVITATION_CONFIG.coupleNames.includes("Mikha & Clara"));
  assert.equal(typeof DEFAULT_INVITATION_CONFIG.features.rsvp, "boolean");
  assert.equal(typeof DEFAULT_INVITATION_CONFIG.features.guestbook, "boolean");
  assert.equal(typeof DEFAULT_INVITATION_CONFIG.features.digitalEnvelope, "boolean");
  assert.equal(typeof DEFAULT_INVITATION_CONFIG.features.story, "boolean");
  assert.equal(typeof DEFAULT_INVITATION_CONFIG.features.events, "boolean");
  assert.equal(DEFAULT_INVITATION_CONFIG.digitalEnvelope.accounts.length > 0, true);
  assert.equal(DEFAULT_INVITATION_CONFIG.story.items.length > 0, true);
});
