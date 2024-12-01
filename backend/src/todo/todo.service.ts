import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Todo } from './todo.entity';
import { CreateTodoDto, UpdateTodoDto } from './dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async findAll(user: User): Promise<Todo[]> {
    return this.todoRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
    });
  }

  async create(user: User, dto: CreateTodoDto): Promise<Todo> {
    const todo = this.todoRepository.create({
      ...dto,
      user,
    });
    return this.todoRepository.save(todo);
  }

  async update(user: User, id: string, dto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    Object.assign(todo, dto);
    return this.todoRepository.save(todo);
  }

  async delete(user: User, id: string): Promise<void> {
    const todo = await this.todoRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    await this.todoRepository.remove(todo);
  }

  async toggle(user: User, id: string): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    todo.completed = !todo.completed;
    return this.todoRepository.save(todo);
  }
}