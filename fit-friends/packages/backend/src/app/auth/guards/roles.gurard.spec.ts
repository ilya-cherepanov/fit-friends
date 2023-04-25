import {Test} from '@nestjs/testing';
import {Reflector} from '@nestjs/core';
import {DeepMockProxy, mockDeep} from 'jest-mock-extended';
import {RolesGuard} from './roles.guard';
import {UserRole} from '@fit-friends/core';
import {ExecutionContext} from '@nestjs/common';


describe('RolesGuard', () => {
  let reflector: DeepMockProxy<Reflector>;
  let rolesGuard: RolesGuard;

  beforeEach(async () => {
    const module = await Test.createTestingModule({})
      .overrideProvider(Reflector)
      .useValue(mockDeep<Reflector>())
      .compile();

    reflector = module.get(Reflector);
    rolesGuard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(rolesGuard).toBeDefined();
  });

  it('should return true if roles not defined', () => {
    const context = mockDeep<ExecutionContext>();
    reflector.getAllAndOverride.mockReturnValue([]);

    expect(rolesGuard.canActivate(context)).toBeTruthy();
    expect(context.getHandler).toBeCalled();
    expect(context.getClass).toBeCalled();
  });

  it('should return true if user role is listed in Role decorator', () => {
    const context = mockDeep<ExecutionContext>();
    context.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        user: {
          role: UserRole.Sportsman,
        },
      }),
      getNext: jest.fn(),
      getResponse: jest.fn(),
    });

    reflector.getAllAndOverride.mockReturnValue([UserRole.Coach, UserRole.Sportsman]);

    expect(rolesGuard.canActivate(context)).toBeTruthy();
    expect(context.getHandler).toBeCalled();
    expect(context.getClass).toBeCalled();
    expect(context.switchToHttp).toBeCalled();
  });
});
