import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  validateRsvpForm,
  createRsvpSubmission,
  storeRsvpLocally,
  calculateRsvpStats,
  type RsvpSubmission,
} from "./rsvp.ts";

describe("RSVP Pure Logic & Validation Tests", () => {
  test("validates a successful attending RSVP with valid guest name and attendee count", () => {
    const result = validateRsvpForm({
      guestName: "Alexander Hamilton",
      attendanceStatus: "Yes",
      numberOfAttendees: 2,
    });

    assert.equal(result.isValid, true);
    assert.deepEqual(result.errors, {});
  });

  test("validates a successful declining RSVP without requiring attendees", () => {
    const result = validateRsvpForm({
      guestName: "Aaron Burr",
      attendanceStatus: "No",
      numberOfAttendees: 0,
    });

    assert.equal(result.isValid, true);
    assert.deepEqual(result.errors, {});
  });

  test("fails validation when guest name is empty or whitespace only", () => {
    const result = validateRsvpForm({
      guestName: "   ",
      attendanceStatus: "Yes",
      numberOfAttendees: 1,
    });

    assert.equal(result.isValid, false);
    assert.ok(result.errors.guestName);
    assert.match(result.errors.guestName, /Please enter your name/);
  });

  test("fails validation when attendance status is not selected", () => {
    const result = validateRsvpForm({
      guestName: "Eliza Schuyler",
      attendanceStatus: "",
      numberOfAttendees: 1,
    });

    assert.equal(result.isValid, false);
    assert.ok(result.errors.attendanceStatus);
  });

  test("fails validation when attending Yes but attendee count is less than 1 or invalid", () => {
    const resultZero = validateRsvpForm({
      guestName: "John Laurens",
      attendanceStatus: "Yes",
      numberOfAttendees: 0,
    });
    assert.equal(resultZero.isValid, false);
    assert.ok(resultZero.errors.numberOfAttendees);

    const resultNegative = validateRsvpForm({
      guestName: "John Laurens",
      attendanceStatus: "Yes",
      numberOfAttendees: -2,
    });
    assert.equal(resultNegative.isValid, false);

    const resultFloat = validateRsvpForm({
      guestName: "John Laurens",
      attendanceStatus: "Yes",
      numberOfAttendees: 2.5,
    });
    assert.equal(resultFloat.isValid, false);
  });

  test("createRsvpSubmission sets proper fields and zeroes attendees when status is No", () => {
    const recordYes = createRsvpSubmission(
      {
        guestName: "  Thomas Jefferson  ",
        attendanceStatus: "Yes",
        numberOfAttendees: 3,
      },
      "test-id-1",
      "2026-10-28T12:00:00Z"
    );

    assert.equal(recordYes.id, "test-id-1");
    assert.equal(recordYes.guestName, "Thomas Jefferson");
    assert.equal(recordYes.attendanceStatus, "Yes");
    assert.equal(recordYes.numberOfAttendees, 3);
    assert.equal(recordYes.createdAt, "2026-10-28T12:00:00Z");

    const recordNo = createRsvpSubmission(
      {
        guestName: "George Washington",
        attendanceStatus: "No",
        numberOfAttendees: 4, // should be normalized to 0
      },
      "test-id-2"
    );

    assert.equal(recordNo.attendanceStatus, "No");
    assert.equal(recordNo.numberOfAttendees, 0);
  });

  test("storeRsvpLocally prepends new submission or updates existing record", () => {
    const initial: RsvpSubmission[] = [
      {
        id: "rec-1",
        guestName: "Guest One",
        attendanceStatus: "Yes",
        numberOfAttendees: 2,
        createdAt: "2026-10-28T10:00:00Z",
      },
    ];

    const newRecord: RsvpSubmission = {
      id: "rec-2",
      guestName: "Guest Two",
      attendanceStatus: "No",
      numberOfAttendees: 0,
      createdAt: "2026-10-28T11:00:00Z",
    };

    const added = storeRsvpLocally(newRecord, initial);
    assert.equal(added.length, 2);
    assert.equal(added[0].id, "rec-2");

    // Updating rec-1
    const updatedRecord: RsvpSubmission = {
      id: "rec-1",
      guestName: "Guest One (Updated)",
      attendanceStatus: "Yes",
      numberOfAttendees: 3,
      createdAt: "2026-10-28T10:00:00Z",
    };

    const updatedList = storeRsvpLocally(updatedRecord, added);
    assert.equal(updatedList.length, 2);
    const found = updatedList.find((r) => r.id === "rec-1");
    assert.equal(found?.guestName, "Guest One (Updated)");
    assert.equal(found?.numberOfAttendees, 3);
  });

  test("calculateRsvpStats computes total responses, attending, declined, and headcounts correctly", () => {
    const records: RsvpSubmission[] = [
      {
        id: "1",
        guestName: "Alice",
        attendanceStatus: "Yes",
        numberOfAttendees: 2,
        createdAt: "2026-10-28T10:00:00Z",
      },
      {
        id: "2",
        guestName: "Bob",
        attendanceStatus: "Yes",
        numberOfAttendees: 4,
        createdAt: "2026-10-28T11:00:00Z",
      },
      {
        id: "3",
        guestName: "Charlie",
        attendanceStatus: "No",
        numberOfAttendees: 0,
        createdAt: "2026-10-28T12:00:00Z",
      },
    ];

    const stats = calculateRsvpStats(records);
    assert.equal(stats.total, 3);
    assert.equal(stats.attending, 2);
    assert.equal(stats.declined, 1);
    assert.equal(stats.totalAttendees, 6);
  });
});
