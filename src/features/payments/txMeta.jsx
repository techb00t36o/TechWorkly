// Shared transaction row metadata: type icons, labels, sign direction.
// Used by TransactionHistory and condensed previews on both dashboards.
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Lock,
  Unlock,
  RotateCcw,
  Banknote,
} from 'lucide-react'

// type → label shown to both roles (perspective is applied via role)
export const typeMeta = {
  funded: { label: 'Escrow Funded', icon: Lock, color: 'text-primary bg-primary-light' },
  released: { label: 'Payment Released', icon: Unlock, color: 'text-success bg-success/10' },
  withdrawal: { label: 'Withdrawal', icon: ArrowUpFromLine, color: 'text-warning bg-warning/10' },
  refund: { label: 'Refund', icon: RotateCcw, color: 'text-info bg-info/10' },
  deposit: { label: 'Deposit', icon: ArrowDownToLine, color: 'text-success bg-success/10' },
}

export const statusStyles = {
  completed: 'bg-success/10 text-success',
  pending: 'bg-warning/10 text-warning',
  failed: 'bg-danger/10 text-danger',
}

// Money sign from the viewing role's perspective
export function signedAmount(tx, role) {
  const inflowForWorker =
    role === 'worker' && (tx.type === 'released' || tx.type === 'deposit')
  const inflowForCompany = role === 'company' && (tx.type === 'deposit' || tx.type === 'refund')
  const outflow =
    role === 'company' && (tx.type === 'funded' || tx.type === 'released')
      ? true
      : role === 'worker' && tx.type === 'withdrawal'
  if (inflowForWorker || inflowForCompany) return tx.amount
  if (outflow) return -tx.amount
  // Team-role escrow funding is outflow for company (handled above); worker
  // never "pays", so remaining types default positive for worker visibility
  return tx.amount
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const typeFilters = [
  { key: 'all', label: 'All' },
  { key: 'funded', label: 'Escrow Funded' },
  { key: 'released', label: 'Payment Released' },
  { key: 'withdrawal', label: 'Withdrawal' },
  { key: 'refund', label: 'Refund' },
  { key: 'deposit', label: 'Deposit' },
]

export const BankIcon = Banknote
