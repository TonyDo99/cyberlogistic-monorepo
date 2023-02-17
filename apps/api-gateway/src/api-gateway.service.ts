import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { CreateTerminalDto } from '@app/common';
import { OnModuleInit } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Observable } from 'rxjs';
import { CreateTerminalDetailDto } from '@app/common/dto/terminal-detail/create-terminal-detail.dto';
import { CreateTermnalConfigDto } from '@app/common/dto/terminal-config/create-termnal-config.dto';
import { CreateOperationDto } from '@app/common/dto/operation/create-operation.dto';
import { CreateCarrierDto } from '@app/common/dto/carrier/create-carrier.dto';
import { DestinationStore } from '@app/common/types';

@Injectable()
export class ApiGatewayService implements OnModuleInit {
  constructor(
    @Inject('TERMINAL') private readonly terminalClient: ClientKafka,
    @Inject('TERMINAL_DETAIL')
    private readonly terminalDetailClient: ClientKafka,
    @Inject('TERMINAL_CONFIG')
    private readonly terminalConfigClient: ClientKafka,
  ) {}
  async onModuleInit() {
    this.terminalClient.subscribeToResponseOf('terminal-creating');
    this.terminalClient.subscribeToResponseOf('terminal-listing');

    this.terminalDetailClient.subscribeToResponseOf('terminal-detail-creating');
    this.terminalDetailClient.subscribeToResponseOf('terminal-detail-listing');

    this.terminalConfigClient.subscribeToResponseOf('terminal-config-creating');
    this.terminalConfigClient.subscribeToResponseOf('terminal-config-listing');

    this.terminalDetailClient.subscribeToResponseOf('operation-creating');
    this.terminalDetailClient.subscribeToResponseOf('operation-listing');

    this.terminalDetailClient.subscribeToResponseOf('carrier-creating');
    this.terminalDetailClient.subscribeToResponseOf('carrier-listing');

    this.terminalDetailClient.subscribeToResponseOf('logo-creating');

    await this.terminalClient.connect();
    await this.terminalDetailClient.connect();
    await this.terminalConfigClient.connect();
  }

  createTerminal(createTerminalDto: CreateTerminalDto): Observable<any> {
    return this.terminalClient.send('terminal-creating', createTerminalDto);
  }

  async getTerminals(code: string) {
    try {
      return await lastValueFrom(
        this.terminalClient.send('terminal-listing', code),
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  createTerminalDetail(
    createTerminalDto: CreateTerminalDetailDto,
  ): Observable<any> {
    return this.terminalDetailClient.send(
      'terminal-detail-creating',
      createTerminalDto,
    );
  }

  async getTerminalsDetail(code: string) {
    try {
      return await lastValueFrom(
        this.terminalDetailClient.send('terminal-detail-listing', code),
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  createTerminalConfig(
    createTerminalConfigDto: CreateTermnalConfigDto,
  ): Observable<any> {
    return this.terminalConfigClient.send(
      'terminal-config-creating',
      createTerminalConfigDto,
    );
  }

  async getTerminalsConfig(code: string) {
    try {
      return await lastValueFrom(
        this.terminalConfigClient.send(
          'terminal-config-listing',
          JSON.stringify(code) || '',
        ),
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  createOperation(createOperationDto: CreateOperationDto): Observable<any> {
    return this.terminalDetailClient.send(
      'operation-creating',
      createOperationDto,
    );
  }

  async getOperation(code: string) {
    try {
      return await lastValueFrom(
        this.terminalDetailClient.send(
          'operation-listing',
          JSON.stringify(code) || '',
        ),
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  createCarrier(createCarrierDto: CreateCarrierDto) {
    return this.terminalDetailClient.send('carrier-creating', createCarrierDto);
  }

  async getCarrier(code: string) {
    try {
      return await lastValueFrom(
        this.terminalDetailClient.send(
          'carrier-listing',
          JSON.stringify(code) || '',
        ),
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  createLogo(
    file: Express.Multer.File,
    storage: DestinationStore,
    terminalCode: string,
  ) {
    try {
      return this.terminalDetailClient.send('logo-creating', {
        file,
        storage,
        terminalCode,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
