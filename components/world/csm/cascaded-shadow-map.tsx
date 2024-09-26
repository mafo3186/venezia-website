import { useFrame, useThree } from '@react-three/fiber';
import { useLayoutEffect, useMemo } from 'react';
import { Camera, PerspectiveCamera, Vector3, Vector3Tuple } from 'three';
import { CSM, CMSParameters } from './csm';

interface CascadedShadowMapProps extends Omit<CMSParameters, 'lightDirection' | 'camera' | 'parent'> {
  fade?: boolean;
  lightDirection?: Vector3Tuple;
}

class CSMProxy {
  instance: CSM | undefined;
  args: CMSParameters;

  constructor(args: CMSParameters) {
    this.args = args;
  }

  set fade(fade: boolean) {
    if (this.instance) {
      this.instance.fade = fade;
    }
  }

  set camera(camera: PerspectiveCamera) {
    if (this.instance) {
      this.instance.camera = camera;
    }
  }

  set lightDirection(vector: Vector3 | Vector3Tuple) {
    if (this.instance) {
      this.instance.lightDirection = Array.isArray(vector)
        ? new Vector3().fromArray(vector).normalize()
        : vector;
    }
  }

  attach() {
    this.instance = new CSM(this.args);
  }

  dispose() {
    if (this.instance) {
      this.instance.dispose();
    }
  }
}

export function CascadedShadowMap({
  maxFar = 50,
  shadowMapSize = 1024,
  lightIntensity = 0.25,
  cascades = 2,
  fade,
  lightDirection = [1, -1, 1],
  shadowBias = 0.000001,
  customSplitsCallback,
  lightMargin,
  mode,
}: CascadedShadowMapProps) {
  const camera = useThree((three) => three.camera);
  const parent = useThree((three) => three.scene);
  const proxyInstance = useMemo(
    () =>
      new CSMProxy({
        camera,
        cascades,
        customSplitsCallback,
        lightDirection: new Vector3().fromArray(lightDirection).normalize(),
        lightIntensity,
        lightMargin,
        maxFar,
        mode,
        parent,
        shadowBias,
        shadowMapSize,
      }),
    // These values will cause CSM to re-instantiate itself.
    // This is an expensive operation and should be avoided.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // Values that can be updated during runtime are omitted from this deps check.
      cascades,
      customSplitsCallback,
      fade,
      lightIntensity,
      lightMargin,
      maxFar,
      mode,
      shadowBias,
      shadowMapSize,
    ]
  );

  useFrame(() => {
    if (proxyInstance && proxyInstance.instance) {
      proxyInstance.instance.update();
    }
  }, 999999);

  useLayoutEffect(() => {
    proxyInstance.attach();

    return () => {
      proxyInstance.dispose();
    };
  }, [proxyInstance]);

  return (
    <primitive object={proxyInstance} camera={camera} fade={fade} lightDirection={lightDirection} />
  );
}
