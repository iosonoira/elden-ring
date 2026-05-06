import { useSaveStore } from '~/stores/useSaveStore'

const STORAGE_KEY = 'gilded-reliquary-save'

export default defineNuxtPlugin(() => {
  const store = useSaveStore()

  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      const saved = JSON.parse(raw)
      store.$patch({
        characters: saved.characters,
        isLoaded: saved.isLoaded,
        selectedCharacterIndex: saved.selectedCharacterIndex,
        foundItemIds: saved.foundItemIds,
        isDlc: saved.isDlc
      })
    } catch {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }

  // Avvia il caricamento del DB subito, senza aspettare il mount del layout
  store.loadDatabase()

  watch(
    () => ({
      characters: store.characters,
      isLoaded: store.isLoaded,
      selectedCharacterIndex: store.selectedCharacterIndex,
      foundItemIds: store.foundItemIds,
      isDlc: store.isDlc
    }),
    (state) => {
      if (!state.isLoaded) {
        sessionStorage.removeItem(STORAGE_KEY)
        return
      }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    },
    { deep: true }
  )
})