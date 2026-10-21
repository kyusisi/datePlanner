import { plainToInstance, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsString,
  Matches,
  Max,
  Min,
  validateSync,
} from 'class-validator';

class Environment {
  @IsIn(['development', 'test', 'production'])
  NODE_ENV = 'development';

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  API_PORT = 3000;

  @IsString()
  @Matches(/^postgres(?:ql)?:\/\/\S+$/, {
    message: 'DATABASE_URL must be a PostgreSQL URL',
  })
  DATABASE_URL!: string;

  @IsString()
  CORS_ORIGIN!: string;
}

export function validateEnvironment(
  input: Record<string, unknown>,
): Environment {
  const environment = plainToInstance(Environment, input);
  const errors = validateSync(environment);
  if (errors.length) {
    // Do not include property values: DATABASE_URL contains credentials.
    throw new Error(
      `Invalid environment: ${errors.map((error) => error.property).join(', ')}`,
    );
  }
  const origins = environment.CORS_ORIGIN.split(',').map((origin) =>
    origin.trim(),
  );
  if (
    !origins.length ||
    origins.some((origin) => {
      try {
        const url = new URL(origin);
        return (
          !['http:', 'https:'].includes(url.protocol) || url.origin !== origin
        );
      } catch {
        return true;
      }
    })
  ) {
    throw new Error(
      'CORS_ORIGIN must contain comma-separated HTTP(S) origins without trailing slashes',
    );
  }
  return environment;
}
