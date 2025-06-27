import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Wallet, WalletDocument } from './wallet.schema';
import { Model } from 'mongoose';
import { CreateWalletDto } from './wallet.dto';
import { ResponseDto } from 'src/common/dto/response.dto';

@Injectable()
export class WalletService {
  constructor(@InjectModel(Wallet.name) private walletModel: Model<WalletDocument>) {}

  async createWallet(dto: CreateWalletDto, ownerId: string) {
    // checking if user has already anu wallet with the same name
    const isWalletExist = await this.walletModel.findOne({ name: dto.name, ownerId: ownerId }).select('_id').lean();
    if (isWalletExist) throw new BadRequestException('A wallet with same name already exist!');

    const wallet = await this.walletModel.create(dto);
    if (!wallet) throw new BadGatewayException('Failed to create wallet');

    return new ResponseDto('Wallet Created Successfully');
  }
}
