import { DeleteResponseDTO } from '../../core/dtos/delete-response.dto';
import { PoapAdminDTO } from './../models/poap-admin.model';
import {
  AddPoapAdminDTO,
  DeletePoapAdminDTO,
  PoapAdminsResponseDTO,
} from '../dtos/poap-admin.dtos';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { PoapAdminService } from '../services/poap-admin.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('POAP Admin')
@Controller({
  path: 'poap/admin',
  version: '1',
})
export class PoapAdminController {
  constructor(private poapService: PoapAdminService) {}

  @ApiOperation({
    description: 'Get a list of all poap admins for the given guild',
  })
  @ApiResponse({ type: PoapAdminsResponseDTO })
  @Get(':guildId')
  async getAdmins(
    @Param('guildId') guildId: string
  ): Promise<PoapAdminsResponseDTO> {
    return {
      poapAdmins: await this.poapService.getPoapAdmins(guildId),
    };
  }

  @ApiOperation({
    description: 'Add a poap admin for the given guild',
  })
  @ApiResponse({ type: PoapAdminDTO, isArray: true })
  @Post()
  async addAdmin(@Body() addPoapAdmin: AddPoapAdminDTO) {
    const { guildId, userId } = addPoapAdmin;
    return this.poapService.addPoapAdmin(guildId, userId);
  }

  @ApiOperation({
    description: 'Delete a poap admin for the given guild',
  })
  @ApiResponse({ type: DeleteResponseDTO })
  @Delete()
  async deleteAdmin(
    @Body() deletePoapAdmin: DeletePoapAdminDTO
  ): Promise<DeleteResponseDTO> {
    const { _id } = deletePoapAdmin;
    const result = await this.poapService.deletePoapAdmin(_id);
    if (result?.deletedCount > 0) {
      return result;
    } else {
      throw new NotFoundException('User not found.');
    }
  }
}
