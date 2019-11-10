module.exports = {
  up: queryInterface => {
    return queryInterface.renameColumn('students', 'peso', 'weight');
  },
};
