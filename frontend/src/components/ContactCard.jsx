import { profile } from "../data/profile";

function buildVCard() {
  const [firstName, ...rest] = profile.name.split(" ");
  const lastName = rest.join(" ");
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${lastName};${firstName};;;`,
    `FN:${profile.name}`,
    `TITLE:${profile.role || ""}`,
    `EMAIL:${profile.email}`,
    `TEL:${profile.phone}`,
    `URL:${profile.github}`,
    "END:VCARD",
  ].join("\n");
}

export default function ContactCard() {
  const vcard = buildVCard();
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent(vcard)}`;

  const downloadVCard = () => {
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.name.replace(/\s+/g, "-")}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="panel flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
      <img
        src={qrUrl}
        alt="Scan to save contact"
        width={110}
        height={110}
        className="shrink-0 rounded border border-line bg-white p-1.5"
      />
      <div>
        <p className="eyebrow">Save my contact</p>
        <p className="mt-1 text-sm text-muted">
          Scan with your phone's camera to add me directly, or download the vCard file.
        </p>
        <button
          onClick={downloadVCard}
          className="mt-3 rounded border border-line px-4 py-2 font-mono text-xs uppercase tracking-wider text-signal hover:border-signal"
        >
          Download .vcf
        </button>
      </div>
    </div>
  );
}