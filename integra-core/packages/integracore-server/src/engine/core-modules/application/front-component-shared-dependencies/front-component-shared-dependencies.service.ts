import { Injectable } from '@nestjs/common';

import { FileFolder } from 'integracore-shared/types';
import { isDefined } from 'integracore-shared/utils';

import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/engine/core-modules/application/application.exception';
import { ApplicationService } from 'src/engine/core-modules/application/application.service';
import { FileStorageService } from 'src/engine/core-modules/file-storage/services/file-storage.service';
import { type FileResponse } from 'src/engine/core-modules/file/types/file-response.type';
import { getContentDisposition } from 'src/engine/core-modules/file/utils/get-content-disposition.util';
import { IntegraCoreConfigService } from 'src/engine/core-modules/integracore-config/integracore-config.service';

const SHARED_DEPENDENCIES_BUNDLE_MIME_TYPE = 'application/javascript';

@Injectable()
export class FrontComponentSharedDependenciesService {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly fileStorageService: FileStorageService,
    private readonly integracoreConfigService: IntegraCoreConfigService,
  ) {}

  async getBuiltSharedDependenciesPresignedUrlOrStream({
    applicationId,
    workspaceId,
  }: {
    applicationId: string;
    workspaceId: string;
  }): Promise<{
    fileResponse: FileResponse;
    frontComponentSharedDependenciesChecksum: string | null;
  }> {
    const application =
      await this.applicationService.findOneApplicationWithRelationsOrThrow({
        id: applicationId,
        workspaceId,
      });

    if (!isDefined(application.frontComponentSharedDependenciesBuiltPath)) {
      throw new ApplicationException(
        `Application "${applicationId}" does not declare shared dependencies`,
        ApplicationExceptionCode.ENTITY_NOT_FOUND,
      );
    }

    const resourceIdentifier = {
      workspaceId,
      applicationUniversalIdentifier: application.universalIdentifier,
      fileFolder: FileFolder.BuiltFrontComponent,
      resourcePath: application.frontComponentSharedDependenciesBuiltPath,
    };

    const presignedUrl = await this.fileStorageService.getPresignedUrl({
      ...resourceIdentifier,
      expiresInSeconds: this.integracoreConfigService.get(
        'STORAGE_S3_PRESIGNED_URL_EXPIRES_IN',
      ),
      responseContentType: SHARED_DEPENDENCIES_BUNDLE_MIME_TYPE,
      responseContentDisposition: getContentDisposition(
        SHARED_DEPENDENCIES_BUNDLE_MIME_TYPE,
      ),
    });

    if (isDefined(presignedUrl)) {
      return {
        fileResponse: { type: 'redirect', presignedUrl },
        frontComponentSharedDependenciesChecksum:
          application.frontComponentSharedDependenciesChecksum,
      };
    }

    const stream = await this.fileStorageService.readFile(resourceIdentifier);

    return {
      fileResponse: {
        type: 'stream',
        stream,
        mimeType: SHARED_DEPENDENCIES_BUNDLE_MIME_TYPE,
      },
      frontComponentSharedDependenciesChecksum:
        application.frontComponentSharedDependenciesChecksum,
    };
  }
}
