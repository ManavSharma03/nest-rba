import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';
import { NotFoundException } from '@nestjs/common';
import { UserRoles } from '../../common/types';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository, // Mock the TypeORM repository
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const createUserDto = { email: 'test@example.com', password: 'password' };
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const savedUser = {
        id: 1,
        email: createUserDto.email,
        password: hashedPassword,
        role: UserRoles.admin,
      };

      jest.spyOn(usersRepository, 'create').mockReturnValue(savedUser as any);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(savedUser);

      const result = await usersService.create(createUserDto);

      expect(usersRepository.create).toHaveBeenCalledWith({
        email: createUserDto.email,
        password: expect.any(String), // Ensures password is hashed
      });
      expect(usersRepository.save).toHaveBeenCalledWith(savedUser);
      expect(result).toEqual(savedUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        {
          id: 1,
          email: 'test@example.com',
          password: 'hashed',
          role: UserRoles.admin,
        },
      ];
      jest.spyOn(usersRepository, 'find').mockResolvedValue(users);

      const result = await usersService.findAll();
      expect(result).toEqual(users);
      expect(usersRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user when found', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashed' };
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user as any);

      const result = await usersService.findOne('1');
      expect(result).toEqual(user);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);

      await expect(usersService.findOne('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashed' };
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user as any);

      const result = await usersService.findByEmail('test@example.com');
      expect(result).toEqual(user);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      const result = await usersService.findByEmail('test@example.com');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return the updated user', async () => {
      const updateUserDto = { email: 'new@example.com' };
      const existingUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed',
      };
      const updatedUser = { ...existingUser, ...updateUserDto };

      jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(existingUser as any);
      jest
        .spyOn(usersRepository, 'update')
        .mockResolvedValue({ affected: 1 } as UpdateResult);
      jest.spyOn(usersService, 'findOne').mockResolvedValue(updatedUser as any);

      const result = await usersService.update('1', updateUserDto);

      expect(usersRepository.update).toHaveBeenCalledWith('1', updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashed' };

      jest.spyOn(usersService, 'findOne').mockResolvedValue(user as any);
      jest.spyOn(usersRepository, 'remove').mockResolvedValue(user as User);

      await usersService.remove('1');

      expect(usersRepository.remove).toHaveBeenCalledWith(user);
    });
  });

  describe('updateRefreshToken', () => {
    it('should update refresh token', async () => {
      jest
        .spyOn(usersRepository, 'update')
        .mockResolvedValue({ affected: 1 } as UpdateResult);

      await usersService.updateRefreshToken(1, 'new-refresh-token');

      expect(usersRepository.update).toHaveBeenCalledWith(1, {
        refreshToken: 'new-refresh-token',
      });
    });
  });

  describe('clearRefreshToken', () => {
    it('should clear refresh token', async () => {
      jest
        .spyOn(usersRepository, 'update')
        .mockResolvedValue({ affected: 1 } as UpdateResult);

      await usersService.clearRefreshToken(1);

      expect(usersRepository.update).toHaveBeenCalledWith(1, {
        refreshToken: '',
      });
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashed' };
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user as any);

      const result = await usersService.findById(1);
      expect(result).toEqual(user);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);

      await expect(usersService.findById(1)).rejects.toThrow(NotFoundException);
    });
  });
});
