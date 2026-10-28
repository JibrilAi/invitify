"use client";

import React, { useState, useEffect } from "react";
import {
  RsvpSubmission,
  calculateRsvpStats,
  createRsvpSubmission,
  storeRsvpLocally,
} from "@/lib/rsvp";
import {
  Users,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  Download,
  Trash2,
} from "lucide-react";

const INITIAL_DEMO_RSVPS: RsvpSubmission[] = [
  {
    id: "rsvp-demo-1",
    guestName: "Alexander Hamilton & Elizabeth",
    attendanceStatus: "Yes",
    numberOfAttendees: 2,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "rsvp-demo-2",
    guestName: "David Jonathan",
    attendanceStatus: "Yes",
    numberOfAttendees: 1,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "rsvp-demo-3",
    guestName: "Amanda Valerie",
    attendanceStatus: "No",
    numberOfAttendees: 0,
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
];

const LOCAL_STORAGE_KEY = "wedding_rsvp_submissions_v1";

export default function GuestManagerTab() {
  const [submissions, setSubmissions] = useState<RsvpSubmission[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_RSVPS));
      } catch {
        // ignore
      }
    }
    return INITIAL_DEMO_RSVPS;
  });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Yes" | "No">("All");

  // Manual Add state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState("");
  const [addStatus, setAddStatus] = useState<"Yes" | "No">("Yes");
  const [addAttendees, setAddAttendees] = useState(1);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/rsvps")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data && Array.isArray(data.submissions)) {
          setSubmissions(data.submissions);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.submissions));
        }
      })
      .catch((err) => {
        console.warn("Using local RSVPs:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshBackendRsvps = async () => {
    try {
      const res = await fetch("/api/rsvps");
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.submissions)) {
          setSubmissions(data.submissions);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.submissions));
        }
      }
    } catch {
      // ignore
    }
  };

  // Listen to external rsvp updates
  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<RsvpSubmission[]>;
      if (customEvent.detail) {
        setSubmissions(customEvent.detail);
      }
    };
    window.addEventListener("rsvp-updated", handleUpdate);
    return () => window.removeEventListener("rsvp-updated", handleUpdate);
  }, []);

  const saveList = (updated: RsvpSubmission[]) => {
    setSubmissions(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("rsvp-updated", { detail: updated }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    const updated = submissions.filter((s) => s.id !== id);
    saveList(updated);
    try {
      await fetch(`/api/rsvps?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Failed to delete RSVP from backend:", err);
    }
  };

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) return;

    const attendees = addStatus === "Yes" ? Number(addAttendees) : 0;
    const newRec = createRsvpSubmission({
      guestName: addName.trim(),
      attendanceStatus: addStatus,
      numberOfAttendees: attendees,
    });

    const updated = storeRsvpLocally(newRec, submissions);
    saveList(updated);
    setAddName("");
    setAddAttendees(1);
    setShowAddModal(false);

    try {
      const res = await fetch("/api/rsvps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: newRec.guestName,
          attendanceStatus: newRec.attendanceStatus,
          numberOfAttendees: newRec.numberOfAttendees,
        }),
      });
      if (res.ok) {
        refreshBackendRsvps();
      }
    } catch (err) {
      console.warn("Failed to save RSVP to backend:", err);
    }
  };

  const handleExportCsv = () => {
    const headers = ["Guest Name", "Attendance Status", "Party Size", "Submitted At"];
    const rows = submissions.map((s) => [
      `"${s.guestName.replace(/"/g, '""')}"`,
      s.attendanceStatus,
      s.numberOfAttendees,
      `"${new Date(s.createdAt).toLocaleString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wedding_rsvp_guests_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = calculateRsvpStats(submissions);

  const filtered = submissions.filter((item) => {
    const matchesSearch = item.guestName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" ? true : item.attendanceStatus === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10">
          <p className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Total Responses</p>
          <p className="text-2xl font-bold font-ovo text-white mt-1">{stats.total}</p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
          <p className="text-[11px] font-medium text-emerald-300 uppercase tracking-wider">Attending</p>
          <div className="flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <p className="text-2xl font-bold font-ovo text-white">{stats.attending}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30">
          <p className="text-[11px] font-medium text-amber-300 uppercase tracking-wider">Total Headcount</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Users className="w-5 h-5 text-amber-300" />
            <p className="text-2xl font-bold font-ovo text-white">{stats.totalAttendees}</p>
            <span className="text-xs text-white/50">guests</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30">
          <p className="text-[11px] font-medium text-rose-300 uppercase tracking-wider">Declined</p>
          <div className="flex items-center gap-1.5 mt-1">
            <XCircle className="w-5 h-5 text-rose-400" />
            <p className="text-2xl font-bold font-ovo text-white">{stats.declined}</p>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-neutral-900 border border-white/10">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guest name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-amber-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center bg-white/10 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setFilter("All")}
              className={`px-2.5 py-1 rounded-lg transition ${
                filter === "All" ? "bg-white text-black font-semibold" : "text-white/70"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("Yes")}
              className={`px-2.5 py-1 rounded-lg transition ${
                filter === "Yes" ? "bg-emerald-500 text-white font-semibold" : "text-white/70"
              }`}
            >
              Attending
            </button>
            <button
              onClick={() => setFilter("No")}
              className={`px-2.5 py-1 rounded-lg transition ${
                filter === "No" ? "bg-rose-500 text-white font-semibold" : "text-white/70"
              }`}
            >
              Declined
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-amber-300 text-black hover:bg-amber-200 transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add RSVP</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center gap-1.5"
            title="Download CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* RSVP Data Table */}
      <div className="rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white">
            <thead className="bg-white/5 border-b border-white/10 text-white/50 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Guest Name</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">Party Size</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-white/40">
                    No RSVP records found matching your query.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition">
                    <td className="py-3 px-4 font-semibold text-white">{item.guestName}</td>
                    <td className="py-3 px-4">
                      {item.attendanceStatus === "Yes" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Attending</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 font-semibold text-[11px]">
                          <XCircle className="w-3 h-3" />
                          <span>Cannot Attend</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {item.attendanceStatus === "Yes" ? `${item.numberOfAttendees} person(s)` : "-"}
                    </td>
                    <td className="py-3 px-4 text-white/50 text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition"
                        title="Delete RSVP"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-neutral-900 border border-white/20 p-6 shadow-2xl space-y-4 text-white">
            <h4 className="font-ovo text-lg uppercase">Add Guest RSVP Manually</h4>
            <p className="text-xs text-white/60">
              Record an RSVP received via telephone, text, or paper card.
            </p>

            <form onSubmit={handleManualAdd} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Guest / Family Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samuel & Grace"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Attendance Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAddStatus("Yes")}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                      addStatus === "Yes"
                        ? "bg-emerald-600 text-white border-emerald-400"
                        : "bg-white/5 text-white/60 border-white/10"
                    }`}
                  >
                    Will Attend (Yes)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddStatus("No")}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                      addStatus === "No"
                        ? "bg-rose-600 text-white border-rose-400"
                        : "bg-white/5 text-white/60 border-white/10"
                    }`}
                  >
                    Declined (No)
                  </button>
                </div>
              </div>

              {addStatus === "Yes" && (
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Number of Attendees</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={addAttendees}
                    onChange={(e) => setAddAttendees(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-white/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-black hover:bg-gray-200"
                >
                  Save RSVP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
