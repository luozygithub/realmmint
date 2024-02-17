export interface ClaimViewState {
  loading: boolean;
  error?: ClaimViewErrorType | null;
}

export const enum ClaimViewErrorType {
  GENERAL_ERROR = 1,
}

/* 
  If you want to use 'ContainerState' keyword everywhere in your feature folder, 
  instead of the 'HomePageState' keyword.
*/
export type ContainerState = ClaimViewState;
