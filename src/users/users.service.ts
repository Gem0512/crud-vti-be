import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity'; // Đây là entity của User trong TypeORM
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Tạo mới người dùng
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    const salt = await bcrypt.genSalt();
    newUser.password = await bcrypt.hash(newUser.password, salt); // Mã hóa mật khẩu
    return this.userRepository.save(newUser); // Lưu vào cơ sở dữ liệu
  }
  // Lấy tất cả người dùng
  async findAll(): Promise<User[]> {
    return this.userRepository.find(); // Lấy tất cả các bản ghi
  }

  // Tìm người dùng theo ID
  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id: parseInt(id) } }); // Tìm theo ID (chuyển đổi sang number)
  }

  // Tìm người dùng theo tên
  async findByName(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { name: username } }); // Tìm theo tên
  }

  // Cập nhật thông tin người dùng
  async update(id: string, updateUserDto: any): Promise<User> {
    await this.userRepository.update(id, updateUserDto); // Cập nhật người dùng
    return this.findOne(id); // Trả về thông tin người dùng đã được cập nhật
  }

  // Xóa người dùng theo ID
  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id); // Xóa người dùng
  }
}
