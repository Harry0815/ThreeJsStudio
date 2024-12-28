import { GLTF, GLTFLoader } from 'three-stdlib';

/**
 * Converts a base64 string to an ArrayBuffer containing the binary data.
 *
 * @param {string} base64 - The base64 string to convert.
 * @returns {ArrayBufferLike} - An ArrayBuffer containing the binary data.
 */
const base64ToArrayBuffer = (base64: string): ArrayBufferLike => {
  const binaryString = window.atob(base64); // Decodes the base64 string
  const length = binaryString.length;
  const bytes = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer; // Return ArrayBuffer
};

/**
 * Asynchronously loads a GLB content encoded as base64 string and parses it into a GLTF object.
 *
 * @param {string} glbContent - The base64-encoded GLB content to be loaded.
 * @returns {Promise<GLTF | undefined>} A Promise that resolves with the parsed GLTF object or undefined if loading fails.
 */
const loadGlbBase64 = async (glbContent: string): Promise<GLTF | undefined> => {
  const arrayBuffer = base64ToArrayBuffer(glbContent);
  const loader = new GLTFLoader();

  return new Promise<GLTF | undefined>((resolve, reject) => {
    loader.parse(
      arrayBuffer,
      '',
      (gltf) => {
        resolve(gltf);
      },
      (error) => {
        console.error('Error loading gltf content', error);
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        reject();
      },
    );
  });
};

/**
 * Asynchronously loads a GLB file from the specified path and parses it into a GLTF object.
 *
 * @param {string} glbPath - The path to the GLB file to be loaded.
 * @returns {Promise<GLTF | undefined>} A Promise that resolves with the parsed GLTF object or undefined if loading fails.
 */
const loadGlb = async (glbPath: string): Promise<GLTF | undefined> => {
  const loader = new GLTFLoader();
  return new Promise<GLTF | undefined>((resolve, reject) => {
    loader.load(
      glbPath,
      (gltf) => {
        resolve(gltf);
      },
      (para) => {
        if (para.loaded) {
          //
        }
      }, // onProgress callback, not needed here
      (error) => {
        console.error('Error loading gltf content', error);
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        reject(undefined);
      },
    );
  });
};

/**
 * Asynchronously loads a GLB file from the specified path or a base64-encoded string and parses it into a GLTF object.
 *
 * @param {string} content - The base64-encoded GLB content to be loaded.
 * @param {string} path - The path to the GLB file to be loaded.
 * @returns {Promise<GLTF | undefined>} A Promise that resolves with the parsed GLTF object or undefined if loading fails.
 */
export const glbLoader = async (content: string | undefined, path: string): Promise<GLTF | undefined> => {
  if (content) {
    return await loadGlbBase64(content);
  } else {
    return await loadGlb(path);
  }
};
