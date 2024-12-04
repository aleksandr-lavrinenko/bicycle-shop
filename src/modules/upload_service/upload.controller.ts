import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

@Controller("upload")
export class UploadController {
  private readonly s3: unknown;

  constructor() {}

  @Post("files")
  @UseInterceptors(FilesInterceptor("files"))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new Error("No files uploaded");
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const fileKey = `${uuidv4()}-${file.originalname}`;
        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        try {
          const result = await this.s3.upload(params).promise();
          return { fileName: file.originalname, url: result.Location };
        } catch (error) {
          throw new Error(
            `Failed to upload ${file.originalname}: ${error.message}`
          );
        }
      })
    );

    return uploadedFiles;
  }
}
