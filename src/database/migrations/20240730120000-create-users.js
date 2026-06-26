module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'first_name'
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'last_name'
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phoneCode: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'phone_code'
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { len: [10, 15] },
        comment: 'Phone number of the user'
      },
      phoneVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: 'phone_verified'
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'date_of_birth'
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: true
      },
      loggedIn: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'logged_in'
      },
      lastLoggedInIp: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'last_logged_in_ip'
      },
      loggedInAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'logged_in_at'
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'image_url'
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true
      },
      zipCode: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'zip_code'
      },
      role: {
        type: DataTypes.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user',
        field: 'role'
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active'
      },
      contactId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'contact_id'
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'updated_at'
      }
    })
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('users')
  }
}
