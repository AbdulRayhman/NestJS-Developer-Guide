import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get(
            'postgresql://nest_owner:s2wydTkhbPL6@ep-damp-tooth-a2ymrfar.eu-central-1.aws.neon.tech/nest?sslmode=require',
          ),
        },
      },
    });
  }

  cleanDB() {
    this.$transaction([this.user.deleteMany(), this.bookmark.deleteMany()]);
  }
}
