import { CreateTerminalDto } from '@app/common';
import { BadRequestException, Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TerminalService } from './terminal.service';

@Controller()
export class TerminalController {
  constructor(private readonly terminalService: TerminalService) {}

  @MessagePattern('terminal-creating')
  async create(@Payload() createTerminalDto: CreateTerminalDto) {
    try {
      return await this.terminalService.create(createTerminalDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @MessagePattern('terminal-listing')
  async find(@Payload() code: string) {
    try {
      if (code) return await this.terminalService.findOne(JSON.parse(code));
      else return await this.terminalService.findAll();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
