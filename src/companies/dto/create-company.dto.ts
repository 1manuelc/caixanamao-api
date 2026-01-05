import { IsString, Matches, MaxLength } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @MaxLength(50)
  nome: string;

  @IsString()
  @MaxLength(30)
  @Matches(/^[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}-?[0-9]{2}$/)
  cnpj: string;

  @IsString()
  @MaxLength(100)
  endereco: string;

  @IsString()
  @MaxLength(30)
  @Matches(/^\([0-9]{2}\)\s[0-9]\s[0-9]{4}-[0-9]{4}$/)
  telefone: string;

  @IsString()
  @MaxLength(30)
  @Matches(/^[0-9]{5}-[0-9]{3}$/)
  cep: string;
}
