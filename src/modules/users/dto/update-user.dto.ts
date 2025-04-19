import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';
import { Gender } from '../entities/user.entity';

export class UpdateUserDto {
    @ApiProperty({
        example: "a@gmail.com",
    })
    email?: string;

    @ApiProperty({
        example: "Kỳ ancut",
    })
    @IsString()
    name?: string;

    @ApiProperty({
        example: "0111111111",
    })
    phonenumber?: string;

    @ApiProperty({
        example: "Male",
        enum: Gender,
    })
    @IsEnum(Gender, { message:'Gender must be either Male or Female'})
    gender?: Gender;
}
