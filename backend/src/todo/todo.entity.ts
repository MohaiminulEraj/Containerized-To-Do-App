import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../user/user.entity";

export type TodoCategory =
  | "work"
  | "personal"
  | "shopping"
  | "health"
  | "other";

@Entity("todos")
export class Todo {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  dueDate: Date;

  @Column({
    type: "enum",
    enum: ["work", "personal", "shopping", "health", "other"],
    default: "personal",
  })
  category: TodoCategory;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => User, (user) => user.todos)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
