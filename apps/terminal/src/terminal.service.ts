import { CreateTerminalDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TerminalEntity } from '@app/common/entities/terminal.entity';
import { formatUTC } from '@app/common/utils/date';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class TerminalService {
  constructor(
    @InjectRepository(TerminalEntity)
    private readonly terminalEntity: Repository<TerminalEntity>,
  ) {}

  async create(createTerminalDto: CreateTerminalDto) {
    const created = await this.terminalEntity.insert(createTerminalDto);
    return {
      headers: {
        kafka_nestRealm: 'Nest',
      },
      key: 'create terminal',
      value: JSON.stringify(created),
    };
  }

  async findAll() {
    const terminals = await this.terminalEntity.find();
    const terminal_list = terminals.map((terminal) => ({
      ...terminal,
      createdDate: formatUTC(terminal.createdDate),
      updatedDate: formatUTC(terminal.updatedDate),
    }));

    return {
      headers: {
        kafka_nestRealm: 'Nest',
      },
      key: 'terminal_listing',
      value: JSON.stringify(terminal_list),
    };
  }

  async findOne(code: string) {
    const exist = await this.terminalEntity.findOne({
      relations: ['detail', 'operations', 'carriers', 'configs'],
      where: {
        code,
      },
    });

    if (!exist) throw new BadRequestException('This terminal does not exist !');
    else return exist;
  }
}
