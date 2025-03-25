import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Get,
  Param,
  Res,
  Delete,
  Patch,
  ParseIntPipe,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { createReadStream } from 'fs';
import * as fs from 'fs';
import { lookup } from 'mime-types';

import {
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserRoles } from 'src/common/types';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.gaurd';
import { UpdateDocumentDto } from './dto/document.dto';

@Controller('documents')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) { }

  @Post('upload')
  @Roles(UserRoles.admin, UserRoles.editor)
  @ApiOperation({ summary: 'Upload a document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const filename =
            file.originalname.replace(/\s/g, '_') +
            '-' +
            uniqueSuffix +
            extname(file.originalname);
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.documentsService.saveFileMetadata(file);
  }

  @Get(':id')
  @Roles(UserRoles.admin, UserRoles.editor, UserRoles.user)
  @ApiOperation({ summary: 'Get document metadata' })
  async getDocumentMetadata(@Param('id') id: string) {
    return this.documentsService.getDocumentById(+id);
  }

  @Get('download/:id')
  @Roles(UserRoles.admin, UserRoles.editor, UserRoles.user)
  @ApiOperation({ summary: 'Download a document' })
  async downloadDocument(@Param('id') id: string, @Res() res: Response) {
    const file = await this.documentsService.downloadDocument(+id);
    // Use absolute path resolution
    const filePath = join(process.cwd(), file.path);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.setHeader('Content-Type', lookup(file.filename) || 'application/octet-stream');

    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  }

  @Get()
  @Roles(UserRoles.admin, UserRoles.editor, UserRoles.user)
  @ApiOperation({ summary: 'List all documents' })
  async listDocuments() {
    return this.documentsService.listDocuments();
  }

  @Delete(':id')
  @Roles(UserRoles.admin, UserRoles.editor)
  @ApiOperation({ summary: 'Delete a document' })
  async deleteDocument(@Param('id') id: string) {
    return this.documentsService.deleteDocument(+id);
  }

  @Patch(':id')
  @Roles(UserRoles.admin, UserRoles.editor)
  @ApiOperation({ summary: 'Update document metadata' })
  async updateDocument(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentsService.updateDocument(id, updateDocumentDto);
  }
}
