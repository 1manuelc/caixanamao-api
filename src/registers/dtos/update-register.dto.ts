import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateRegisterDto } from './create-register.dto';

export class UpdateRegisterDto extends PartialType(
  OmitType(CreateRegisterDto, ['iduser']),
) {}
