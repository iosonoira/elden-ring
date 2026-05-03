export const useEldenRingApi = () => {
  const fetchEntity = <T>(category: string, id: string) => {
    return useAsyncData(
      `wiki-${category}-${id}`,
      () => $fetch<T>(`https://eldenring.fanapis.com/api/${category}/${id}`)
    );
  };

  return {
    fetchEntity
  };
};
