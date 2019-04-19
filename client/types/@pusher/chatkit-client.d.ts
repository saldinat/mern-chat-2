export class ChatManager {
  constructor(...args: any[]);
  apiInstance: any;
  filesInstance: any;
  cursorsInstance: any;
  presenceInstance: any;
  userId: any;
  connectionTimeout: any;
  connect(...args: any[]): any;
  disconnect(): void;
}
export class TokenProvider {
  constructor(...args: any[]);
  url: any;
  queryParams: any;
  headers: any;
  fetchToken(): any;
  fetchFreshToken(): any;
  cacheIsStale(): any;
  cache(e: any, t: any): void;
  clearCache(): void;
  setUserId(e: any): void;
}
