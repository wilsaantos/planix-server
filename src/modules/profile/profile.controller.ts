import { Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service.js';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard.js';

@Controller('profile')
export class ProfileController {

    constructor(private readonly profileService: ProfileService) { }

    @Post('profile-image')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    uploadProfileImage(
        @UploadedFile() file: Express.Multer.File,
        @Req() req,
    ) {
        return this.profileService.uploadProfileImage(req.user.id, file);
    }
}
