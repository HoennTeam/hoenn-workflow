import { HttpStatus, Injectable } from '@nestjs/common'
import { Project } from '../../entities/project'
import { AppException } from '../../common/exceptions/app.exception'
import { DataSource } from 'typeorm'
import { Board } from '../../entities/board'
import { Stage } from '../../entities/stage'

@Injectable()
export class ProjectsRepository {
  constructor(private readonly connection: DataSource) {}

  public async getProjectIfExists(id: number): Promise<Project> {
    const project = await this.connection
      .getRepository(Project)
      .findOne({ where: { id } })

    if (!project) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Project not found', {
        id,
      })
    }

    return project
  }

  public async getFullProjectIfExists(id: number): Promise<Project> {
    const project = await this.connection
      .createQueryBuilder(Project, 'project')
      .leftJoinAndSelect('project.projectsUsers', 'projectsUsers')
      .leftJoinAndSelect('projectsUsers.user', 'user')
      .leftJoinAndSelect('projectsUsers.role', 'role')
      .leftJoinAndSelect('project.boards', 'boards')
      .where('project.id = :id', { id })
      .getOne()

    if (!project) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Project not found', { id })
    }

    return project
  }

  public async getBoardIfExists(
    projectId: number,
    boardId: number
  ): Promise<Board> {
    const board = await this.connection
      .createQueryBuilder(Board, 'board')
      .innerJoin('board.project', 'project')
      .where('board.project = :projectId', { projectId })
      .andWhere('board.id = :boardId', { boardId })
      .getOne()

    if (!board) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Board not found', {
        boardId,
      })
    }

    return board
  }

  public async getFullBoardIfExists(
    projectId: number,
    boardId: number
  ): Promise<Board> {
    const board = await this.connection
      .createQueryBuilder(Board, 'board')
      .innerJoin('board.project', 'project')
      .leftJoinAndSelect('board.stages', 'stages')
      .leftJoinAndSelect('board.tasks', 'tasks')
      .leftJoinAndSelect('tasks.stage', 'stage')
      .where('board.project = :projectId', { projectId })
      .andWhere('project.deletedAt IS NULL')
      .andWhere('board.id = :boardId', { boardId })
      .orderBy('stages.id', 'ASC')
      .addOrderBy('tasks.index', 'ASC')
      .getOne()

    if (!board) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Board not found', {
        boardId,
        projectId,
      })
    }

    return board
  }

  public async getStageIfExists(id: number): Promise<Stage> {
    const stage = await this.connection
      .createQueryBuilder(Stage, 'stage')
      .where('stage.id = :id', { id })
      .getOne()

    if (!stage) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Stage not found', {
        id: id,
      })
    }
    return stage
  }
}
