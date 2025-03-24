import { User } from 'src/modules/users/entity/user.entity';

export interface AuthenticatedRequest extends Request {
  user: User;
}

export enum UserRoles {
  user = 'user',
  editor = 'editor',
  viewer = 'viewer',
  admin = 'admin',
}
