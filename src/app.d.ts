// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      pb: PocketBase;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
  namespace svelteHTML {
    interface HTMLAttributes<T> {
      'on:outclick'?: () => boolean;
    }
  }
}

export { };
