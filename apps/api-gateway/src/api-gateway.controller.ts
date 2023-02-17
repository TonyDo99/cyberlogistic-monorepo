import { CreateTerminalDto } from '@app/common';
import { CreateCarrierDto } from '@app/common/dto/carrier/create-carrier.dto';
import { CreateOperationDto } from '@app/common/dto/operation/create-operation.dto';
import { CreateTermnalConfigDto } from '@app/common/dto/terminal-config/create-termnal-config.dto';
import { CreateTerminalDetailDto } from '@app/common/dto/terminal-detail/create-terminal-detail.dto';
import { CreateTerminalLogoDto } from '@app/common/dto/terminal-detail/create-terminal-logo.dto';
import { OperationEntity } from '@app/common/entities/operation-type.entity';
import { TerminalConfigEntity } from '@app/common/entities/terminal-config.entity';
import { TerminalDetailEntity } from '@app/common/entities/terminal-detail.entity';
import { TerminalEntity } from '@app/common/entities/terminal.entity';
import { DestinationStore } from '@app/common/types';
import { diskStorageOptions, fileFilterOptions } from '@app/common/utils/file';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Observable } from 'rxjs';
import { ApiGatewayService } from './api-gateway.service';

@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Post('terminal')
  createTerminal(
    @Body() createTerminalDto: CreateTerminalDto,
  ): Observable<any> {
    try {
      return this.apiGatewayService.createTerminal(createTerminalDto);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @Get('terminal')
  async findTerminals(
    @Query('terminal-code') code: string,
  ): Promise<TerminalEntity> {
    return await this.apiGatewayService.getTerminals(code);
  }

  // Terminal detail
  @Post('terminal-detail')
  createTerminalDetail(
    @Body() createTerminalDto: CreateTerminalDetailDto,
  ): Observable<any> {
    return this.apiGatewayService.createTerminalDetail(createTerminalDto);
  }

  @Get('terminal-detail')
  async findTerminalsDetail(
    @Query('terminal-code') code: string,
  ): Promise<TerminalDetailEntity> {
    try {
      return await this.apiGatewayService.getTerminalsDetail(code);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // Terminal config
  @Post('terminal-config')
  createTerminalConfig(
    @Body() createTerminalConfigDto: CreateTermnalConfigDto,
  ): Observable<any> {
    try {
      return this.apiGatewayService.createTerminalConfig(
        createTerminalConfigDto,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('terminal-config')
  async findTerminalConfig(
    @Query('terminal-code') code: string,
  ): Promise<TerminalConfigEntity> {
    try {
      return await this.apiGatewayService.getTerminalsConfig(code);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // Operation
  @Post('operation')
  createOperation(
    @Body() createOperationDto: CreateOperationDto,
  ): Observable<any> {
    return this.apiGatewayService.createOperation(createOperationDto);
  }

  @Get('operation')
  async findOperation(
    @Query('terminal-code') code: string,
  ): Promise<OperationEntity> {
    try {
      return await this.apiGatewayService.getOperation(code);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // ------- CARRIER -------
  @Post('carrier')
  createCarrier(@Body() createCarrierDto: CreateCarrierDto): Observable<any> {
    try {
      return this.apiGatewayService.createCarrier(createCarrierDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('carrier')
  async findCarrier(
    @Query('terminal-code') code: string,
  ): Promise<OperationEntity> {
    try {
      return await this.apiGatewayService.getCarrier(code);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('terminal-logo/upload-files')
  @UseInterceptors(
    FileInterceptor('logo', {
      fileFilter: (req: Request, file: Express.Multer.File, cb) =>
        fileFilterOptions(file, cb),
      limits: {
        files: 1,
      },
      storage: diskStorage(diskStorageOptions),
    }),
  )
  uploadFiles(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
      }),
    )
    logo: Express.Multer.File,
    @Query('storage') storage: DestinationStore,
    @Body()
    createTerminalLogoDto: CreateTerminalLogoDto,
  ) {
    try {
      const { terminal } = createTerminalLogoDto;
      return this.apiGatewayService.createLogo(logo, storage, terminal);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
