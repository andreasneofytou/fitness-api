import { Roles } from '@app/auth/decorators/roles.decorator';
import { LocalUser } from '@app/auth/dto/local-user';
import { PaginatedResults } from '@app/common/dto/paginated-results.dto';
import { ExerciseDto } from '@app/exercises/dto/exercise.dto';
import { CustomExercise } from '@app/exercises/entities/custom-exercise.entity';
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
  Request,
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

  @Roles(UserRole.admin)
  @Post()
  create(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exercisesService.create(createExerciseDto);
  }

  @UseInterceptors(MapInterceptor(CustomExercise, ExerciseDto))
  @Post('custom')
  createCustom(
    @Request() { user: { id } }: { user: LocalUser },
    @Body() createExerciseDto: CreateExerciseDto,
  ) {
    return this.exercisesService.createCustom({
      authorId: id,
      ...createExerciseDto,
    });
  }

  @Get()
  getAll(): Promise<PaginatedResults<ExerciseDto>> {
    return this.exercisesService.findAllPaginated();
  }

  @UseInterceptors(
    MapInterceptor(CustomExercise, ExerciseDto, { isArray: true }),
  )
  @Get('custom')
  getAllCustom(
    @Request() { user: { id: userId } }: { user: LocalUser },
  ): Promise<CustomExercise[]> {
    return this.exercisesService.findAllCustom(userId);
  }

  @UseInterceptors(MapInterceptor(Exercise, ExerciseDto))
  @Get(':id')
  getOne(@Param('id') id: string): Promise<Exercise> {
    return this.exercisesService.findOne(id);
  }

  @UseInterceptors(MapInterceptor(CustomExercise, ExerciseDto))
  @Get('custom/:id')
  getOneCustom(@Param('id') id: string): Promise<CustomExercise> {
    return this.exercisesService.findOneCustom(id);
  }

  @Roles(UserRole.admin)
  @UseInterceptors(MapInterceptor(Exercise, ExerciseDto))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise> {
    return this.exercisesService.update(id, updateExerciseDto);
  }

  @UseInterceptors(MapInterceptor(CustomExercise, ExerciseDto))
  @Patch('custom/:id')
  updateCustom(
    @Request() { user: { id: userId } }: { user: LocalUser },
    @Param('id') id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ): Promise<CustomExercise> {
    return this.exercisesService.updateCustom(id, userId, updateExerciseDto);
  }

  @Roles(UserRole.admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exercisesService.remove(id);
  }
}
