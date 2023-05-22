import { Module } from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { ProjectsController } from './projects.controller'
import { ProjectsRepository } from './projects.repository'
import { BoardsService } from './boards.service'

@Module({
  providers: [ProjectsService, BoardsService, ProjectsRepository],
  controllers: [ProjectsController],
  exports: [ProjectsRepository],
})
export class ProjectsModule {}
