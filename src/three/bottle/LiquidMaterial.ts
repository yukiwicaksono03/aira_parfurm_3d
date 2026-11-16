import * as THREE from 'three'

/**
 * Perfume liquid: vertical colour gradient (deep at the bottom), fresnel rim,
 * a slow caustic shimmer and a brighter meniscus line at the surface.
 * Colours are fed every frame from the live palette.
 */
export function createLiquidMaterial(height: number) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color() },
      uDeep: { value: new THREE.Color() },
      uRim: { value: new THREE.Color() },
      uHeight: { value: height },
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uFlare: { value: 0 },
    },
    vertexShader: /* glsl */ `
      uniform float uHeight;
      varying float vH;
      varying vec3 vNormalW;
      varying vec3 vViewDir;
      varying vec3 vLocal;
      varying vec3 vNormalL;
      void main() {
        vH = position.y / uHeight;
        vLocal = position;
        vNormalL = normal;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vNormalW = normalize(mat3(modelMatrix) * normal);
        vViewDir = normalize(cameraPosition - wp.xyz);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform vec3 uDeep;
      uniform vec3 uRim;
      uniform float uTime;
      uniform float uReveal;
      uniform float uFlare;
      varying float vH;
      varying vec3 vNormalW;
      varying vec3 vViewDir;
      varying vec3 vLocal;
      varying vec3 vNormalL;

      void main() {
        float h = clamp(vH, 0.0, 1.0);
        vec3 col = mix(uDeep, uColor, smoothstep(0.0, 1.05, h));

        float facing = max(dot(normalize(vNormalW), normalize(vViewDir)), 0.0);
        float fres = pow(1.0 - facing, 2.2);
        col = mix(col, uRim, fres * 0.3);

        // Slow interference pattern that reads as light moving through liquid.
        float c = sin(vLocal.x * 9.0 + uTime * 0.7)
                * sin(vLocal.y * 6.5 - uTime * 0.5)
                * sin(vLocal.z * 13.0 + uTime * 0.4);
        col += uColor * smoothstep(0.55, 1.0, c) * 0.18;

        // Meniscus: thin bright band on the liquid surface.
        float surface = smoothstep(0.6, 1.0, vNormalL.y) * smoothstep(0.9, 1.0, h);
        float edge = smoothstep(0.93, 0.995, h) * (1.0 - surface);
        col += uRim * (surface * 0.25 + edge * 0.35);

        col *= mix(0.06, 1.0, uReveal);
        col += uColor * uFlare * 0.25;

        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  })
}
