export const getTaskAttribute = (array: any[], id: number | null | undefined, attribute: string) => {
  return (array.find(item => item.id === id))?.[attribute];
}