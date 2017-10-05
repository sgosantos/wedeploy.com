import {isServerSide} from 'metal';

/**
 * @return {string}
 */
export function getUserInputQueryValues() {
  let genres;
  let series;
  if (!isServerSide()) {
    genres = window.searchGenres.search.value.trim();
    series = window.searchSeries.search.value.trim();
  }
  return {genres, series};
}

/**
 * @param {DataDemo} dataDemoInstance
 * @return {string}
 */
export function generateSnippetAndroid(dataDemoInstance) {
  const {genres, series} = getUserInputQueryValues();
  const {
    currentPage,
    genresSelected,
    itemsPerPage,
    ratingsSelected,
    yearsSelected,
  } = dataDemoInstance;

  let value = `WeDeploy weDeploy = new WeDeploy.Builder().build();`;

  value += `\n\nweDeploy.data("https://data-tv.wedeploy.io")`;

  let filters = [];

  if (series) {
    filters.push(`Filter.prefix("name", "${series}")`);
  }
  if (genres) {
    filters.push(`Filter.prefix("genres", "${genres}")`);
  }
  for (let genre of Object.keys(genresSelected)) {
    filters.push(`Filter.any("genres", "${genre}")`);
  }
  for (let rating of Object.keys(ratingsSelected)) {
    filters.push(`Filter.gte("rating", "${rating}")`);
  }

  const years = Object.keys(yearsSelected);
  if (years.length) {
    filters.push(`Filter.equal("year", ${years.pop()})`);
  }
  for (let year of years) {
    filters.push(`Filter.or("year", ${year})`);
  }
  if (filters.length > 0) {
    const combinedFilters = filters
      .reduce((acc, filter, idx) => idx === 0 ? filter : acc + `\n\t\t.and(${filter})`, '');
    value += `\n\t.where(\n\t${combinedFilters}\n\t)`;
  }

  value += `\n\t.orderBy("rating", SortOrder.DESCENDING)
\t.aggregate(Aggregation.terms("years", "year"))
\t.aggregate(Aggregation.terms("genres", "genres"))
\t.highlight("name")
\t.limit(${itemsPerPage})
\t.offset(${itemsPerPage * currentPage})
\t.search("shows")
\t.execute();`;

  return value;
}

/**
 * @param {DataDemo} dataDemoInstance
 * @return {string}
 */
export function generateSnippetSwift(dataDemoInstance) {
  const {genres, series} = getUserInputQueryValues();
  const {
    currentPage,
    genresSelected,
    itemsPerPage,
    ratingsSelected,
    yearsSelected,
  } = dataDemoInstance;

  let value = `WeDeploy.data("https://data-tv.wedeploy.io")`;
  if (series) {
    value += `\n\t.prefix(field: "name", value: "${series}")`;
  }
  if (genres) {
    value += `\n\t.prefix(field: "genres", value: "${genres}")`;
  }
  for (let genre of Object.keys(genresSelected)) {
    value += `\n\t.any(field: "genres", value: ["${genre}"])`;
  }
  for (let rating of Object.keys(ratingsSelected)) {
    value += `\n\t.gte(field: "rating", value: "${rating}")`;
  }

  let filter = ``;
  const years = Object.keys(yearsSelected);
  if (years.length) {
    filter += `\tFilter\n\t\t\t.equal("year", ${years.pop()})`;
  }
  for (let year of years) {
    filter += `\n\t\t\t.or(Filter.equal("year", ${year}))`;
  }
  if (filter) {
    value += `\n\t.where(filter: \n\t${filter}\n\t)`;
  }

  value += `\n\t.orderBy(field: "rating", order: .DESC)
\t.aggregate(name: "years", field: "year", op: "terms")
\t.aggregate(name: "genres", field: "genres", op: "terms")
\t.highlight("name")
\t.limit(${itemsPerPage})
\t.offset(${itemsPerPage * currentPage})
\t.search(resourcePath: "shows")`;

  return value;
}

/**
 * @param {DataDemo} dataDemoInstance
 * @return {string}
 */
export function generateSnippetWeb(dataDemoInstance) {
  const {genres, series} = getUserInputQueryValues();
  const {
    currentPage,
    genresSelected,
    itemsPerPage,
    ratingsSelected,
    yearsSelected,
  } = dataDemoInstance;

  let value = `WeDeploy.data('https://data-tv.wedeploy.io')`;
  if (series) {
    value += `\n\t.prefix('name', '${series}')`;
  }
  if (genres) {
    value += `\n\t.prefix('genres', '${genres}')`;
  }
  for (let genre of Object.keys(genresSelected)) {
    value += `\n\t.any('genres', '${genre}')`;
  }
  for (let rating of Object.keys(ratingsSelected)) {
    value += `\n\t.gte('rating', '${rating}')`;
  }

  let filter = ``;
  const years = Object.keys(yearsSelected);
  if (years.length) {
    filter += `\tFilter\n\t\t\t.equal('year', ${years.pop()})`;
  }
  for (let year of years) {
    filter += `\n\t\t\t.or('year', ${year})`;
  }
  if (filter) {
    value += `\n\t.where(\n\t${filter}\n\t)`;
  }

  value += `\n\t.orderBy('rating', 'desc')
\t.aggregate('years', 'year')
\t.aggregate('genres', 'genres')
\t.highlight('name')
\t.limit(${itemsPerPage})
\t.offset(${itemsPerPage * currentPage})
\t.search('shows');`;

  return value;
}
