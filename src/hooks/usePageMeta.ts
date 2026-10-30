import { useEffect } from 'react'

type MetaKey = { key: string; attribute: 'name' | 'property' }

const setMetaContent = ({ key, attribute }: MetaKey, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

const usePageMeta = (title: string, description: string) => {
  useEffect(() => {
    const canonicalUrl = `${window.location.origin}${window.location.pathname}`
    document.title = title
    setMetaContent({ key: 'description', attribute: 'name' }, description)
    setMetaContent({ key: 'og:title', attribute: 'property' }, title)
    setMetaContent({ key: 'og:description', attribute: 'property' }, description)
    setMetaContent({ key: 'og:url', attribute: 'property' }, canonicalUrl)
    setMetaContent({ key: 'twitter:title', attribute: 'name' }, title)
    setMetaContent({ key: 'twitter:description', attribute: 'name' }, description)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', canonicalUrl)
  }, [title, description])
}

export default usePageMeta
