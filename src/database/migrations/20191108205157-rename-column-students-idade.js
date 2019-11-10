module.exports = {
  up: queryInterface => {
    return queryInterface.renameColumn('students', 'idade', 'age');
  },
};
