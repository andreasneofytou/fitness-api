import { ExerciseDto } from '@app/exercises/dto/exercise.dto';
import { CustomExercise } from '@app/exercises/entities/custom-exercise.entity';
import { Exercise } from '@app/exercises/entities/exercise.entity';
import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExercisesMapper extends AutomapperProfile {
  constructor(@InjectMapper() public mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        Exercise,
        ExerciseDto,
        forMember(
          (dto) => dto.id,
          mapFrom((entity) => entity['_id']),
        ),
      );
      createMap(
        mapper,
        CustomExercise,
        ExerciseDto,
        forMember(
          (dto) => dto.id,
          mapFrom((entity) => entity['_id']),
        ),
      );
    };
  }
}
