import { Controller, BadRequestException } from '@nestjs/common';
import { TerminalDetailService } from './terminal-detail-service.service';
import { CreateTerminalDetailDto } from '@app/common/dto/terminal-detail/create-terminal-detail.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateOperationDto } from '@app/common/dto/operation/create-operation.dto';
import { CreateCarrierDto } from '@app/common/dto/carrier/create-carrier.dto';
import { DestinationStore } from '@app/common/types';

@Controller()
export class TerminalDetailController {
  constructor(private readonly terminalDetailService: TerminalDetailService) {}

  @MessagePattern('terminal-detail-creating')
  async create(@Payload() createTerminalDetailDto: CreateTerminalDetailDto) {
    try {
      return await this.terminalDetailService.create(createTerminalDetailDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @MessagePattern('terminal-detail-listing')
  async findOne(@Payload() code: string) {
    try {
      if (code) return await this.terminalDetailService.findOneBelong(code);
      else return await this.terminalDetailService.findAll();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @MessagePattern('operation-creating')
  createOperation(@Payload() createOperationDto: CreateOperationDto) {
    return this.terminalDetailService.createOperation(createOperationDto);
  }

  @MessagePattern('operation-listing')
  async findOperation(@Payload() code: string) {
    try {
      if (code)
        return await this.terminalDetailService.findOperationBelong(
          JSON.parse(code),
        );
      else return await this.terminalDetailService.findAllOperation();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @MessagePattern('carrier-creating')
  createCarrier(@Payload() createCarrierDto: CreateCarrierDto) {
    return this.terminalDetailService.createCarrier(createCarrierDto);
  }

  @MessagePattern('carrier-listing')
  async findCarrier(@Payload() code: string) {
    try {
      if (code)
        return await this.terminalDetailService.findCarrierBelong(
          JSON.parse(code),
        );
      else return await this.terminalDetailService.findAllCarriers();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @MessagePattern('logo-creating')
  async createLogo({
    file,
    storage,
    terminalCode,
  }: {
    file: Express.Multer.File;
    storage: DestinationStore;
    terminalCode: string;
  }) {
    try {
      return this.terminalDetailService.createLogo(file, storage, terminalCode);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
