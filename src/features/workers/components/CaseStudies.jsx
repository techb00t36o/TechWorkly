export default function CaseStudies({ studies }) {
  if (!studies || studies.length === 0) return null;

  return (
    <section className="rounded-2xl border border-neutral-300 bg-white p-6">
      <h3 className="mb-4 text-lg font-bold text-neutral-900">
        Architecture Benchmark
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {studies.map((study, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5"
          >
            <h4 className="text-sm font-bold text-neutral-900">{study.title}</h4>
            <p className="mb-3 text-[11px] text-neutral-400">{study.subtitle}</p>
            <div className="grid grid-cols-3 gap-2">
              {study.metrics.map((m) => (
                <div key={m.label} className="text-center">
                  <p className="text-lg font-bold text-primary">{m.value}</p>
                  <p className="text-[11px] text-neutral-400">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
