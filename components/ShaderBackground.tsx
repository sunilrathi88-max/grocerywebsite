import React, { Component, ReactNode } from 'react';
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';

interface ShaderBackgroundProps {
  opacity?: number;
}

// Fallback gradient component when shader fails
const FallbackGradient: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      className="absolute inset-0 bg-gradient-to-br from-brand-primary via-accent-brown to-brand-dark animate-pulse"
      style={{
        background: 'linear-gradient(135deg, #ff6a1a 0%, #c73c00 50%, #1a1a1a 100%)',
        animation: 'gradientShift 8s ease infinite',
      }}
    />
    {/* Dark overlay for text readability */}
    <div className="absolute inset-0 bg-black" style={{ opacity: 1 - opacity }} />
    <style>{`
            @keyframes gradientShift {
                0%, 100% { opacity: 0.8; }
                50% { opacity: 1; }
            }
        `}</style>
  </div>
);

// Error boundary specifically for the shader component
interface ShaderErrorBoundaryState {
  hasError: boolean;
}

class ShaderErrorBoundary extends Component<
  { children: ReactNode; opacity: number },
  ShaderErrorBoundaryState
> {
  constructor(props: { children: ReactNode; opacity: number }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ShaderErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, _errorInfo: React.ErrorInfo) {
    // Log to console for debugging, but don't crash the app
    console.warn('ShaderBackground failed to load, using fallback gradient:', error.message);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackGradient opacity={this.props.opacity} />;
    }

    return this.props.children;
  }
}

// Inner shader component that may throw
const ShaderContent: React.FC<{ opacity: number }> = ({ opacity }) => {
  // Props typed as any because @shadergradient/react types don't include all valid props
  // bgColor1/bgColor2 are valid runtime props but missing from type definitions
  const shaderProps = {
    control: 'props',
    animate: 'on',
    uTime: 0.2,
    uSpeed: 0.2,
    uStrength: 3,
    uDensity: 1.8,
    uFrequency: 5.5,
    uAmplitude: 0,
    type: 'waterPlane',
    color1: '#ff6a1a',
    color2: '#c73c00',
    color3: '#FD4912',
    bgColor1: '#000000',
    bgColor2: '#000000',
    cDistance: 2.4,
    cPolarAngle: 95,
    cAzimuthAngle: 180,
    cameraZoom: 1,
    positionX: 0,
    positionY: -2.1,
    positionZ: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 225,
    lightType: '3d',
    brightness: 1.2,
    grain: 'off',
    reflection: 0.1,
    wireframe: false,
    shader: 'defaults',
  } as const;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <ShaderGradientCanvas
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        pointerEvents="none"
        pixelDensity={1}
        fov={45}
      >
        <ShaderGradient {...(shaderProps as React.ComponentProps<typeof ShaderGradient>)} />
      </ShaderGradientCanvas>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black" style={{ opacity: 1 - opacity }} />
    </div>
  );
};

export function ShaderBackground({ opacity = 0.3 }: ShaderBackgroundProps) {
  return (
    <ShaderErrorBoundary opacity={opacity}>
      <ShaderContent opacity={opacity} />
    </ShaderErrorBoundary>
  );
}
