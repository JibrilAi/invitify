import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_INVITATION_CONFIG,
  toggleFeature,
  updateConfig,
  verifyHostPasscode,
} from "./invitation-store.ts";

describe("Invitation Store Pure Functions", () => {
  test("toggleFeature toggles RSVP feature flag from true to false and back", () => {
    assert.equal(DEFAULT_INVITATION_CONFIG.features.rsvp, true);
    const toggled = toggleFeature(DEFAULT_INVITATION_CONFIG, "rsvp");
    assert.equal(toggled.features.rsvp, false);
    const toggledBack = toggleFeature(toggled, "rsvp");
    assert.equal(toggledBack.features.rsvp, true);
  });

  test("toggleFeature toggles music and digitalEnvelope features independently", () => {
    let cfg = toggleFeature(DEFAULT_INVITATION_CONFIG, "music");
    assert.equal(cfg.features.music, false);
    assert.equal(cfg.features.digitalEnvelope, true);

    cfg = toggleFeature(cfg, "digitalEnvelope");
    assert.equal(cfg.features.music, false);
    assert.equal(cfg.features.digitalEnvelope, false);
  });

  test("updateConfig updates top-level coupleNames and theme", () => {
    const updated = updateConfig(DEFAULT_INVITATION_CONFIG, "coupleNames", "Romeo & Juliet");
    assert.equal(updated.coupleNames, "Romeo & Juliet");
    assert.equal(DEFAULT_INVITATION_CONFIG.coupleNames, "Mikha & Clara"); // immutable

    const themeUpdated = updateConfig(updated, "theme", "champagne");
    assert.equal(themeUpdated.theme, "champagne");
  });

  test("verifyHostPasscode accepts valid host credentials and rejects wrong passcodes", () => {
    assert.equal(verifyHostPasscode("admin"), true);
    assert.equal(verifyHostPasscode("1234"), true);
    assert.equal(verifyHostPasscode("inviti"), true);
    assert.equal(verifyHostPasscode("Mikha "), true); // trimmed and lowercased
    assert.equal(verifyHostPasscode("wrong-code"), false);
    assert.equal(verifyHostPasscode(""), false);
  });
});
