import {
  IsArray,
  IsEthereumAddress,
  IsNotEmpty,
  IsString,
} from 'class-validator'

export class GetSubnetAssetsDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  subnetEndpoints: string[]

  @IsNotEmpty()
  @IsEthereumAddress()
  address: string
}
