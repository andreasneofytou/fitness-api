import { PaginatedResults } from '@app/common/dto/paginated-results.dto';
import { ExerciseDto } from '@app/exercises/dto/exercise.dto';
import {
  CustomExercise,
  CustomExerciseDocument,
} from '@app/exercises/entities/custom-exercise.entity';
import {
  Exercise,
  ExerciseDocument,
} from '@app/exercises/entities/exercise.entity';
import { ExercisesMapper } from '@app/exercises/exercises.mapper';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  private readonly logger = new Logger(ExercisesService.name);
  constructor(
    @InjectModel(Exercise.name)
    private readonly exerciseModel: Model<ExerciseDocument>,
    @InjectModel(CustomExercise.name)
    private readonly customExerciseModel: Model<CustomExerciseDocument>,
    private readonly exercisesMapper: ExercisesMapper,
  ) {
    this.logger.log('Initialised');
  }

  async create(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    return await this.exerciseModel.create(createExerciseDto);
  }

  async createCustom(
    createExerciseDto: CreateExerciseDto,
  ): Promise<CustomExercise> {
    return await this.customExerciseModel.create(createExerciseDto);
  }

  async findAll(): Promise<Exercise[]> {
    return await this.exerciseModel.find();
  }

  async findAllCustom(userId: string): Promise<CustomExercise[]> {
    return await this.customExerciseModel.find({ authorId: userId });
  }

  async findAllPaginated(
    limit = 12,
    page = 1,
  ): Promise<PaginatedResults<ExerciseDto>> {
    const skip = limit * (page - 1);
    const query = {};
    const [
      {
        results,
        totalCount: [{ totalCount } = [{}]],
      },
    ] = await this.exerciseModel.aggregate([
      {
        $facet: {
          results: [{ $match: query }, { $skip: skip }, { $limit: limit }],
          totalCount: [{ $match: query }, { $count: 'totalCount' }],
        },
      },
    ]);

    return {
      limit,
      page,
      results: this.exercisesMapper.mapper.mapArray(
        results,
        Exercise,
        ExerciseDto,
      ),
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  async findOne(id: string): Promise<Exercise> {
    return this.exerciseModel.findOne({ _id: id });
  }

  async findOneCustom(id: string): Promise<CustomExercise> {
    return this.customExerciseModel.findOne({ _id: id });
  }

  async update(
    id: string,
    updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise> {
    return this.exerciseModel.findOneAndUpdate({ _id: id }, updateExerciseDto);
  }

  async updateCustom(
    id: string,
    authorId: string,
    updateExerciseDto: UpdateExerciseDto,
  ): Promise<CustomExercise> {
    return this.customExerciseModel.findOneAndUpdate(
      { _id: id },
      updateExerciseDto,
    );
  }

  async remove(id: string) {
    return this.exerciseModel.deleteOne({ _id: id });
  }

  async removeCustom(id: string) {
    return this.customExerciseModel.deleteOne({ _id: id });
  }
}
