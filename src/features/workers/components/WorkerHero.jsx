import { ChevronDown, Share2, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useMessages } from "../../../context/MessageContext.jsx";

export default function WorkerHero({ worker }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { findOrCreateConversation } = useMessages();

  // Companies open a chat with this worker; guests are sent to login
  const handleChat = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    const conversationId = findOrCreateConversation({
      workerId: worker.slug,
      workerName: worker.name,
      companyId: user.id,
      companyName: user.name || "Company",
    });
    navigate(`/messages/${conversationId}`);
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-neutral-300 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 text-white">
      {worker.gridPattern && (
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      )}
      <div className="relative flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            {worker.status}
          </div>
          <span className="text-xs text-white/50">Ledger Node</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur-sm hover:bg-white/20">
            Default
          </button>
          <ChevronDown className="h-4 w-4 text-white/60" />
        </div>
      </div>

      <div className="relative px-8 pb-8">
        <div className="flex items-start gap-6">
          <div className="relative flex-shrink-0">
            <img
              src={worker.avatar}
              alt={worker.name}
              className="h-24 w-24 rounded-2xl border-2 border-white/20 object-cover"
            />
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-800 bg-emerald-500">
              <span className="h-2 w-2 rounded-full bg-white" />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{worker.name}</h1>
              {worker.verified.map((v) => (
                <span
                  key={v.label}
                  className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium"
                >
                  <svg className="h-3 w-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {v.label}
                </span>
              ))}
            </div>
            <p className="mt-1 text-lg text-white/80">{worker.title}</p>
            <p className="mt-1 text-sm text-white/50">{worker.tagline}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {worker.availableFor.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium"
                >
                  {item}
                </span>
              ))}
              <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Available for Pods, Solo &amp; Gigs
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90">
              Hire Directly
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">
              Invite to Pod
            </button>
            <div className="mt-1 flex gap-2">
              <button
                onClick={handleChat}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/20"
              >
                <MessageSquare className="h-3 w-3" />
                Chat
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/20">
                <Share2 className="h-3 w-3" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
