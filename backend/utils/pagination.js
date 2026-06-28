// Reusable pagination helpers used by every list endpoint, so we never
// repeat the "parse page/limit and calculate skip" logic.

// Read page and limit from the query string and return safe values.
// Defaults: page 1, limit 10. Limit is capped at 100 to protect the DB.
const getPagination = (query) => {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (isNaN(page) || page < 1) {
    page = 1;
  }
  if (isNaN(limit) || limit < 1) {
    limit = 10;
  }
  if (limit > 100) {
    limit = 100;
  }

  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// Build the meta object the frontend uses to render page controls.
const buildPageMeta = (page, limit, totalItems) => {
  const totalPages = Math.ceil(totalItems / limit) || 1;
  return {
    page: page,
    limit: limit,
    totalItems: totalItems,
    totalPages: totalPages,
  };
};

module.exports = { getPagination, buildPageMeta };
