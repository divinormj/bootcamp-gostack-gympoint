module.exports = {
  up: queryInterface => {
    return queryInterface.renameColumn('students', 'nome', 'name');
  },
};
