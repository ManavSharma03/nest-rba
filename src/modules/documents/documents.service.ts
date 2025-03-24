import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entity/document.entity';
import * as fs from 'fs';
import * as path from 'path';
import { UpdateDocumentDto } from './dto/document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
  ) {}

  async saveFileMetadata(file: Express.Multer.File): Promise<Document> {
    const newDocument = this.documentsRepository.create({
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
    });
    return this.documentsRepository.save(newDocument);
  }

  async getDocumentById(id: number): Promise<Document> {
    const document = await this.documentsRepository.findOne({ where: { id } });
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  async downloadDocument(
    id: number,
  ): Promise<{ path: string; filename: string }> {
    const document = await this.getDocumentById(id);
    return { path: document.path, filename: document.filename };
  }

  async listDocuments(): Promise<Document[]> {
    return this.documentsRepository.find();
  }

  async deleteDocument(id: number): Promise<{ message: string }> {
    const document = await this.getDocumentById(id);
    if (fs.existsSync(document.path)) {
      fs.unlinkSync(document.path);
    }
    await this.documentsRepository.delete(id);
    return { message: 'Document deleted successfully' };
  }

  async updateDocument(
    id: number,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document> {
    const document = await this.getDocumentById(id);
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // If filename is provided, update it
    if (updateDocumentDto.filename) {
      const filePath = path.join('./uploads', document.filename);
      const newFilePath = path.join('./uploads', updateDocumentDto.filename);

      if (fs.existsSync(filePath)) {
        fs.renameSync(filePath, newFilePath);
      } else {
        throw new BadRequestException('Original file does not exist');
      }

      document.filename = updateDocumentDto.filename;
      document.path = newFilePath;
    }

    return this.documentsRepository.save(document);
  }
}
