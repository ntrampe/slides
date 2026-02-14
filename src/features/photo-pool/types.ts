import type { Photo } from "../photos";

export interface PhotoPoolOptions {
    shuffle?: boolean;
    preloadForward?: number;
    preloadBackward?: number;
}

export interface LoadedPhoto {
    photo: Photo;
    image: HTMLImageElement;
}