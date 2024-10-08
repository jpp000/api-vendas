import { compare, hash } from 'bcryptjs';
import { IHashProvider } from '../models/IHashProvider';

class BcryptHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  public async compareHash(
    payload: string,
    hashedPayload: string,
  ): Promise<boolean> {
    return compare(payload, hashedPayload);
  }
}

export default BcryptHashProvider;
