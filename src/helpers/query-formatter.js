import store from '@/store'

export default {
  ensureValidPage (page) {
    const validPage = (page && (!isNaN(page)) && page > 1 && page <= 999999999)
      ? parseInt(page, 10)
      : 1

    return validPage > 0 ? validPage : 1
  },
  generateFilesQuery (tagsString, sort, direction, namespaces, page) {
    return {
      tags: tagsString.length
        ? tagsString
          .split(' ')
          .map(tag => tag.trim())
          .filter(tag => tag.length)
          .filter((tag, index, tags) => tags.indexOf(tag) === index)
        : [],
      sort: sort || undefined,
      direction: direction || undefined,
      namespaces: sort === 'namespaces' && namespaces.length
        ? namespaces
        : undefined,
      page: page
    }
  },
  generateDefaultFilesQuery (tags) {
    return this.generateFilesQuery(
      tags || '',
      store.state.settings.filesSorting,
      store.state.settings.filesSortingDirection,
      store.state.settings.filesSortingNamespaces,
      1
    )
  },
  generateTagsQuery (contains, sort, direction, page) {
    return {
      contains: contains !== '' ? contains : undefined,
      sort: sort || undefined,
      direction: direction || undefined,
      page: page
    }
  }
}
