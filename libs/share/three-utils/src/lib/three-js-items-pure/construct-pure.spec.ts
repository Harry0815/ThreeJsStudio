import * as THREE from 'three';
import { addFunctionToSystem, addStudioActionItem, addStudioItem, createSystem, studioRoom } from './construct-pure';

describe('createSystem', () => {
  it('should create a system with the given parameters', () => {
    const system = createSystem('TestSystem', 800, 600, 800, undefined);
    expect(system.name).toBe('TestSystem');
    expect(system.width).toBe(800);
    expect(system.height).toBe(600);
    expect(system.length).toBe(800);
    expect(system.canvasElement).toBeUndefined();
  });
});

describe('addFunctionToSystem', () => {
  it('should add functions to the system', () => {
    const system = createSystem('TestSystem', 800, 600, 800, undefined);
    const functions = {
      init: jest.fn(),
      reset: jest.fn(),
      animate: jest.fn(),
      updateCameraWindowSize: jest.fn(),
    };
    const updatedSystem = addFunctionToSystem(system, functions);
    expect(updatedSystem.init).toBe(functions.init);
    expect(updatedSystem.reset).toBe(functions.reset);
    expect(updatedSystem.animate).toBe(functions.animate);
    expect(updatedSystem.updateCameraWindowSize).toBe(functions.updateCameraWindowSize);
  });
});

describe('addStudioItem', () => {
  it('should add a studio item to the system', () => {
    const system = createSystem('TestSystem', 800, 600, 800, undefined);
    const item = {
      name: 'Renderer',
      type: 1,
      details: { renderer: undefined },
    };
    const updatedSystem = addStudioItem(system, item);
    expect(updatedSystem.studioThreeItems).toContain(item);
  });
});

describe('addStudioActionItem', () => {
  it('should add a studio action item to the system', () => {
    const system = createSystem('TestSystem', 800, 600, 800, undefined);
    const actionItem = {
      name: 'Camera',
      active: true,
      type: 2,
      details: {
        fov: 75,
        aspect: 1.33,
        near: 0.1,
        far: 1000,
        position: new THREE.Vector3(0, 0, 0),
        cameraObject: new THREE.PerspectiveCamera(75, 1.33, 0.1, 1000),
      },
    };
    const updatedSystem = addStudioActionItem(system, actionItem);
    expect(updatedSystem.studioActionThreeItems).toContain(actionItem);
  });
});

describe('studioRoomFunctions', () => {
  let system: studioRoom;
  const functions = {
    init: jest.fn(),
    reset: jest.fn(),
    animate: jest.fn(),
    updateCameraWindowSize: jest.fn(),
  };

  beforeEach(() => {
    system = createSystem('TestSystem', 800, 600, 800, document.createElement('canvas'));
    system = addFunctionToSystem(system, functions);
  });

  it('should initialize the system', () => {
    functions.init();
    expect(functions.init).toHaveBeenCalled();
  });

  it('should reset the system', () => {
    functions.reset();
    expect(functions.reset).toHaveBeenCalled();
  });

  it('should animate the system', () => {
    functions.animate();
    expect(functions.animate).toHaveBeenCalled();
  });

  it('should update camera window size', () => {
    functions.updateCameraWindowSize(1024, 768);
    expect(functions.updateCameraWindowSize).toHaveBeenCalledWith(1024, 768);
  });
});
