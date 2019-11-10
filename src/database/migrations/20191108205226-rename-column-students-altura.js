module.exports = {
  up: queryInterface => {
    return queryInterface.renameColumn('students', 'altura', 'height');
  },
};
