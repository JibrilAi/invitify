"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  X,
  User,
  Users,
  CalendarCheck,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Plus,
  Minus,
  ClipboardList,
} from "lucide-react";
import {
  AttendanceStatus,
  RsvpFormData,
  RsvpSubmission,
  validateRsvpForm,
  createRsvpSubmission,
  storeRsvpLocally,
  calculateRsvpStats,
} from "@/lib/rsvp";

interface RsvpComponentProps {
  initialGuestName?: string;
  className?: string;
  onRsvpSubmitted?: (submission: RsvpSubmission) => void;
  accentColor?: string;
}

const STORAGE_KEY = "invitify_local_rsvp_store_v1";

const DEFAULT_LOCAL_RECORDS: RsvpSubmission[] = [
  {
    id: "rsvp-seed-1",
    guestName: "Alexander & Eliza",
    attendanceStatus: "Yes",
    numberOfAttendees: 2,
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: "rsvp-seed-2",
    guestName: "John Laurens",
    attendanceStatus: "Yes",
    numberOfAttendees: 1,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "rsvp-seed-3",
    guestName: "Aaron Burr",
    attendanceStatus: "No",
    numberOfAttendees: 0,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
];

export default function RsvpComponent({
  initialGuestName = "",
  className = "",
  onRsvpSubmitted,
}: RsvpComponentProps) {
  // Form State stored in a typed local object
  const [formState, setFormState] = useState<RsvpFormData>({
    guestName: initialGuestName,
    attendanceStatus: "Yes",
    numberOfAttendees: 2,
  });

  const [touched, setTouched] = useState<{ [K in keyof RsvpFormData]?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stored state: lazy initializer for local records
  const [localRecords, setLocalRecords] = useState<RsvpSubmission[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // Fallback to defaults
      }
    }
    return DEFAULT_LOCAL_RECORDS;
  });

  // Stored state: Current user submission local object
  const [storedRecord, setStoredRecord] = useState<RsvpSubmission | null>(() => {
    if (typeof window !== "undefined" && initialGuestName) {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const found = parsed.find(
              (r: RsvpSubmission) => r.guestName.toLowerCase() === initialGuestName.toLowerCase()
            );
            if (found) return found;
          }
        }
      } catch {
        // Fallback
      }
    }
    return null;
  });

  const [showRecordsList, setShowRecordsList] = useState(false);

  // Derive validation errors pure computation (no cascading render effect)
  const validationResult = useMemo(() => validateRsvpForm(formState), [formState]);
  const errors = validationResult.errors;

  // Field Handlers
  const handleNameChange = (val: string) => {
    setTouched((prev) => ({ ...prev, guestName: true }));
    setFormState((prev) => ({ ...prev, guestName: val }));
  };

  const handleAttendanceChange = (status: AttendanceStatus) => {
    setTouched((prev) => ({ ...prev, attendanceStatus: true }));
    setFormState((prev) => ({
      ...prev,
      attendanceStatus: status,
      // If switching to No, normalize to 0; if switching back to Yes, default to 1 or previous count
      numberOfAttendees: status === "Yes" ? (prev.numberOfAttendees > 0 ? prev.numberOfAttendees : 1) : 0,
    }));
  };

  const handleAttendeesChange = (count: number) => {
    const validCount = Math.max(1, Math.min(10, count));
    setTouched((prev) => ({ ...prev, numberOfAttendees: true }));
    setFormState((prev) => ({ ...prev, numberOfAttendees: validCount }));
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      guestName: true,
      attendanceStatus: true,
      numberOfAttendees: true,
    });

    if (!validationResult.isValid) {
      return;
    }

    setIsSubmitting(true);

    // Simulate brief delightful response time
    setTimeout(() => {
      // Create local object record
      const newSubmission = createRsvpSubmission({
        guestName: formState.guestName,
        attendanceStatus: formState.attendanceStatus as AttendanceStatus,
        numberOfAttendees: formState.numberOfAttendees,
      });

      // Store in local records array
      const updatedRecords = storeRsvpLocally(newSubmission, localRecords);
      setLocalRecords(updatedRecords);
      setStoredRecord(newSubmission);

      // Persist in localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
      } catch {
        // Fallback gracefully
      }

      setIsSubmitting(false);

      if (onRsvpSubmitted) {
        onRsvpSubmitted(newSubmission);
      }
    }, 400);
  };

  // Edit / Change response
  const handleEditResponse = () => {
    if (storedRecord) {
      setFormState({
        guestName: storedRecord.guestName,
        attendanceStatus: storedRecord.attendanceStatus,
        numberOfAttendees: storedRecord.numberOfAttendees > 0 ? storedRecord.numberOfAttendees : 1,
      });
    }
    setStoredRecord(null);
  };

  // Submit another guest response
  const handleSubmitAnother = () => {
    setFormState({
      guestName: "",
      attendanceStatus: "Yes",
      numberOfAttendees: 1,
    });
    setTouched({});
    setStoredRecord(null);
  };

  const stats = calculateRsvpStats(localRecords);

  return (
    <div
      className={`relative w-full max-w-2xl mx-auto rounded-3xl p-6 sm:p-8 backdrop-blur-xl border border-white/15 bg-black/75 shadow-2xl transition-all duration-300 ${className}`}
      id="rsvp-component"
    >
      {/* Decorative Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-8 space-y-2 relative">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-legan uppercase tracking-widest text-amber-200 bg-amber-500/10 border border-amber-500/20">
          <CalendarCheck className="w-3.5 h-3.5 text-amber-300" />
          <span>RSVP & Attendance</span>
        </div>
        <h3 className="font-ovo text-2xl sm:text-3xl text-white uppercase tracking-wider">
          Will You Join Our Celebration?
        </h3>
        <p className="font-legan text-xs sm:text-sm text-white/70 max-w-md mx-auto leading-relaxed">
          Please let us know if you can attend. Your response will be safely recorded in our guest registry.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {storedRecord ? (
          /* Stored RSVP Local State View */
          <motion.div
            key="confirmed-view"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Status Card */}
            <div
              className={`p-6 sm:p-8 rounded-2xl border text-center space-y-4 shadow-xl ${
                storedRecord.attendanceStatus === "Yes"
                  ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-100"
                  : "bg-neutral-900/60 border-neutral-700/60 text-neutral-200"
              }`}
            >
              <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center border shadow-lg backdrop-blur-md">
                {storedRecord.attendanceStatus === "Yes" ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                ) : (
                  <XCircle className="w-8 h-8 text-neutral-400" />
                )}
              </div>

              <div>
                <h4 className="font-ovo text-2xl font-bold text-white tracking-wide">
                  {storedRecord.attendanceStatus === "Yes"
                    ? "Attendance Confirmed!"
                    : "Response Recorded"}
                </h4>
                <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-sm mx-auto">
                  {storedRecord.attendanceStatus === "Yes"
                    ? `Thank you, ${storedRecord.guestName}! We cannot wait to celebrate together!`
                    : `Thank you for letting us know, ${storedRecord.guestName}. You will be warmly remembered in our prayers!`}
                </p>
              </div>

              {/* Local Object Summary Details */}
              <div className="bg-black/40 rounded-xl p-4 border border-white/10 max-w-md mx-auto text-left space-y-2.5">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                  <span className="text-white/60">Guest Name</span>
                  <span className="font-semibold text-white truncate max-w-[200px]">
                    {storedRecord.guestName}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                  <span className="text-white/60">Attendance Status</span>
                  <span
                    className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                      storedRecord.attendanceStatus === "Yes"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {storedRecord.attendanceStatus === "Yes" ? (
                      <>
                        <Check className="w-3 h-3" /> Yes (Attending)
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3" /> No (Declined)
                      </>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                  <span className="text-white/60">Number of Attendees</span>
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-300" />
                    {storedRecord.attendanceStatus === "Yes"
                      ? `${storedRecord.numberOfAttendees} ${
                          storedRecord.numberOfAttendees === 1 ? "Guest" : "Guests"
                        }`
                      : "0 Guests"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-white/50 pt-1">
                  <span>Record ID</span>
                  <span className="font-mono text-[10px] text-white/60">
                    {storedRecord.id.slice(0, 16)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleEditResponse}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Update Response</span>
                </button>
                <button
                  type="button"
                  onClick={handleSubmitAnother}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-gray-200 transition shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>RSVP for Another Guest</span>
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* RSVP Form View */
          <motion.form
            key="form-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            onSubmit={handleSubmit}
            className="space-y-6"
            noValidate
          >
            {/* 1. Guest Name Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="rsvp-guest-name"
                className="flex items-center justify-between text-xs font-medium text-white/90"
              >
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-300" />
                  Guest Name <span className="text-amber-400">*</span>
                </span>
                <span className="text-[11px] text-white/50">Required</span>
              </label>
              <input
                id="rsvp-guest-name"
                name="guestName"
                type="text"
                autoComplete="name"
                required
                value={formState.guestName}
                onChange={(e) => handleNameChange(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, guestName: true }))}
                placeholder="e.g. Mikha Satria & Family"
                className={`w-full px-4 py-3 rounded-2xl bg-white/10 border text-white text-sm placeholder-white/40 focus:outline-none transition shadow-inner ${
                  touched.guestName && errors.guestName
                    ? "border-red-400 focus:border-red-400"
                    : "border-white/20 focus:border-white"
                }`}
              />
              {touched.guestName && errors.guestName && (
                <p className="text-[11px] text-red-300 mt-1 flex items-center gap-1">
                  <span>•</span> {errors.guestName}
                </p>
              )}
            </div>

            {/* 2. Attendance Status (Yes / No) */}
            <div className="space-y-2">
              <label className="flex items-center justify-between text-xs font-medium text-white/90">
                <span className="flex items-center gap-1.5">
                  <CalendarCheck className="w-3.5 h-3.5 text-amber-300" />
                  Attendance Status <span className="text-amber-400">*</span>
                </span>
                <span className="text-[11px] text-white/50">Will you be attending?</span>
              </label>

              <div
                role="radiogroup"
                aria-label="Attendance Status"
                className="grid grid-cols-2 gap-3"
              >
                {/* YES Option */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={formState.attendanceStatus === "Yes"}
                  onClick={() => handleAttendanceChange("Yes")}
                  className={`relative p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all duration-200 cursor-pointer text-center ${
                    formState.attendanceStatus === "Yes"
                      ? "bg-emerald-950/60 border-emerald-400 text-white shadow-lg ring-1 ring-emerald-400/40"
                      : "bg-white/5 border-white/15 text-white/70 hover:bg-white/10 hover:border-white/30"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                      formState.attendanceStatus === "Yes"
                        ? "bg-emerald-500 text-black shadow-md"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="font-ovo font-bold text-sm sm:text-base block">
                      Yes, Attending
                    </span>
                    <span className="text-[10px] text-white/60 block mt-0.5">
                      I will attend with joy!
                    </span>
                  </div>
                  {formState.attendanceStatus === "Yes" && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-emerald-400 shadow-sm" />
                  )}
                </button>

                {/* NO Option */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={formState.attendanceStatus === "No"}
                  onClick={() => handleAttendanceChange("No")}
                  className={`relative p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all duration-200 cursor-pointer text-center ${
                    formState.attendanceStatus === "No"
                      ? "bg-rose-950/60 border-rose-400 text-white shadow-lg ring-1 ring-rose-400/40"
                      : "bg-white/5 border-white/15 text-white/70 hover:bg-white/10 hover:border-white/30"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                      formState.attendanceStatus === "No"
                        ? "bg-rose-500 text-white shadow-md"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    <X className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="font-ovo font-bold text-sm sm:text-base block">
                      No, Regretfully
                    </span>
                    <span className="text-[10px] text-white/60 block mt-0.5">
                      Cannot attend in person
                    </span>
                  </div>
                  {formState.attendanceStatus === "No" && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-400 shadow-sm" />
                  )}
                </button>
              </div>

              {touched.attendanceStatus && errors.attendanceStatus && (
                <p className="text-[11px] text-red-300 mt-1 flex items-center gap-1">
                  <span>•</span> {errors.attendanceStatus}
                </p>
              )}
            </div>

            {/* 3. Number of Attendees */}
            <div className="space-y-2">
              <label className="flex items-center justify-between text-xs font-medium text-white/90">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-300" />
                  Number of Attendees <span className="text-amber-400">*</span>
                </span>
                <span className="text-[11px] text-white/50">
                  {formState.attendanceStatus === "Yes"
                    ? `${formState.numberOfAttendees} ${
                        formState.numberOfAttendees === 1 ? "Person" : "People"
                      }`
                    : "Not applicable (0)"}
                </span>
              </label>

              {formState.attendanceStatus === "Yes" ? (
                <div className="space-y-3">
                  {/* Quick Select Buttons */}
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((count) => {
                      const isSelected = formState.numberOfAttendees === count;
                      return (
                        <button
                          key={count}
                          type="button"
                          onClick={() => handleAttendeesChange(count)}
                          className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 border cursor-pointer ${
                            isSelected
                              ? "bg-white text-black border-white shadow-md scale-102"
                              : "bg-white/5 border-white/15 text-white/80 hover:bg-white/15 hover:border-white/30"
                          }`}
                        >
                          <span className="text-sm font-ovo">{count}</span>
                          <span className="text-[9px] uppercase tracking-wider font-legan opacity-70">
                            {count === 1 ? "Guest" : "Guests"}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Stepper for 1 - 10 attendees */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xs text-white/70">Adjust Attendee Count:</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="Decrease attendees"
                        onClick={() => handleAttendeesChange(formState.numberOfAttendees - 1)}
                        disabled={formState.numberOfAttendees <= 1}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-base font-bold text-white w-6 text-center">
                        {formState.numberOfAttendees}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase attendees"
                        onClick={() => handleAttendeesChange(formState.numberOfAttendees + 1)}
                        disabled={formState.numberOfAttendees >= 10}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Disabled/Info State when Not Attending */
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/60 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-white/40 shrink-0" />
                  <span>
                    Attendee count is automatically set to 0 as you indicated you cannot attend.
                  </span>
                </div>
              )}

              {touched.numberOfAttendees && errors.numberOfAttendees && (
                <p className="text-[11px] text-red-300 mt-1 flex items-center gap-1">
                  <span>•</span> {errors.numberOfAttendees}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !formState.guestName.trim()}
              className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider bg-white text-black hover:bg-gray-200 transition-all duration-200 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Storing RSVP...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Submit RSVP Confirmation</span>
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Local Store Statistics & Drawer */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-white/70">
            <span className="font-semibold text-white">
              {stats.totalAttendees} <span className="font-normal text-white/60">Guests Attending</span>
            </span>
            <span className="text-white/20">•</span>
            <span>
              {stats.attending} <span className="text-white/50">Yes</span> / {stats.declined}{" "}
              <span className="text-white/50">No</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowRecordsList(!showRecordsList)}
            className="inline-flex items-center gap-1.5 text-xs text-amber-200/90 hover:text-amber-200 transition cursor-pointer"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>{showRecordsList ? "Hide Registry" : "View Stored RSVPs"}</span>
          </button>
        </div>

        {/* Expandable Stored Records */}
        {showRecordsList && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2 overflow-hidden"
          >
            <p className="text-[11px] font-legan uppercase tracking-wider text-white/50">
              Stored In Local State ({localRecords.length})
            </p>
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {localRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 truncate">
                    {rec.attendanceStatus === "Yes" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    )}
                    <span className="font-medium text-white truncate">{rec.guestName}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-white/60 text-[11px]">
                    {rec.attendanceStatus === "Yes" ? (
                      <span className="text-emerald-300 font-semibold">
                        {rec.numberOfAttendees} {rec.numberOfAttendees === 1 ? "guest" : "guests"}
                      </span>
                    ) : (
                      <span className="text-neutral-400">Declined</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
