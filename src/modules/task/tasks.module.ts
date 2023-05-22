import { Module } from '@nestjs/common'
import { TasksController } from './tasks.controller'
import { TasksService } from './tasks.service'
import { ProjectsModule } from '../projects/projects.module'
import { TasksRepository } from './tasks.repository'

@Module({
  imports: [ProjectsModule],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository],
  exports: [TasksRepository],
})
export class TasksModule {}
