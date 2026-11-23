import { useState } from 'react'

type Profile = { name: string; email: string }
type Session = {
  profile: Profile | null
  guest?: boolean
  favorites: string[]
  enrollments: Record<string, 'active' | 'complete'>
}

const key = 'acadup.session.v1'
const initial: Session = {
  profile: null,
  favorites: ['ia', 'oratoria', 'excel', 'foto', 'saude'],
  enrollments: { marketing: 'active', projetos: 'complete', excel: 'complete', foto: 'complete', oratoria: 'complete' },
}

export function useSession() {
  const [session, setSession] = useState<Session>(() => {
    try {
      const stored = sessionStorage.getItem(key)
      return stored ? JSON.parse(stored) as Session : initial
    } catch {
      return initial
    }
  })

  function save(next: Session) {
    setSession(next)
    try {
      sessionStorage.setItem(key, JSON.stringify(next))
    } catch {
      // A página continua funcionando quando o armazenamento está indisponível.
    }
  }

  return { session, save, clear: () => save(initial) }
}
