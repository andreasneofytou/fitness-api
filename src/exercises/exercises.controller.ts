import { Roles } from '@app/auth/decorators/roles.decorator';
import { PaginatedResults } from '@app/common/dto/paginated-results.dto';
import { ExerciseDto } from '@app/exercises/dto/exercise.dto';
import { Exercise } from '@app/exercises/entities/exercise.entity';
import { UserRole } from '@app/users/entities/user.entity';
import { MapInterceptor } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExercisesService } from './exercises.service';

@ApiTags('Exercises')
@ApiBearerAuth()
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  create(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exercisesService.create(createExerciseDto);
  }

  @Get()
  getAll(): Promise<PaginatedResults<ExerciseDto>> {
    return this.exercisesService.findAllPaginated();
  }

  @UseInterceptors(MapInterceptor(Exercise, ExerciseDto))
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.exercisesService.findOne(id);
  }

  @UseInterceptors(MapInterceptor(Exercise, ExerciseDto))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    return this.exercisesService.update(id, updateExerciseDto);
  }

  @Roles(UserRole.admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exercisesService.remove(id);
  }
}
