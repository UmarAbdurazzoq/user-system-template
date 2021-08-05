module.exports = class Models {
    static async UserModels ({ DataTypes}, sequelize) {
      return sequelize.define("users", {
          id: {
              type: DataTypes.UUID,
              defaultValue: DataTypes.UUIDV4(),
              primaryKey: true,
          },
          password: {
              type: DataTypes.STRING(64),
              allowNull: false,
              unique: true
          },
          phone_number: {
            type: Sequelize.DataTypes.STRING(12),
            is: /^998[389][01345789][0-9]{7}$/,
            allowNull: false,
        },
          first_name: {
              type: DataTypes.STRING(32),
              allowNull: true,
          },
          last_name: {
              type: DataTypes.STRING(64),
              allowNull: true,
          },
          role: {
              type: DataTypes.ENUM,
              values: ["admin", "super-admin", "income-mangaer", "outcome-manager"],
              allowNull: false,
              defaultValue: "admin",
          },
      });
  }

  static async SessionModel({ DataTypes }, sequelize) {
      return sequelize.define("sessions", {
          id: {
              type: DataTypes.UUID,
              defaultValue: DataTypes.UUIDV4(),
              primaryKey: true,
          },
          user_agent: {
              type: DataTypes.STRING,
              allowNull: false,
          },
          ip_address: {
              type: DataTypes.INET,
              allowNull: true,
          },
          role: {
              type: DataTypes.ENUM,
              values: ["admin", "super-admin", "income-mangaer", "outcome-manager"],
              allowNull: false,
              defaultValue: "admin",
          },
      });
  }

};
