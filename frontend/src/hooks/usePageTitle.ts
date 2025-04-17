import { useEffect } from 'react'

export function usePageTitle(title: string) {
  useEffect(() => {
    // Set the base title of your application
    const baseTitle = 'Operation: Passion Pursuit'
    
    // Update the document title
    document.title = title ? `${title} | ${baseTitle}` : baseTitle

    // Cleanup - reset to base title when component unmounts
    return () => {
      document.title = baseTitle
    }
  }, [title])
} 