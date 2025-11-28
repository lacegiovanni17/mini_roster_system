import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { CreateUserInput } from "./dto/create-user.input";
import { PaginationArgs } from "../common/pagination/pagination.args";
import { UserFilterInput } from "./dto/user-filter.input";
import { IPaginatedType } from "../common/pagination/paginated.result";
import { paginate } from "../common/utils/paginate";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserInput: CreateUserInput): Promise<User> {
    const user = this.usersRepository.create(createUserInput);
    return this.usersRepository.save(user);
  }

  async findAll(
    paginationArgs: PaginationArgs,
    filter: UserFilterInput,
  ): Promise<IPaginatedType<User>> {
    const query = this.usersRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.assignments", "assignments");

    if (filter.name) {
      query.andWhere("user.name ILIKE :name", { name: `%${filter.name}%` });
    }

    if (filter.email) {
      query.andWhere("user.email ILIKE :email", { email: `%${filter.email}%` });
    }

    if (filter.role) {
      query.andWhere("user.role = :role", { role: filter.role });
    }

    return paginate(query, paginationArgs);
  }

  findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ["assignments"],
    });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
