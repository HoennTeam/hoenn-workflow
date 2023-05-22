import { HttpStatus, Injectable } from '@nestjs/common'
import { AppException } from '../../common/exceptions/app.exception'
import { dotenvConfig } from '../../core/config/dotenv-config'
import { Logger } from '../../core/logger'
import { Board } from '../../entities/board'
import { Project } from '../../entities/project'
import { DataSource } from 'typeorm'
import {
  UpdateProjectDto,
  UpdateProjectRequestDto,
} from './dto/update-project.dto'
import {
  CreateProjectDto,
  CreateProjectRequestDto,
} from './dto/create-project.dto'
import { ProjectDto } from './dto/project.dto'
import { FullProjectDto } from './dto/full-project.dto'
import { BoardDto } from './dto/board.dto'
import { FullBoardDto } from './dto/full-board.dto'
import { StageDto } from './dto/stage.dto'
import {
  UserToProjectRequestDto,
  UserToProjectResponseDto,
} from './dto/user-to-project.dto'
import { ProjectsUsers } from '../../entities/projects-users'
import { User } from '../../entities/user'
import { Role } from '../../entities/role'
import { DeleteUserFromProjectDto } from './dto/delete-user-from-project.dto'
import { Stage } from '../../entities/stage'
import { CreateStageDto } from './dto/create-stage.dto'
import { RemoveStageDto } from './dto/delete-stage.dto'
import { UpdateStageDto } from './dto/update-stage.dto'
import { CreateBoardDto } from './dto/create-board.dto'
import { UpdateBoardDto } from './dto/update-board.dto'
import { ProjectsRepository } from './projects.repository'

@Injectable()
export class BoardsService {
  constructor(
    private readonly logger: Logger,
    private readonly connection: DataSource,
    private readonly projectsRepository: ProjectsRepository
  ) {}

  async getBoards(projectId: number): Promise<BoardDto[]> {
    await this.projectsRepository.getProjectIfExists(projectId)

    const boards = await this.connection
      .createQueryBuilder(Board, 'board')
      .where('board.project = :projectId', { projectId })
      .getMany()

    return boards.map((item) => ({
      id: item.id,
      name: item.name,
      isDefault: item.isDefault,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }))
  }

  public async getFullBoard(
    projectId: number,
    boardId: number
  ): Promise<FullBoardDto> {
    const board = await this.projectsRepository.getFullBoardIfExists(
      projectId,
      boardId
    )

    return {
      id: board.id,
      name: board.name,
      isDefault: board.isDefault,
      createdAt: board.createdAt.toISOString(),
      updatedAt: board.updatedAt.toISOString(),
      stages: board.stages.map((stage) => ({
        id: stage.id,
        name: stage.name,
        createdAt: stage.createdAt.toISOString(),
        updatedAt: stage.updatedAt.toISOString(),
      })),
      tasks: board.tasks.map((task) => ({
        id: task.id,
        number: task.number,
        title: task.title,
        description: task.description,
        index: task.index,
        stageId: task.stage.id,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.createdAt.toISOString(),
      })),
    }
  }

  public async createBoard(dto: CreateBoardDto): Promise<BoardDto> {
    const project = await this.projectsRepository.getProjectIfExists(
      dto.projectId
    )

    const newBoard = new Board({
      name: dto.name,
      isDefault: false,
      project: project,
    })

    const created = await this.connection.getRepository(Board).save(newBoard)

    return {
      id: created.id,
      name: created.name,
      isDefault: created.isDefault,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    }
  }

  public async removeBoard(projectId: number, boardId: number): Promise<void> {
    const board = await this.projectsRepository.getBoardIfExists(
      projectId,
      boardId
    )

    if (board.isDefault) {
      throw new AppException(
        HttpStatus.BAD_REQUEST,
        'You cannot delete default board'
      )
    }

    await this.connection.getRepository(Board).softRemove(board)
  }

  public async updateBoard(dto: UpdateBoardDto): Promise<BoardDto> {
    const board = await this.projectsRepository.getBoardIfExists(
      dto.projectId,
      dto.boardId
    )

    if (dto.isDefault) {
      await this.connection
        .createQueryBuilder(Board, 'board')
        .innerJoin('board.project', 'project')
        .update(Board)
        .set({ isDefault: false })
        .where('project.id = :projectId', { projectId: dto.projectId })
        .execute()
    }

    Object.assign(board, {
      name: dto.name,
      isDefault: dto.isDefault || board.isDefault,
    })

    const updated = await this.connection.getRepository(Board).save(board)

    return {
      id: updated.id,
      name: updated.name,
      isDefault: updated.isDefault,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  public async getStages(
    projectId: number,
    boardId: number
  ): Promise<StageDto[]> {
    const board = await this.projectsRepository.getBoardIfExists(
      projectId,
      boardId
    )

    const stages = await this.connection
      .createQueryBuilder(Stage, 'stage')
      .andWhere('stage.board = :boardId', { boardId })
      .getMany()

    return stages.map((item) => ({
      id: item.id,
      name: item.name,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }))
  }

  public async createStage(dto: CreateStageDto): Promise<StageDto> {
    const board = await this.projectsRepository.getBoardIfExists(
      dto.projectId,
      dto.boardId
    )

    const newStage = new Stage({
      name: dto.name,
      board: board,
    })

    const created = await this.connection.getRepository(Stage).save(newStage)

    return {
      id: created.id,
      name: created.name,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    }
  }

  public async removeStage(dto: RemoveStageDto): Promise<void> {
    await this.projectsRepository.getBoardIfExists(dto.projectId, dto.boardId)

    const stage = await this.projectsRepository.getStageIfExists(dto.stageId)

    await this.connection.getRepository(Stage).softRemove(stage)
  }

  public async updateStage(dto: UpdateStageDto): Promise<StageDto> {
    await this.projectsRepository.getBoardIfExists(dto.projectId, dto.boardId)

    const stage = await this.projectsRepository.getStageIfExists(dto.stageId)

    if (dto.name) {
      stage.name = dto.name
    }

    const updated = await this.connection.getRepository(Stage).save(stage)

    return {
      id: updated.id,
      name: updated.name,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
}
