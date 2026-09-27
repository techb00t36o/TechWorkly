import { Briefcase, Globe, MapPin, Clock, Key } from "lucide-react";

export default function WorkerBio({ worker }) {
  return (
    <section className="rounded-2xl border border-neutral-300 bg-white p-6">
      <h3 className="mb-3 text-lg font-bold text-neutral-900">Executive Bio</h3>
      <p className="mb-4 text-sm leading-relaxed text-neutral-600">
        {worker.bio.overview}
      </p>

      {worker.bio.highlights.length > 0 && (
        <ul className="mb-5 space-y-2">
          {worker.bio.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              {h}
            </li>
          ))}
        </ul>
      )}

      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5">
          <div className="mb-0.5 flex items-center gap-1.5 text-xs text-neutral-400">
            <Briefcase className="h-3 w-3" /> Experience
          </div>
          <p className="text-sm font-semibold text-neutral-800">{worker.experience}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5">
          <div className="mb-0.5 flex items-center gap-1.5 text-xs text-neutral-400">
            <Globe className="h-3 w-3" /> Languages
          </div>
          <p className="text-sm font-semibold text-neutral-800">{worker.languages.join(", ")}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5">
          <div className="mb-0.5 flex items-center gap-1.5 text-xs text-neutral-400">
            <MapPin className="h-3 w-3" /> Modality
          </div>
          <p className="text-sm font-semibold text-neutral-800">{worker.location}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5">
          <div className="mb-0.5 flex items-center gap-1.5 text-xs text-neutral-400">
            <Clock className="h-3 w-3" /> Timezone
          </div>
          <p className="text-sm font-semibold text-neutral-800">{worker.timezone}</p>
        </div>
        <div className="col-span-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5">
          <div className="mb-0.5 flex items-center gap-1.5 text-xs text-neutral-400">
            <Key className="h-3 w-3" /> PGP Key
          </div>
          <p className="font-mono text-xs font-semibold text-neutral-800">{worker.pGPKey}</p>
        </div>
      </div>

      {worker.externalLinks.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {worker.externalLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
            >
              {link.platform}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
