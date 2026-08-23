import { useState } from "react";
import SectionHeading from "../components/SectionHeading";
import { profile } from "../data/profile";
import client from "../api/client";
import ContactCard from "../components/ContactCard";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await client.post("/contact", form);
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <SectionHeading
        index="08"
        label="Say hello"
        title="Contact"
        sub="Open to internships, freelance work, and full-time roles. The form below writes straight to the database."
      />

      <form onSubmit={onSubmit} className="panel space-y-5 p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="readout" htmlFor="name">Name</label>
            <input
              id="name" name="name" required value={form.name} onChange={onChange}
              className="mt-2 w-full rounded border border-line bg-surface2 px-3 py-2 text-ink outline-none focus:border-signal"
            />
          </div>
          <div>
            <label className="readout" htmlFor="email">Email</label>
            <input
              id="email" name="email" type="email" required value={form.email} onChange={onChange}
              className="mt-2 w-full rounded border border-line bg-surface2 px-3 py-2 text-ink outline-none focus:border-signal"
            />
          </div>
        </div>
        <div>
          <label className="readout" htmlFor="subject">Subject</label>
          <input
            id="subject" name="subject" value={form.subject} onChange={onChange}
            className="mt-2 w-full rounded border border-line bg-surface2 px-3 py-2 text-ink outline-none focus:border-signal"
          />
        </div>
        <div>
          <label className="readout" htmlFor="message">Message</label>
          <textarea
            id="message" name="message" rows={5} required value={form.message} onChange={onChange}
            className="mt-2 w-full rounded border border-line bg-surface2 px-3 py-2 text-ink outline-none focus:border-signal"
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded bg-signal px-6 py-3 font-mono text-sm font-semibold text-base transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "sending" ? "Sending..." : "Send message"}
        </button>

        {status === "sent" && <p className="readout text-data">Message received — I'll reply soon.</p>}
        {status === "error" && <p className="readout text-danger">Something went wrong — email me directly instead.</p>}
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        Or reach me directly: <a href={`mailto:${profile.email}`} className="text-signal hover:underline">{profile.email}</a>
        {" · "}{profile.phone}
      </p>
      <div className="mt-8">
        <ContactCard />
      </div>
    </div>
  );
}
