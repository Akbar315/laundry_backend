'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First create the enum type for booking status
    await queryInterface.sequelize.query(
      'CREATE TYPE "enum_bookings_status" AS ENUM (\'Active\', \'Completed\', \'Cancelled\');'
    );

    await queryInterface.createTable('bookings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      order_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      services: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      booking_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      booking_time: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('Active', 'Completed', 'Cancelled'),
        defaultValue: 'Active',
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bookings');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_bookings_status";');
  }
};