import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../user/user.entity';
import { TodoService } from './todo.service';
import { CreateTodoDto, UpdateTodoDto } from './dto';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()
  getTodos(@GetUser() user: User) {
    return this.todoService.findAll(user);
  }

  @Post()
  createTodo(@GetUser() user: User, @Body() dto: CreateTodoDto) {
    return this.todoService.create(user, dto);
  }

  @Patch(':id')
  updateTodo(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateTodoDto,
  ) {
    return this.todoService.update(user, id, dto);
  }

  @Delete(':id')
  deleteTodo(@GetUser() user: User, @Param('id') id: string) {
    return this.todoService.delete(user, id);
  }

  @Patch(':id/toggle')
  toggleTodo(@GetUser() user: User, @Param('id') id: string) {
    return this.todoService.toggle(user, id);
  }
}