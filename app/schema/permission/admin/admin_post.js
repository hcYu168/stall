'use strict';

module.exports = {
  $async: true,
  $merge: {
    source: {
      allOf: [
        { $ref: 'schema.admin.admin#' },
        { $ref: 'schema.admin.adminPwd#' },
      ],
    },
    with: {},
  },
};
