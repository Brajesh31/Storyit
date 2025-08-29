export const formatDate = (dateString: string): string => {
  // console.log('dateString: ', dateString);
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }
  return date.toLocaleDateString('en-US', options)
}
