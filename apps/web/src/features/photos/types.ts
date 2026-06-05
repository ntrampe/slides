import type { Photo as PhotoDto } from '@slides/api-contract';

export type {
    ObjectFit,
    LayoutMode,
    FilterOperator,
    QuerySettings,
    PhotoAnimationType,
    PhotoLocation,
    PhotoCameraInfo,
    PhotoExifSettings,
    SlideshowTransitionType,
    ThemeMode,
} from '@slides/api-contract';

export type Photo = Omit<PhotoDto, 'createdAt'> & { createdAt: Date };
