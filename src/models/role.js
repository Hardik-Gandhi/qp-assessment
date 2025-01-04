module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.ENUM("ADMIN", "USER"),
      },
    },
    {
      tableName: "Role",
      timestamps: false, // Disable createdAt and updatedAt
    }
  );

  Role.associate = (models) => {};
  return Role;
};
