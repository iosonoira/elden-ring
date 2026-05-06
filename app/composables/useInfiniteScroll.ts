export function useInfiniteScroll(onIntersect: () => void, rootMargin = '300px') {
  const sentinel = useTemplateRef<HTMLElement>('sentinel')
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!sentinel.value) return
    observer = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) onIntersect() },
      { rootMargin }
    )
    observer.observe(sentinel.value)
  })

  onUnmounted(() => observer?.disconnect())

  return { sentinel }
}