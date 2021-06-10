import { IsEnum, IsOptional } from 'class-validator';

export enum Camera {
  FHAZ = 'FHAZ',
  RHAZ = 'RHAZ',
  MAST = 'MAST',
  CHEMCAM = 'CHEMCAM',
  MAHLI = 'MAHLI',
  MARDI = 'MARDI',
  NAVCAM = 'NAVCAM',
  PANCAM = 'PANCAM',
  MINITES = 'MINITES',
}

export enum Rover {
  Curiosity = 'Curiosity',
  Opportunity = 'Opportunity',
  Spirit = 'Spirit',
}

export enum DateSort {
  ASCENDING = '1',
  DESCENDING = '-1',
}

export class GalleryQueryDto {
  @IsOptional()
  @IsEnum(Rover)
  rover?: Rover;

  @IsOptional()
  @IsEnum(Camera)
  camera?: Camera;

  @IsOptional()
  @IsEnum(DateSort)
  sortByDate?: DateSort;
}
