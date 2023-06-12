import { Module } from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { ProjectsController } from './projects.controller'
import { ProjectsRepository } from './projects.repository'
import { BoardsService } from './boards.service'
import { AuthModule } from '../auth/auth.module'

@Module({
  providers: [ProjectsService, BoardsService, ProjectsRepository],
  controllers: [ProjectsController],
  exports: [ProjectsRepository],
  imports: [AuthModule],
})
export class ProjectsModule {}
