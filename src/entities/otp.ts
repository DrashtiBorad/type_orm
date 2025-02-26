import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Otp {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  otpCode: number;

  @Column({ type: "timestamp", nullable: false })
  expiredAt: Date;
}
