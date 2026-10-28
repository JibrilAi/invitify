export type AttendanceStatus = "Yes" | "No";

export interface RsvpFormData {
  guestName: string;
  attendanceStatus: AttendanceStatus | "";
  numberOfAttendees: number;
}

export interface RsvpSubmission {
  id: string;
  guestName: string;
  attendanceStatus: AttendanceStatus;
  numberOfAttendees: number;
  createdAt: string;
}

export interface RsvpValidationErrors {
  guestName?: string;
  attendanceStatus?: string;
  numberOfAttendees?: string;
}

/**
 * Validates the RSVP form fields according to requirements:
 * - guest name is required and non-empty
 * - attendance status must be "Yes" or "No"
 * - number of attendees must be a positive integer (>= 1) if attending ("Yes")
 */
export function validateRsvpForm(data: Partial<RsvpFormData>): {
  isValid: boolean;
  errors: RsvpValidationErrors;
} {
  const errors: RsvpValidationErrors = {};

  const trimmedName = (data.guestName || "").trim();
  if (!trimmedName) {
    errors.guestName = "Please enter your name.";
  } else if (trimmedName.length < 2) {
    errors.guestName = "Name must be at least 2 characters.";
  }

  if (data.attendanceStatus !== "Yes" && data.attendanceStatus !== "No") {
    errors.attendanceStatus = "Please select attendance status (Yes or No).";
  }

  if (data.attendanceStatus === "Yes") {
    const attendees = data.numberOfAttendees;
    if (
      attendees === undefined ||
      attendees === null ||
      typeof attendees !== "number" ||
      isNaN(attendees) ||
      attendees < 1 ||
      !Number.isInteger(attendees)
    ) {
      errors.numberOfAttendees = "Number of attendees must be at least 1.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Creates a clean RSVP submission record object.
 * When attending is "No", number of attendees is automatically normalized to 0.
 */
export function createRsvpSubmission(
  data: {
    guestName: string;
    attendanceStatus: AttendanceStatus;
    numberOfAttendees: number;
  },
  customId?: string,
  customCreatedAt?: string
): RsvpSubmission {
  const isAttending = data.attendanceStatus === "Yes";
  return {
    id: customId || `rsvp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    guestName: data.guestName.trim(),
    attendanceStatus: data.attendanceStatus,
    numberOfAttendees: isAttending ? Math.max(1, data.numberOfAttendees) : 0,
    createdAt: customCreatedAt || new Date().toISOString(),
  };
}

/**
 * Pure function to store/update an RSVP in an in-memory/local state list.
 * If a submission with the same ID or same guest name exists, it can replace or prepend.
 */
export function storeRsvpLocally(
  newRecord: RsvpSubmission,
  currentRecords: RsvpSubmission[] = []
): RsvpSubmission[] {
  // Check if updating existing record with same ID
  const existingIndex = currentRecords.findIndex((r) => r.id === newRecord.id);
  if (existingIndex >= 0) {
    const copy = [...currentRecords];
    copy[existingIndex] = newRecord;
    return copy;
  }
  return [newRecord, ...currentRecords];
}

/**
 * Computes attendee statistics from a list of local RSVP records.
 */
export function calculateRsvpStats(records: RsvpSubmission[]) {
  const total = records.length;
  const attending = records.filter((r) => r.attendanceStatus === "Yes").length;
  const declined = records.filter((r) => r.attendanceStatus === "No").length;
  const totalAttendees = records.reduce(
    (sum, r) => sum + (r.attendanceStatus === "Yes" ? r.numberOfAttendees : 0),
    0
  );

  return {
    total,
    attending,
    declined,
    totalAttendees,
  };
}
