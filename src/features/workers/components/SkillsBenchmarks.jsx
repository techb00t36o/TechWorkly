export default function SkillsBenchmarks({ skills }) {
  return (
    <section className="rounded-2xl border border-neutral-300 bg-white p-6">
      <h3 className="mb-4 text-lg font-bold text-neutral-900">
        Verified Technical Competency
      </h3>
      <div className="mb-6 space-y-3">
        {skills.map((skill) => (
          <div key={skill.name}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-700">
                {skill.name}
              </span>
              <span className="text-xs font-bold text-neutral-900">
                {skill.benchmark}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${skill.benchmark}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <h4 className="mb-3 text-sm font-bold text-neutral-900">
        Core Technical Stack
      </h4>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill.name}
            className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </section>
  );
}
