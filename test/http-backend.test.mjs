import test from "node:test";
import assert from "node:assert/strict";

const BASE_URL = "http://localhost:3000";

test("HTTP Backend API: GET /api/invitation returns live wedding config", async () => {
  const res = await fetch(`${BASE_URL}/api/invitation`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.config);
  assert.equal(typeof data.config.features.rsvp, "boolean");
});

test("HTTP Backend API: POST /api/auth/login validates passcode and issues session", async () => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ passcode: "admin" }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.token);

  // Validate session with cookie
  const cookie = res.headers.get("set-cookie") || "";
  const sessionRes = await fetch(`${BASE_URL}/api/auth/session`, {
    headers: { Cookie: cookie },
  });
  assert.equal(sessionRes.status, 200);
  const sessionData = await sessionRes.json();
  assert.equal(sessionData.authenticated, true);
});

test("HTTP Backend API: POST and GET /api/rsvps stores and returns RSVPs", async () => {
  const uniqueName = `Guest-${Date.now()}`;
  const postRes = await fetch(`${BASE_URL}/api/rsvps`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      guestName: uniqueName,
      attendanceStatus: "Yes",
      numberOfAttendees: 2,
    }),
  });
  assert.equal(postRes.status, 201);

  const getRes = await fetch(`${BASE_URL}/api/rsvps`);
  assert.equal(getRes.status, 200);
  const getData = await getRes.json();
  assert.ok(getData.submissions.some((s) => s.guestName === uniqueName));
  assert.ok(getData.stats.total >= 1);
});

test("HTTP Backend API: PATCH /api/invitation/features toggles section", async () => {
  const patchRes = await fetch(`${BASE_URL}/api/invitation/features`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ feature: "livestream", enabled: true }),
  });
  assert.equal(patchRes.status, 200);
  const patchData = await patchRes.json();
  assert.equal(patchData.features.livestream, true);
});

test("HTTP Backend API: GET /api/stats returns complete dashboard statistics", async () => {
  const res = await fetch(`${BASE_URL}/api/stats`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.stats.rsvps.total >= 1);
  assert.ok(typeof data.stats.wishesCount === "number");
});
