import { useState } from "react";
import { useParams } from "react-router-dom";
import { getWorkerBySlug } from "./mockData";
import WorkerHero from "./components/WorkerHero";
import WorkerStatsBar from "./components/WorkerStatsBar";
import WorkerFinancialBar from "./components/WorkerFinancialBar";
import WorkerBio from "./components/WorkerBio";
import SkillsBenchmarks from "./components/SkillsBenchmarks";
import GigsSection from "./components/GigsSection";
import PodEngagements from "./components/PodEngagements";
import SoloContracts from "./components/SoloContracts";
import WorkerReviews from "./components/WorkerReviews";
import WorkerSidebar from "./components/WorkerSidebar";
import CaseStudies from "./components/CaseStudies";
import { useReviews } from "../../context/ReviewContext.jsx";

export default function WorkerProfilePage() {
  const { slug } = useParams();
  // Slug-based lookup from mock data; returns undefined if no match
  const worker = getWorkerBySlug(slug);
  const [activeTab, setActiveTab] = useState("overview");
  // Live dual reviews submitted this session (public only) prepended to mock history
  const { getProfileSummary } = useReviews();
  const live = worker
    ? getProfileSummary("worker", worker.name)
    : { list: [], count: 0, overall: 0 };

  // Early return prevents rendering the full layout with an undefined worker
  if (!worker) {
    return (
      <div className="py-20 text-center">
        <h1 className="mb-2 text-2xl font-bold text-neutral-900">
          Worker Not Found
        </h1>
        <p className="text-neutral-500">
          The worker profile you are looking for does not exist.
        </p>
      </div>
    );
  }

  // Merge session reviews into the mock shape WorkerReviews expects
  const liveRecent = live.list.map((r) => ({
    author: r.reviewerName,
    role: r.reviewerRole === "company" ? "Hiring Company" : "Worker",
    rating: r.ratings.overall,
    date: new Date(r.createdAt).toLocaleDateString(),
    text: r.comment || "(No written feedback)",
    project: r.projectTitle,
  }));
  const reviews = {
    ...worker.reviews,
    recent: [...liveRecent, ...(worker.reviews.recent || [])],
    distribution: {
      ...worker.reviews.distribution,
      5:
        (worker.reviews.distribution[5] || 0) +
        live.list.filter((r) => r.ratings.overall >= 4.5).length,
    },
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "portfolio", label: "Portfolio" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <div className="space-y-6">
      <WorkerHero worker={worker} />
      <WorkerStatsBar stats={worker.stats} />
      <WorkerFinancialBar financials={worker.financials} />

      <div className="flex gap-2 rounded-xl border border-neutral-200 bg-white p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-white"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          {/* Tab-based conditional rendering: only the active tab's children mount */}
          {activeTab === "overview" && (
            <>
              <WorkerBio worker={worker} />
              <SkillsBenchmarks skills={worker.skills} />
              <CaseStudies studies={worker.caseStudies} />
            </>
          )}
          {activeTab === "portfolio" && (
            <>
              <GigsSection gigs={worker.gigs} workerSlug={worker.slug} />
              <PodEngagements pods={worker.pods} />
              <SoloContracts contracts={worker.soloContracts} />
            </>
          )}
          {activeTab === "reviews" && (
            <WorkerReviews reviews={reviews} />
          )}
        </div>

        <div className="col-span-4">
          <WorkerSidebar worker={worker} />
        </div>
      </div>
    </div>
  );
}
