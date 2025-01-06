export interface UserEntity {
  id: number;
  username: string;
  password: string;
}

export type comparePasssword = {
  password: string;
  hash: string;
};

export type RequestBody = { [key: string]: any };
