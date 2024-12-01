import { IsString, IsEnum, IsDateString, IsOptional, IsBoolean } from 'class-validator';
import { TodoCategory } from '../todo.entity';

export class CreateTodoDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  dueDate: string;

  @IsEnum(['work', 'personal', 'shopping', 'health', 'other'])
  category: TodoCategory;
}

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(['work', 'personal', 'shopping', 'health', 'other'])
  category?: TodoCategory;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}