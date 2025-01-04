module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define(
      "OrderItem",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        orderId: {
          type: DataTypes.INTEGER,
          references: {
            model: "Order",
            key: "id",
          },
        },
        inventoryId: {
            type: DataTypes.INTEGER,
            references: {
              model: "Inventory",
              key: "id",
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
        perUnitPrice: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
        },
        totalAmount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
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
        deletedAt: {
          type: DataTypes.DATE,
          defaultValue: null,
        },
      },
      {
        tableName: "OrderItem",
        paranoid: true,
      }
    );
  
    OrderItem.associate = (models) => {
        OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });
        OrderItem.belongsTo(models.Inventory, { foreignKey: 'inventoryId' });
    };
    return OrderItem;
  };
  