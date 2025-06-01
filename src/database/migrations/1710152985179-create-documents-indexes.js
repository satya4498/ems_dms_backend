module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return await Promise.all([
      queryInterface.addIndex('public.documents', {
        unique: true,
        fields: ['user_id', 'document_label_id'],
        type: '',
        parser: null,
        name: 'documents_user_id_document_label_id'
      })
    ])
  },
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface, _) => {
    return await Promise.all([
      queryInterface.removeIndex(
        'public.documents',
        'documents_user_id_document_label_id'
      )
    ])
  }
}
