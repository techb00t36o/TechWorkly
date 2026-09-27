import { createContext, useContext, useReducer } from 'react'

const AuthContext = createContext(null)

// Authentication state shape: user identity, role, onboarding progress, and profile data.
// onboardingStep starts at 1; step 5 signals the confirmation screen (beyond the 4 data steps).
const initialState = {
  user: null,
  role: null,
  onboardingStep: 1,
  onboardingComplete: false,
  profile: {
    name: '',
    email: '',
    photo: null,
    bio: '',
    location: '',
  },
}

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        role: action.payload.role,
      }
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: { ...state.profile, ...action.payload },
      }
    case 'SET_ONBOARDING_STEP':
      return {
        ...state,
        onboardingStep: action.payload,
      }
    // On completion, jump to step 5 which renders the success/confirmation screen
    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        onboardingComplete: true,
        onboardingStep: 5,
      }
    // Reset entire state to initial to clear all user data from memory
    case 'LOGOUT':
      return { ...initialState }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  // useReducer is preferred over useState here because auth state has multiple
  // interdependent fields that need to be updated together atomically
  const [state, dispatch] = useReducer(authReducer, initialState)

  const setUser = (user, role) => {
    dispatch({ type: 'SET_USER', payload: { user, role } })
  }

  const updateProfile = (data) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: data })
  }

  const setOnboardingStep = (step) => {
    dispatch({ type: 'SET_ONBOARDING_STEP', payload: step })
  }

  const completeOnboarding = () => {
    dispatch({ type: 'COMPLETE_ONBOARDING' })
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  // Spread state + action helpers together so consumers get everything in one context value
  const value = {
    ...state,
    setUser,
    updateProfile,
    setOnboardingStep,
    completeOnboarding,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-only-export-components -- intentional: hook belongs with its provider
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
