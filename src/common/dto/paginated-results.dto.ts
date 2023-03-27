import { ExerciseDto } from '@app/exercises/dto/exercise.dto';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

export class PaginatedResults<T> {
  page: number;

  limit: number;

  totalCount: number;

  totalPages: number;

  @ApiProperty({
    isArray: true,
    items: {
      oneOf: [{ $ref: getSchemaPath(ExerciseDto) }],
    },
  })
  results: T[];
}
