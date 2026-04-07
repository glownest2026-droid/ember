import { identifyUser as identifyUserImpl } from './posthogClient';

export function identifyUser(userId: string): void {
  identifyUserImpl(userId);
}

