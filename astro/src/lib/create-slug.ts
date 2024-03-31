export function createSlug (title: string) {
    return (
      title
        // remove leading & trailing whitespace
        .trim()
        // remove special characters
        .replace(/[^A-Za-z0-9\s]/g, '')
        // replace spaces
        .replace(/\s+/g, '-')
        // remove leading & trailing separtors
        .replace(/^-+|-+$/g, '')
        // output lowercase
        .toLowerCase()
    )
  }