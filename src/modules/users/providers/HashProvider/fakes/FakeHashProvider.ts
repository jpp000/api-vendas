import { IHashProvider } from '../models/IHashProvider';

class FakeHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return payload;
  }

  public async compareHash(
    payload: string,
    hashedPayload: string,
  ): Promise<boolean> {
    return payload === hashedPayload;
  }
}

export default FakeHashProvider;
