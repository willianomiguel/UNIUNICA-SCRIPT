export type RemoteEntry = {
  apiUrl: string;
  apiKey?: string;
  integracoreCLIAccessToken?: string;
  integracoreCLIRefreshToken?: string;
  integracoreCLIRegistrationClientId?: string;
  workspaceName?: string;
  [field: string]: unknown;
};

export type ConfigFile = {
  version: 1;
  defaultRemote?: string;
  remotes: Record<string, RemoteEntry>;
  [field: string]: unknown;
};
