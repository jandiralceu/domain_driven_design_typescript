import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
  tableName: 'customers',
  timestamps: false,
})
export class CustomerModel extends Model {
  @PrimaryKey
  @Column
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare street: string;

  @Column({ allowNull: false })
  declare streetNumber: string;

  @Column({ allowNull: false })
  declare city: string;

  @Column({ allowNull: false })
  declare zipCode: string;

  @Column({ allowNull: false })
  declare isActive: boolean;

  @Column({ allowNull: false })
  declare rewardPoints: number;
}
