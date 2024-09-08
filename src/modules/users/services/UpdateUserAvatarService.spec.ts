import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/cache/fakes/FakeCacheProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  promises: {
    stat: jest.fn(),
    unlink: jest.fn(),
  },
}));

const mockedFs = fs.promises as jest.Mocked<typeof fs.promises>;

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should throw an error if the user does not exist', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user-id',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should update the user avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Joao',
      email: 'teste@teste.com',
      password: '123456',
    });

    user.avatar = 'avatar1.jpg';

    const updatedUser = await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(updatedUser.avatar).toBe('avatar.jpg');
  });

  it('should delete the old avatar when updating to a new one', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Joao',
      email: 'teste@teste.com',
      password: '123456',
    });

    user.avatar = 'old-avatar.jpg';

    mockedFs.stat.mockResolvedValueOnce({} as fs.Stats);
    mockedFs.unlink.mockResolvedValueOnce();

    const updatedUser = await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'new-avatar.jpg',
    });

    expect(mockedFs.unlink).toHaveBeenCalledWith(
      path.join(uploadConfig.directory, 'old-avatar.jpg'),
    );
    expect(updatedUser.avatar).toBe('new-avatar.jpg');
  });

  it('should invalidate cache when avatar is updated', async () => {
    const invalidateSpy = jest.spyOn(fakeCacheProvider, 'invalidate');

    const user = await fakeUsersRepository.create({
      name: 'Joao',
      email: 'teste@teste.com',
      password: '123456',
    });

    user.avatar = 'avatar.jpg';

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    const key = process.env.USER_CACHE_PREFIX as string;
    expect(invalidateSpy).toHaveBeenCalledWith(key);
  });
});
