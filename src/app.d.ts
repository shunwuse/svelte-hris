// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      accessToken: string | null;
      refreshToken: string | null;
      api: import('$lib/api').ApiInstance;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
