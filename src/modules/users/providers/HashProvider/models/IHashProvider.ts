export interface IHashProvider {
  generateHash(payload: string): Promise<string>;
  compareHash(payload: string, hashedPayload: string): Promise<boolean>;
}
