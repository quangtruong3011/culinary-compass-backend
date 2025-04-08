import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTableDto {
    @ApiProperty({
        example: "Table 1",
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    restaurantId: number;

    @ApiProperty({
        example: 4,
    })
    @IsNotEmpty()
    @IsNumber()
    capacity: number;
}
