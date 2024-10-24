import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

// import { Test, TestingModule } from '@nestjs/testing';
// import { JwtService } from '@nestjs/jwt';
// import { UsersController } from './users.controller';
// import { UsersService } from './users.service';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { BadRequestException } from '@nestjs/common';

// describe('UsersController', () => {
//   let controller: UsersController;
//   let userService: UsersService;
//   let jwtService: JwtService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UsersController],
//       providers: [
//         {
//           provide: UsersService,
//           useValue: {
//             findAll: jest.fn(),
//             findOne: jest.fn(),
//             update: jest.fn(),
//             remove: jest.fn(),
//           },
//         },
//         {
//           provide: JwtService,
//           useValue: {
//             verify: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     controller = module.get<UsersController>(UsersController);
//     userService = module.get<UsersService>(UsersService);
//     jwtService = module.get<JwtService>(JwtService);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });

//   describe('findAll', () => {
//     it('should return all users', async () => {
//       const mockUsers = [{ id: 1, email: 'test@example.com',role: "Admin" }];
//       jest.spyOn(userService, 'findAll').mockResolvedValue(mockUsers);

//       const result = await controller.findAll();
//       expect(result).toEqual(mockUsers);
//       expect(userService.findAll).toHaveBeenCalled();
//     });
//   });

//   describe('findOne', () => {
//     it('should return a single user by id', async () => {
//       const mockUser = { id: 1, email: 'test@example.com' ,roleId: 1 };
//       jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);

//       const result = await controller.findOne('1');
//       expect(result).toEqual(mockUser);
//       expect(userService.findOne).toHaveBeenCalledWith(1);
//     });
//   });

//   describe('update', () => {
//     it('should throw an error if roleName is provided', async () => {
//       const token = 'Bearer mocktoken';
//       jest.spyOn(jwtService, 'verify').mockReturnValue({ id: 1 });

//       const updateUserDto: UpdateUserDto = { email: 'new@example.com', roleName: 'Admin' };
//       await expect(controller.update(token, updateUserDto)).rejects.toThrow(BadRequestException);
//     });

//     it('should call userService.update with valid data', async () => {
//       const token = 'Bearer mocktoken';
//       jest.spyOn(jwtService, 'verify').mockReturnValue({ id: 1 });

//       const updateUserDto: UpdateUserDto = { email: 'new@example.com' };
//       const mockUpdatedUser = { id: 1, email: 'new@example.com' };
//       jest.spyOn(userService, 'update').mockResolvedValue(mockUpdatedUser);

//       const result = await controller.update(token, updateUserDto);
//       expect(result).toEqual(mockUpdatedUser);
//       expect(userService.update).toHaveBeenCalledWith(1, updateUserDto);
//     });
//   });

//   describe('updateRole', () => {
//     it('should call userService.update with role change', async () => {
//       const updateUserDto: UpdateUserDto = { roleName: 'Admin' };
//       const mockUpdatedUser = { id: 1, roleName: 'Admin' };
//       jest.spyOn(userService, 'update').mockResolvedValue(mockUpdatedUser);

//       const result = await controller.updateRole('1', updateUserDto);
//       expect(result).toEqual(mockUpdatedUser);
//       expect(userService.update).toHaveBeenCalledWith(1, updateUserDto);
//     });
//   });

//   describe('delete', () => {
//     it('should delete a user using the token', async () => {
//       const token = 'Bearer mocktoken';
//       jest.spyOn(jwtService, 'verify').mockReturnValue({ id: 1 });
//       jest.spyOn(userService, 'remove').mockResolvedValue({ id: 1 });

//       const result = await controller.delete(token, {});
//       expect(result).toEqual({ id: 1 });
//       expect(userService.remove).toHaveBeenCalledWith(1);
//     });
//   });

//   describe('deleteUserForAdmin', () => {
//     it('should delete a user by id as admin', async () => {
//       jest.spyOn(userService, 'remove').mockResolvedValue({ id: 1 });

//       const result = await controller.deleteUserForAdmin('1', {});
//       expect(result).toEqual({ id: 1 });
//       expect(userService.remove).toHaveBeenCalledWith(1);
//     });
//   });
// });
