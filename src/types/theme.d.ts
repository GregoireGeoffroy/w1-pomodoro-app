import { Config } from 'tailwindcss';

declare module 'nativewind/theme' {
  interface Theme extends Config {
    colors: {
      pomodoro: {
        work: string;
        break: string;
        longBreak: string;
      };
    };
  }
} 