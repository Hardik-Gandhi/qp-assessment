module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    phoneCountryCode: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "BLOCKED", "DELETED"),
    },
    profileImage: {
      type: DataTypes.STRING,
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Role",
        key: "id",
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'User',
  });
  
  User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: 'roleId' });
    User.hasMany(models.Order, { foreignKey: 'userId' });
  };

  return User;
};
