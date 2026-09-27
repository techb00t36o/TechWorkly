// Reviews state (PRD 5.10): dual Company↔Worker ratings, team/peer options,
// and public vs private visibility on completed contracts.
import { createContext, useContext, useReducer, useMemo } from 'react'

const ReviewContext = createContext(null)

// Rating categories differ by direction (Leave Review spec §2)
const companyCategories = ['quality', 'communication', 'timeliness']
const workerCategories = ['clarity', 'communication', 'paymentPromptness']

// One seed already public so profile review tabs have live data on day one.
// c-5 is the seeded completed contract (Full-Stack Dashboard Developer).
const sampleReviews = [
  {
    id: 'rv-1',
    contractId: 'c-5',
    sourceType: 'JOB',
    projectTitle: 'Full-Stack Dashboard Developer',
    reviewerRole: 'company',
    reviewerName: 'Nimbus Labs',
    revieweeRole: 'worker',
    revieweeName: 'Amina K.',
    ratings: { quality: 5, communication: 5, timeliness: 4, overall: 4.7 },
    comment:
      'Shipped the MVP dashboard ahead of schedule and the charts handoff was rock solid. Communication was clear throughout both milestones.',
    visibility: 'public',
    teamRating: null,
    peerRatings: [],
    createdAt: '2026-09-01T12:00:00Z',
  },
  // Seed gig-tagged review so GigDetailPage “Gig reviews” has live data (PRD 5.6)
  {
    id: 'rv-2',
    contractId: 'go-1',
    sourceType: 'GIG_ORDER',
    projectTitle: 'React Performance Audit',
    reviewerRole: 'company',
    reviewerName: 'Nimbus Labs',
    revieweeRole: 'worker',
    revieweeName: 'Amina K.',
    ratings: { quality: 5, communication: 5, timeliness: 5, overall: 5 },
    comment:
      'Found three render hotspots we had missed and shipped a fix PR the same day. Bundle dropped 18%.',
    visibility: 'public',
    teamRating: null,
    peerRatings: [],
    createdAt: '2026-08-10T12:00:00Z',
  },
]

// Id generation stays in the reducer so components stay pure.
function reviewReducer(state, action) {
  switch (action.type) {
    case 'SUBMIT_REVIEW': {
      const seq = state.seq + 1
      return {
        ...state,
        seq,
        reviews: [
          {
            ...action.payload,
            id: `rv-${seq}`,
            createdAt: new Date().toISOString(),
          },
          ...state.reviews,
        ],
      }
    }
    default:
      return state
  }
}

// Overall is the arithmetic mean of the directional categories (rounded to 1dp)
function averageOverall(categories, ratings) {
  const values = categories.map((c) => ratings[c] || 0).filter((v) => v > 0)
  if (!values.length) return 0
  const sum = values.reduce((s, v) => s + v, 0)
  return Math.round((sum / values.length) * 10) / 10
}

export function ReviewProvider({ children }) {
  const [state, dispatch] = useReducer(reviewReducer, {
    reviews: sampleReviews,
    seq: 100,
  })

  const submitReview = (data) => {
    const categories =
      data.reviewerRole === 'company' ? companyCategories : workerCategories
    const overall =
      data.ratings.overall || averageOverall(categories, data.ratings)
    dispatch({
      type: 'SUBMIT_REVIEW',
      payload: {
        ...data,
        ratings: { ...data.ratings, overall },
        peerRatings: data.peerRatings || [],
        teamRating: data.teamRating ?? null,
        comment: data.comment?.trim() || null,
      },
    })
  }

  // One review per (contract, reviewer role) — dual flow means both sides submit
  const hasReview = (contractId, reviewerRole) =>
    state.reviews.some(
      (r) => r.contractId === contractId && r.reviewerRole === reviewerRole,
    )

  const getReviewsForContract = (contractId) =>
    state.reviews.filter((r) => r.contractId === contractId)

  // Public only: private flags never leave the platform (Leave Review §5)
  const getPublicReviews = ({ revieweeRole, revieweeName, sourceType } = {}) =>
    state.reviews.filter(
      (r) =>
        r.visibility === 'public' &&
        (!revieweeRole || r.revieweeRole === revieweeRole) &&
        (!revieweeName || r.revieweeName === revieweeName) &&
        (!sourceType || r.sourceType === sourceType),
    )

  // Aggregate for a worker/company profile (public reviews only)
  const getProfileSummary = (revieweeRole, revieweeName) => {
    const list = getPublicReviews({ revieweeRole, revieweeName })
    const overall =
      list.length > 0
        ? Math.round(
            (list.reduce((s, r) => s + (r.ratings.overall || 0), 0) /
              list.length) *
              10,
          ) / 10
        : 0
    return { list, count: list.length, overall }
  }

  const value = useMemo(
    () => ({
      reviews: state.reviews,
      submitReview,
      hasReview,
      getReviewsForContract,
      getPublicReviews,
      getProfileSummary,
      companyCategories,
      workerCategories,
    }),
    // submitReview closes over dispatch only; helpers recompute from state.reviews
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.reviews],
  )

  return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
}

// eslint-disable-next-line react-only-export-components -- intentional: hook belongs with its provider
export function useReviews() {
  const context = useContext(ReviewContext)
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider')
  }
  return context
}
