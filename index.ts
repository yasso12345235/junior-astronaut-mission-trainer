import 'react-native-gesture-handler';

import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';
import type { ComponentType } from 'react';

/**
 * Skia on web is backed by CanvasKit (WASM). The Skia web bindings capture
 * `global.CanvasKit` the moment the library is imported, so CanvasKit has to be
 * ready *before* any module that imports Skia (including the app tree) loads.
 * That is why the app component is imported lazily here.
 */
async function bootstrap(): Promise<void> {
  if (Platform.OS === 'web') {
    const { LoadSkiaWeb } = await import(
      '@shopify/react-native-skia/lib/module/web'
    );
    await LoadSkiaWeb({
      locateFile: (file: string) => `/${file}`,
    });
  }

  const appModule = await import('./App');
  registerRootComponent(appModule.default as ComponentType);
}

void bootstrap();
