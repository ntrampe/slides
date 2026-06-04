import type { Photo } from "../photos";

export interface PhotoPoolOptions {
    resetKey?: string;
    preloadForward?: number;
    preloadBackward?: number;
}

export interface LoadedPhoto {
    photo: Photo;
    image: HTMLImageElement;
}