import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Categories {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  categories_name: string;
}
