import { type CommandConfirmationModalResult } from 'integracore-sdk/front-component';

export type CommandConfirmationModalPromiseCallbacks = {
  resolve: (result: CommandConfirmationModalResult) => void;
  reject: (error: Error) => void;
};
