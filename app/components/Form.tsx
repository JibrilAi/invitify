import React, { useState } from "react";

const Form = () => {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const form = e.currentTarget;
    if (!form) {
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      attendance: formData.get("attendance"),
      guests: formData.get("guests"),
      message: formData.get("message"),
    };

    if (!data.name || !data.attendance || !data.guests || !data.message) {
      setStatusMessage({ type: "error", text: "All fields are required!" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        form.reset();
        setStatusMessage({ type: "success", text: "RSVP submitted successfully! Thank you." });
      } else {
        setStatusMessage({ type: "error", text: "Failed to submit RSVP. Please try again." });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Network error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      {statusMessage && (
        <div
          className={`p-3 rounded-md text-sm text-center ${
            statusMessage.type === "success"
              ? "bg-emerald-900/60 border border-emerald-500 text-emerald-200"
              : "bg-red-900/60 border border-red-500 text-red-200"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Form fields */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white">
          Nama
        </label>
        <input
          type="text"
          name="name"
          id="name"
          className="block w-full p-2 mt-1 bg-white/10 text-white border border-gray-300 rounded-md shadow-xs focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="attendance"
          className="block text-sm font-medium text-white"
        >
          Kehadiran
        </label>
        <select
          id="attendance"
          name="attendance"
          className="block w-full p-2 mt-1 bg-black/40 text-white border border-gray-300 rounded-md shadow-xs  sm:text-sm"
          required
        >
          <option value="">Pilih Kehadiran</option>
          <option value="Hadir">Hadir</option>
          <option value="Tidak Hadir">Tidak Hadir</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="guests"
          className="block text-sm font-medium text-white"
        >
          Jumlah Tamu
        </label>
        <select
          id="guests"
          name="guests"
          className="block w-full p-2 mt-1  bg-black/40 text-white border border-gray-300 rounded-md shadow-xs  sm:text-sm"
          required
        >
          <option value="">Pilih Jumlah Tamu</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-white"
        >
          Ucapan
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="block w-full p-2 mt-1 bg-white/10 text-white border border-gray-300 rounded-md shadow-xs focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <button
          type="submit"
          className="block w-full p-2 text-sm font-medium text-center text-black bg-white border border-transparent rounded-md shadow-xs hover:bg-gray-200 transition"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default Form;
