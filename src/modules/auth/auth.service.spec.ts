import { Entity } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterUserDto } from '../auth/dto/auth.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../users/entity/user.entity';
import { UserRoles } from '../../common/types';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            updateRefreshToken: jest.fn(), // Add this
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked-access-token'),
            verifyAsync: jest.fn().mockResolvedValue({ sub: 1 }), // ✅ Fix this!
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const dto: RegisterUserDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user: User = {
        id: 1,
        email: dto.email,
        password: hashedPassword,
        role: UserRoles.user,
      };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (usersService.create as jest.Mock).mockResolvedValue(user);

      const result = await authService.register(dto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(usersService.create).toHaveBeenCalled();
      expect(result).toEqual(user);
    });

    it('should throw an error if user already exists', async () => {
      const dto: RegisterUserDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const user: User = {
        id: 1,
        email: dto.email,
        password: 'hashed-password',
        role: UserRoles.user,
      };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(user);

      await expect(authService.register(dto)).rejects.toThrow(
        'User already exists',
      );
    });
  });

  describe('login', () => {
    it('should log in a user and return a JWT token', async () => {
      const dto: LoginDto = { email: 'test@example.com', password: 'password' };
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user: User = {
        id: 1,
        email: dto.email,
        password: hashedPassword,
        role: UserRoles.user,
      };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await authService.login(dto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(jwtService.sign).toHaveBeenCalled();
      expect(result).toEqual({
        access_token: 'mocked-access-token',
        refresh_token: 'mocked-access-token',
      });
    });

    it('should throw an error if user is not found', async () => {
      const dto: LoginDto = { email: 'test@example.com', password: 'password' };
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(dto)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should throw an error if password is incorrect', async () => {
      const dto: LoginDto = {
        email: 'test@example.com',
        password: 'wrong-password',
      };
      const user: User = {
        id: 1,
        email: dto.email,
        password: 'hashed-password',
        role: UserRoles.user,
      };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(authService.login(dto)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  // describe('refreshAccessToken', () => {
  //   it('should return a new access token', async () => {
  //     const refreshToken = 'mocked-refresh-token';
  //     const hashedRefreshToken = await bcrypt.hash(refreshToken, 10); // Hash for comparison

  //     const user = {
  //       id: 1,
  //       email: 'test@example.com',
  //       role: 'user',
  //       refreshToken: hashedRefreshToken, // ✅ Ensure hashed token is returned
  //     };

  //     // ✅ Correctly mock JWT verifyAsync to return `{ sub: user.id }`
  //     jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: user.id });

  //     // ✅ Ensure `findById` returns the correct user
  //     jest.spyOn(usersService, 'findById').mockResolvedValue(user as any);

  //     // ✅ Ensure `bcrypt.compare` returns `true`
  //     jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

  //     // ✅ Mock JWT sign function to return a new access token
  //     jest.spyOn(jwtService, 'sign').mockReturnValue('mocked-access-token');

  //     const result = await authService.refreshAccessToken('valid-refresh-token');


  //     console.log('Update result:', result);
  //     expect(result).toEqual({ access_token: 'new-access-token' });

  //     // ✅ Assertions
  //     expect(jwtService.verifyAsync).toHaveBeenCalledWith(refreshToken);
  //     expect(usersService.findById).toHaveBeenCalledWith(user.id);
  //     expect(bcrypt.compare).toHaveBeenCalledWith(
  //       refreshToken,
  //       user.refreshToken,
  //     );
  //     expect(jwtService.sign).toHaveBeenCalled();
  //     expect(result).toEqual({ access_token: 'mocked-access-token' });
  //   });
  // });
});
