import { Injectable, BadRequestException } from '@nestjs/common';
import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
    private s3: S3Client;

    constructor() {
        this.s3 = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });
    }

    async uploadFile(
        file: Express.Multer.File,
        folder: string, // ex: profile/userId
    ): Promise<string> {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        if (!file.mimetype.startsWith('image/')) {
            throw new BadRequestException('Only image files are allowed');
        }

        // size limit (2MB)
        const MAX_SIZE = 2 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            throw new BadRequestException('File too large (max 2MB)');
        }

        // default name
        const key = `${folder}/avatar.jpg`;

        await this.s3.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read',
            }),
        );

        return this.getFileUrl(key);
    }

    async deleteFile(fileUrl: string): Promise<void> {
        if (!fileUrl) return;

        const key = this.extractKeyFromUrl(fileUrl);

        await this.s3.send(
            new DeleteObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET,
                Key: key,
            }),
        );
    }

    async getPresignedUrl(fileUrl: string): Promise<string> {
        if (!fileUrl) return '';
        const key = this.extractKeyFromUrl(fileUrl);
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
        });
        return getSignedUrl(this.s3, command, { expiresIn: 3600 });
    }

    // 🔥 Gerar URL pública
    private getFileUrl(key: string): string {
        return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }

    // 🔥 Extrair key da URL
    private extractKeyFromUrl(url: string): string {
        const baseUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/`;

        return url.replace(baseUrl, '');
    }
}