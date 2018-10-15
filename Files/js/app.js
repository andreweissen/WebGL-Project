/**
 * @file app.js
 * @fileoverview The main module of the program, contains several access
 * namespaces denoting which functions, arrays, enums, and variables may be
 * returned for external or global usage. Begun 10/05/2018
 * @author Andrew Eissen
 */
'use strict';

/* global mat4, mat3, ProjectFourDataModule, vec4 */

/**
 * @description This JavaScript module contains all the code related to the
 * assembly, construction, and display of the <code>canvas</code>-mediated scene
 * built with pure WebGL. Though much of the code related to the application
 * logic was developed specifically for this project, the author saw fit to copy
 * and tweak some of the code from his previous Three.js Project 3 submission,
 * specifically those functions related to the creation of DOM elements like
 * checkboxes and buttons as well as some utility functions related to addition
 * of dynamically-created elements to the DOM itself. This was done both to
 * minimize the need to "reinvent the wheel" in the creation of code the author
 * has already made and to allow the author to focus his efforts on the logic
 * related to the use of WebGL.
 * <br />
 * <br />
 * The author made use of a number of resources over the course of the project's
 * development. The Project 4 resources template packet files entitled
 * <a href="//math.hws.edu/graphicsbook/source/webgl/diskworld-2.html">
 * diskworld-2.html</a>,
 * <a href="//math.hws.edu/graphicsbook/source/webgl/bumpmap.html">
 * bumpmap.html</a> and
 * <a href="//math.hws.edu/graphicsbook/source/webgl/texture-transform.html">
 * texture-transform.html</a> were used as the templates for this project, while
 * data related to the generation of 3D scene objects was retrieved from
 * <a href="https://bit.ly/2OnaOu5">basic-object-models-IFS.js</a> and Nick
 * Desaulniers' (nick@mozilla.com)
 * <a href="https://github.com/nickdesaulniers/prims">"3D Geometry Primitives
 * for WebGL"</a> free-use GitHub repository. While the author had a great deal
 * of trouble implementing the application of textures, he hopes his included
 * attempt was a valiant effort due to its successfully application of color
 * textures.
 * <br />
 * <br />
 * <pre>
 * Table of contents
 * - Enums
 *   - Utility                    Line 0109
 *   - Identifiers                Line 0132
 *   - Text                       Line 0157
 *   - Colors                     Line 0177
 *   - DefaultUniforms            Line 0201
 *   - Textures                   Line 0225
 *   - Shaders                    Line 0245
 * - Data arrays
 *   - debugSceneObjectsData      Line 0369
 *   - sceneObjectsData           Line 0400
 *   - lightSourceData            Line 0595
 *   - sidebarButtonData          Line 0632
 * - Functions
 *   - Utility functions          Line 0650
 *   - Assembly functions         Line 0788
 *   - Handler functions          Line 1381
 *   - Main functions             Line 1930
 *   - Accessible functions       Line 2166
 * </pre>
 *
 * @see {@link math.hws.edu/graphicsbook/source/webgl/diskworld-2.html|dw2}
 * @see {@link math.hws.edu/graphicsbook/source/webgl/bumpmap.html|bm}
 * @see {@link math.hws.edu/graphicsbook/source/webgl/texture-transform.html|tt}
 * @see {@link https://bit.ly/2OnaOu5|basic-object-models-IFS.js}
 * @see {@link https://github.com/nickdesaulniers/prims|/prims}
 * @author Andrew Eissen
 * @module ProjectFourModule
 * @const
 * @param {ProjectFourDataModule} Polyhedra
 */
const ProjectFourModule = (function (Polyhedra) {

  // Declare access namespaces
  let accessible, inaccessible;

  // Define access namespaces
  accessible = accessible || {};
  inaccessible = inaccessible || {};

  /**
   * @description Debug mode is used by the author to test object-specific
   * transformations by hand on a single object (a Sierpinski triangle) located
   * at the origin. This allows the author to make sure rotations about the axes
   * are undertaken as per user expectations without a skewing of the axes.
   *
   * @type Boolean
   * @const
   */
  const DEBUG = false;

  // Enums

  /**
   * @description Enum for assorted utility constants. Herein are set constants
   * required in various contexts. These values were moved from their previous
   * in-function placements to assist in ease of adjustment if a value needs to
   * be changed universally for all elements or functions making use of that
   * value. Object is made immutable via <code>Object.freeze</code>.
   *
   * @readonly
   * @enum {number}
   */
  inaccessible.Utility = Object.freeze({
    FADE_IN_INTERVAL: 10,
    OPACITY_INCREASE_AMOUNT: 0.015,
    CANVAS_WIDTH: 640,
    CANVAS_HEIGHT: 480,
    ASPECT_RATIO: 4/3,
    CAMERA_FOV: Math.PI / 6,
    FRUSTRUM_NEAR_PLANE: 1,
    FRUSTRUM_FAR_PLANE: 100,
    DEBUG_ZOOM_DEGREE: 7,
  });

  /**
   * @description This enum is used to store the <code>String</code>
   * representations of the various DOM element ids and class names present in
   * the interface. This enum is useful in assisting the process of grabbing
   * elements in the DOM via <code>document.getElementById</code> in multiple
   * places, allowing the user to adjust these names as needed without having to
   * sift through all the application logic functions below for each appearance.
   *
   * @readonly
   * @enum {string}
   */
  inaccessible.Identifiers = Object.freeze({
    CONTAINER_ID: 'container',
    CONTAINER_MODULE: 'container-module',
    SIDEBAR_ID: 'interface-sidebar',
    SIDEBAR_MODULE_CLASS: 'sidebar-module',
    SIDEBAR_ELEMENT_CLASS: 'sidebar-element',
    CANVAS_HOLDER_ID: 'canvas-holder',
    CANVAS_ID: 'glcanvas',
    FORM_ID: 'toggle-button-holder',
    HEADER_CLASS: 'header-text',
    CHECKBOX_CLASS: 'toggle-button',
    LABEL_CLASS: 'toggle-button-label',
    BUTTON_CLASS: 'action-button',
    BUTTON_HOLDER_ID: 'button-holder',
  });

  /**
   * @description This enum is used to store all the text <code>String</code>s
   * used in the display of popup <code>window.alert</code>s or error messages
   * to be appended to the main container element, as well as the text nodes of
   * button or checkbox label elements.
   *
   * @readonly
   * @enum {string}
   */
  inaccessible.Text = Object.freeze({
    LABEL: 'Toggle',
    CHECKBOXES_HEADER: 'Animation display options',
    BUTTON_HOLDER_HEADER: 'Interaction buttons',
    ERROR_TEXT: 'Error: WebGL is not compatible with your current browser.',
    START_BUTTON_ERROR: 'Animation is already running.',
    STOP_BUTTON_ERROR: 'Animation is not currently running.',
  });

  /**
   * @description This enum contains the GL color arrays with values ranging
   * from 0 to 1 that are used to color the various elements of the scene, from
   * the background of the <code>canvas</code> to the objects themselves to the
   * various light properties. They are mostly derived from the example resource
   * file entitled <code>diskworld-2.html</code>
   *
   * @see {@link math.hws.edu/graphicsbook/source/webgl/diskworld-2.html|dw2}
   * @readonly
   * @enum {!Array<number>}
   */
  inaccessible.Colors = Object.freeze({
    WHITE: [1, 1, 1, 1],
    BLACK: [0, 0, 0, 1],
    GRAY: [0.1, 0.1, 0.1, 1],
    CHARCOAL: [0.35, 0.35, 0.35, 1],
    LIGHTGRAY: [0.5, 0.5, 0.5, 1],
    COPPER: [0.5, 0.3, 0.1, 1],
    BROWN: [0.5, 0.3, 0.1, 1],
    GREEN: [0, 0.8, 0, 1],
    YELLOW: [0.5, 0.5, 0, 1],
    GOLD: [0.5, 0.5, 0.2, 1],
  });

  /**
   * @description This enum is used to store default values to be applied to the
   * various included uniform shader variables at the initialization of the
   * WebGL shader part of the program, found at <code>inaccessible.initGL</code>
   * and undertaken in <code>inaccessible.handleSettingOfDefaultUniforms</code>.
   * It contains mainly numbers and number array <code>Colors</code> enum values
   * divided between <code>material</code> and <code>lights</code> aspects.
   *
   * @readonly
   * @enum {number}
   */
  inaccessible.DefaultUniforms = Object.freeze({
    MATERIAL: {
      diffuseColor: inaccessible.Colors.BLACK,
      specularColor: inaccessible.Colors.GRAY,
      emissiveColor: inaccessible.Colors.BLACK,
      specularExponent: 16,
    },
    LIGHTS: {
      enabled: 1,
      position: [0, 0, 1, 0],
      color: inaccessible.Colors.WHITE,
      attenuation: 0,
    },
  });

  /**
   * @description This enum contains the <code>String</code> representations of
   * the local addresses at which the included texture images (<code>jpg</code>)
   * are located for loading and application within the body of
   * <code>inaccessible.handleTextureLoading</code>.
   *
   * @readonly
   * @enum {string}
   */
  inaccessible.Textures = Object.freeze({
    SUN: 'textures/sun.jpg',
    JUPITER: 'textures/jupiter.jpg',
  });

  /**
   * @description This enum contains the fragment and vertex shaders written in
   * the GLSL shading language that are used to affect change in the
   * <code>canvas</code>-mediated 3D scene. These particular shaders were built
   * from the templates found in the "diskworld-2.html" resource file and
   * modified using code from the file "bumpmap.html" to incorporate the use of
   * textures. The author is not 100% sure this was done correctly, but given
   * the lack of console errors and the ability to paint objects with a flat
   * color texture, he assumes they must be mostly right.
   *
   * @see {@link math.hws.edu/graphicsbook/source/webgl/diskworld-2.html|dw2}
   * @see {@link math.hws.edu/graphicsbook/source/webgl/bumpmap.html|bm}
   * @readonly
   * @enum {string}
   */
  inaccessible.Shaders = Object.freeze({
    VERTEX: `
      attribute vec3 a_coords;
      attribute vec3 a_normal;
      attribute vec2 a_texCoords;
      uniform mat4 modelview;
      uniform mat4 projection;
      uniform mat3 textureTransform;
      varying vec3 v_normal;
      varying vec3 v_eyeCoords;
      varying vec2 v_texCoords;

      void main() {
        vec4 coords = vec4(a_coords, 1.0);
        vec4 eyeCoords = modelview * coords;
        gl_Position = projection * eyeCoords;
        v_normal = normalize(a_normal);
        v_eyeCoords = eyeCoords.xyz / eyeCoords.w;
        vec3 texcoords = textureTransform * vec3(a_texCoords, 1.0);
        v_texCoords = texcoords.xy;
      }
    `,
    FRAGMENT: `
      #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
      #else
        precision mediump float;
      #endif

      struct MaterialProperties {
        vec4 diffuseColor;
        vec3 specularColor;
        vec3 emissiveColor;
        float specularExponent;
      };

      struct LightProperties {
        bool enabled;
        vec4 position;
        vec3 color;
        float attenuation;
      };

      uniform MaterialProperties material;
      uniform LightProperties lights[2];
      uniform mat3 normalMatrix;
      uniform sampler2D texture;
      uniform bool useTexture;
      varying vec3 v_normal;
      varying vec3 v_eyeCoords;
      varying vec2 v_texCoords;

      vec3 lightingEquation (LightProperties light, MaterialProperties material,
          vec4 diffuse, vec3 eyeCoords, vec3 N, vec3 V) {

        vec3 L, R;
        float attenuationFactor = 1.0;

        if (light.position.w == 0.0) {
          L = normalize(light.position.xyz);
        } else {
          L = normalize(light.position.xyz/light.position.w - v_eyeCoords);

          if (light.attenuation > 0.0) {
            float dist =
                distance(eyeCoords, light.position.xyz / light.position.w);
            attenuationFactor = 1.0 / (1.0 + dist * light.attenuation);
          }
        }

        if (dot(L, N) <= 0.0) {
          return vec3(0.0);
        }

        vec3 reflection = dot(L, N) * light.color * diffuse.rgb;
        R = -reflect(L, N);

        if (dot(R, V) > 0.0) {
          float factor = pow(dot(R, V), material.specularExponent);
          reflection += factor * material.specularColor * light.color;
        }

        return attenuationFactor * reflection;
      }

      void main () {
        vec3 normal = normalize(normalMatrix * v_normal);
        vec3 viewDirection = normalize(-v_eyeCoords);
        vec3 color = material.emissiveColor;
        vec4 diffuse;

        if (useTexture) {
            diffuse = texture2D(texture, v_texCoords);
        } else {
            diffuse = material.diffuseColor;
        }

        for (int i = 0; i < 2; i++) {
          if (lights[i].enabled) {
            if (gl_FrontFacing) {
              color += lightingEquation(lights[i], material, diffuse,
                  v_eyeCoords, normal, viewDirection);
            } else {
              color += lightingEquation(lights[i], material, diffuse,
                  v_eyeCoords, -normal, viewDirection);
            }
          }
        }

        gl_FragColor = vec4(color, diffuse.a);
      }
    `,
  });

  // Data arrays

  /**
   * @description This array of object data contains only a single Sierpinski
   * triangular solid located at the origin and is solely used when the
   * <code>DEBUG</code> global flag is set to a value of <code>true</code>. The
   * use of a single object allows the author to test that each object's
   * rotational values are being undertaken according to the proper axis without
   * any skewing, in accordance with user expectations.
   */
  inaccessible.debugSceneObjectsData = [
    {
      shapeType: 'Sierpinski',
      shapeColor: inaccessible.Colors.WHITE,
      isWireFrame: false,
      materialUniforms: {
        specularColor: inaccessible.Colors.WHITE,
        specularExponent: 32,
      },
      transformations: {
        translate: [0, 0, 0],
        scale: [0.5, 0.5, 0.5],
        rotate: {
          x: 5,
        },
      },
    },
  ];

  /**
   * @description This array of objects was designed based on the author's
   * approach to the Project 3 Three.js assignment, including all scene object
   * data in individual objects for ease of modification and alteration in the
   * event of an object needing adjustment. In each object, properties related
   * to scaling, rotation amounts, and default translation placement in the
   * scene are included to allow the author to more easily place the item in its
   * desired spot. Also included are properties related to polyhedron type, item
   * color, and specular shininess levels to allow the author to satisfy rubric
   * requirements related to ten (10) different shapes and distinct material
   * types.
   */
  inaccessible.sceneObjectsData = [
    {
      shapeType: 'Sierpinski',
      shapeColor: inaccessible.Colors.BROWN,
      isWireFrame: false,
      materialUniforms: {
        specularColor: inaccessible.Colors.WHITE,
        specularExponent: 32,
      },
      transformations: {
        translate: [0, 0, -1],
        scale: [0.5, 0.5, 0.5],
        rotate: {
          x: -9,
          y: 2,
        },
      },
    },
    {
      shapeType: 'Icosahedron',
      shapeColor: inaccessible.Colors.BROWN,
      isWireFrame: false,
      materialUniforms: {
        specularColor: inaccessible.Colors.WHITE,
        specularExponent: 16,
      },
      transformations: {
        translate: [1, 0, 0],
        scale: [0.3, 0.3, 0.3],
        rotate: {
          x: 0,
          y: 5,
          z: -1,
        },
      },
    },
    {
      shapeType: 'Dodecahedron',
      shapeColor: inaccessible.Colors.BROWN,
      isWireFrame: false,
      materialUniforms: {
        specularColor: inaccessible.Colors.WHITE,
        specularExponent: 16,
      },
      transformations: {
        translate: [-1, 0, 0],
        scale: [0.3, 0.3, 0.3],
        rotate: {
          x: -2,
          y: 4,
          z: -2,
        },
      },
    },
    {
      shapeType: 'Octahedron',
      shapeColor: inaccessible.Colors.BROWN,
      isWireFrame: false,
      materialUniforms: {
        specularColor: inaccessible.Colors.GRAY,
        specularExponent: 16,
      },
      transformations: {
        translate: [0, 0, 1],
        scale: [0.3, 0.3, 0.3],
        rotate: {
          x: 0,
          y: 7,
        },
      },
    },
    {
      shapeType: 'Pyramid',
      shapeColor: inaccessible.Colors.GOLD,
      isWireFrame: false,
      materialUniforms: {
        specularColor: inaccessible.Colors.BLACK,
        specularExponent: 16,
      },
      transformations: {
        translate: [3, 0, -3],
        scale: [0.5, 0.5, 0.5],
        rotate: {
          x: -5,
          y: 3,
        },
      },
    },
    {
      shapeType: 'Cylinder',
      shapeColor: inaccessible.Colors.GOLD,
      isWireFrame: true,
      materialUniforms: {
        specularColor: inaccessible.Colors.BLACK,
        specularExponent: 16,
      },
      transformations: {
        translate: [3, 0, 3],
        scale: [0.3, 0.2, 0.3],
        rotate: {
          x: -5,
          y: 5,
        },
      },
    },
    {
      shapeType: 'Cube',
      shapeColor: inaccessible.Colors.GOLD,
      isWireFrame: false,
      materialUniforms: {
        specularColor: inaccessible.Colors.GRAY,
        specularExponent: 32,
      },
      transformations: {
        translate: [-3, 0, 3],
        scale: [0.25, 0.25, 0.25],
        rotate: {
          x: -8,
          y: 5,
        },
      },
    },
    {
      shapeType: 'Tetrahedron',
      shapeColor: inaccessible.Colors.GOLD,
      isWireFrame: false,
      materialUniforms: {
        specularColor: inaccessible.Colors.GRAY,
        specularExponent: 16,
      },
      transformations: {
        translate: [-3, 0, -3],
        scale: [0.3, 0.3, 0.3],
        rotate: {
          x: -2,
          y: 7,
        },
      },
    },
    {
      shapeType: 'Sphere',
      shapeColor: inaccessible.Colors.BROWN,
      isWireFrame: false,
      texture: inaccessible.Textures.JUPITER,
      materialUniforms: {
        specularColor: inaccessible.Colors.WHITE,
        specularExponent: 32,
      },
      transformations: {
        translate: [0, -2, 2],
        scale: [0.3, 0.3, 0.3],
        rotate: {
          x: 0,
          y: 5,
        },
      },
    },
    {
      shapeType: 'Ring',
      shapeColor: inaccessible.Colors.BROWN,
      isWireFrame: false,
      texture: inaccessible.Textures.SUN,
      materialUniforms: {
        specularColor: inaccessible.Colors.WHITE,
        specularExponent: 32,
      },
      transformations: {
        translate: [0, 2, -2],
        scale: [1, 1, 1],
        rotate: {
          x: -1,
          y: 2,
          z: 5,
        },
      },
    },
  ];

  /**
   * @description As per the rubric requirements to include multiple different
   * light sources, the author has included a pair of lights of different types
   * to light the scene. The first light is the centerpoint of the scene, a
   * small sun based on <code>diskworld-2.html</code>'s middle lamppost, which
   * eminates emissive light of a dim yellow color and possesses an attentuation
   * level for distance-related lighting. It takes the shape of a small sphere
   * (which should have a sun texture but which does not due to the author's
   * issues with applying textures to items).
   * <br />
   * <br />
   * The second light source is the viewpoint light, also based on that included
   * in the aforementioned template file, but which was augmented slightly to a
   * lighter gray to light the scene a bit more easily. It has no shape of its
   * own, nor does it eminate any emissive light color properties. Both lights
   * may be turned off by the user at any time without issue.
   */
  inaccessible.lightSourceData = [
    { // Sun
      lightText: 'SunLight',
      shapeType: 'Sphere',
      shapeColor: inaccessible.Colors.WHITE,
      texture: inaccessible.Textures.SUN,
      materialUniforms: {
        emissiveColor: inaccessible.Colors.YELLOW,
      },
      lightsUniforms: {
        enabled: 1,
        position: [0, 0, 0, 1],
        color: inaccessible.Colors.WHITE,
        attenuation: .25,
      },
      transformations: {
        translate: [0, 0, 0],
        scale: [0.15, 0.15, 0.15],
      },
    },
    { // Viewpoint light
      lightText: 'ViewpointLight',
      lightsUniforms: {
        enabled: 1,
        color: inaccessible.Colors.CHARCOAL,
      },
    },
  ];

  /**
   * @description This array of objects is used to store data pertaining to the
   * types of interface buttons to be appended to the sidebar. Contained in each
   * object are properties related to name, <code>String</code> representation
   * of the event listener handler function signature associated with that
   * button, and a set of potential arguments to pass as parameters to that
   * function.
   */
  inaccessible.sidebarButtonData = [
    {
      buttonType: 'Start animation',
      functionName: 'handleAnimationStart',
      functionArguments: [],
    },
    {
      buttonType: 'Stop animation',
      functionName: 'handleAnimationStop',
      functionArguments: [],
    },
    {
      buttonType: 'Reset model',
      functionName: 'handleReset',
      functionArguments: [],
    },
  ];

  // Utility functions

  /**
   * @description This function is based on the similarly-named fading function
   * available by default in jQuery. As the scene is set to an opacity style
   * value of 0 from the start (namely in its bulk assembly function
   * <code>inaccessible.assembleBodyFramework</code>), this function simply
   * increases the element's opacity until it reaches a value of 1, thus giving
   * the impression of the scene fading in from the start. This helps hide the
   * often jerky scene and interface assembly sequence from view for a few
   * milliseconds.
   *
   * @param {string} paramElementId
   * @returns {void}
   */
  inaccessible.fadeIn = function (paramElementId) {

    // Declarations
    let that, container, interval;

    // Definitions
    that = this;
    container = document.getElementById(paramElementId);
    interval = setInterval(function () {
      if (container.style.opacity < 1) {
        container.style.opacity = (parseFloat(container.style.opacity) +
            that.Utility.OPACITY_INCREASE_AMOUNT);
      } else {
        clearInterval(interval);
        return;
      }
    }, this.Utility.FADE_IN_INTERVAL);
  };

  /**
   * @description Like <code>inaccessible.prepend</code>, this function is based
   * on jQuery's <code>$().append()</code> function used to add a DOM element
   * to another based on a <code>String</code> representation of the container's
   * id or class name.
   *
   * @param {string} paramTarget
   * @param {string} paramSubject
   * @returns {void}
   */
  inaccessible.append = function (paramTarget, paramSubject) {
    document.getElementById(paramTarget).appendChild(paramSubject);
  };

  /**
   * @description Like <code>inaccessible.append</code>, this function is based
   * on jQuery's <code>$().prepend()</code> function used to add a DOM element
   * to another based on a <code>String</code> representation of the container's
   * id or class name.
   *
   * @param {string} paramTarget
   * @param {string} paramSubject
   * @returns {void}
   */
  inaccessible.prepend = function (paramTarget, paramSubject) {
    document.getElementById(paramTarget).insertBefore(paramSubject,
        paramTarget.firstChild);
  };

  /**
   * @description This function returns a <code>boolean</code> value based on
   * whether or not the inputted object is an array. It is used by
   * <code>inaccessible.assembleElement</code> to determine if inputted
   * parameters need to be formatted as arrays.
   *
   * @param {object} paramTarget
   * @returns {boolean}
   */
  inaccessible.isArray = function (paramTarget) {
    return Object.prototype.toString.call(paramTarget) === '[object Array]';
  };

  /**
   * This helper method is used to determine whether or not the included
   * parameter argument is of a power of two. This is used by the function
   * <code>inaccessible.handleTextureLoading</code> to know whether or not the
   * image width and height properties merit the generation of mipmaps.
   *
   * @param {number} paramValue
   * @returns {number}
   */
  inaccessible.isPowerOf2 = function (paramValue) {
    return (paramValue & (paramValue - 1)) === 0;
  };

  /**
   * @description This utility method, like that below it, is used to manipulate
   * the matrix pseudo-stack containing various clones of the modelview matrix
   * object-global. This particular method is used to push a copy of the current
   * modelview matrix onto the matrix stack.
   *
   * @returns {void}
   */
  inaccessible.pushMatrix = function () {
    this.matrixStack.push(mat4.clone(this.modelview));
  };

  /**
   * @description This utility method, like that above it, is used to manipulate
   * the matrix pseudo-stack containing various clones of the modelview matrix
   * object-global. This particular method is used to restore the modelview
   * matrix to a value popped from the matrix stack.
   *
   * @returns {void}
   */
  inaccessible.popMatrix = function () {
    this.modelview = this.matrixStack.pop();
  };

  /**
   * @description This utility method is used within the body of the texture
   * builder <code>inaccessible.handleTextureLoading</code> to apply a
   * temporary color texture to the object while waiting for the actual image
   * <code>.jpg</code> file to load for use. This function converts one of the
   * <code>inaccessible.Colors</code> arrays from a range of 0 -> 1 to a range
   * of 0 -> 255 and returns it within a new <code>Uint8Array</code> instance.
   *
   * @param {!Array<number>} paramColorArray
   * @returns {Uint8Array}
   */
  inaccessible.convertColorToUint8Array = function (paramColorArray) {

    // Declaration
    let newUint8Array;

    //Definition
    newUint8Array = [];
    for (let i = 0; i < paramColorArray.length; i++) {
      newUint8Array.push(paramColorArray[i] * 255);
    }

    return new Uint8Array(newUint8Array);
  };

  // Assembly functions

  /**
   * @description This assembly function is used to create the required shaders
   * used to render the object in the scene, namely the fragment shader and the
   * vertex shader. It accepts as a parameter argument an array of objects
   * containing the appropriate gl shader type and the associated template
   * string literal housed in the <code>inaccessible.Shaders</code> enum. A new
   * shader program object is created herein, to which the constructed shaders
   * are attached. Once this process is complete, the shader program is returned
   * to the calling function <code>inaccessible.main</code> where it is applied
   * as an object-global and later used in
   * <code>inaccessible.handleSceneAnimation</code>.
   *
   * @param {!Array<object>} paramShaders
   * @returns {object} shaderProgram
   */
  inaccessible.assembleShaderProgram = function (paramShaders) {

    // Declarations
    let that, shaderProgram, shader;

    // Definitions
    that = this;
    shaderProgram = this.gl.createProgram();

    // Iterate through shaders, build each from string content, & add to program
    paramShaders.forEach(function (shaderSetEntry) {

      // New shader
      shader = that.gl.createShader(shaderSetEntry.type);

      // Configure shader
      that.gl.shaderSource(shader, shaderSetEntry.contents);
      that.gl.compileShader(shader);
      that.gl.attachShader(shaderProgram, shader);
    });

    // Apply assembled program
    this.gl.linkProgram(shaderProgram);

    // Return, later define as object-global for future use
    return shaderProgram;
  };

  /**
   * @description This assembly function is used by
   * <code>inaccessible.assembleShapeTemplate</code> to assist in the creation
   * of <code>WebGLBuffer</code> objects to be applied to each of the desired
   * polyhedron templates used to generate specific instances of this shape type
   * for display in the scene. Accepting an array of coordinates (either
   * vertices, indices, normals, or texture coords) and a <code>String</code>
   * representation of the buffer type, the method binds the appropriate data
   * to a new buffer object and returns it.
   *
   * @param {!Array<number>} paramDataArray
   * @param {string} paramBufferType
   * @returns {WebGLBuffer} newBuffer
   */
  inaccessible.assembleBuffer = function (paramDataArray, paramBufferType) {

    // Declaration
    let newBuffer;

    // Definition and config
    newBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl[paramBufferType], newBuffer);
    this.gl.bufferData(this.gl[paramBufferType], paramDataArray,
        this.gl.STATIC_DRAW);

    // Return new buffer for attachment to model
    return newBuffer;
  };

  /**
   * @description This assembly function is used to create a new shape template
   * defining a certain type of buildable polyhedron type denoted by its
   * vertices, normals, indices, and (if applicable) texture coordinates. It is
   * useful to think of this as the definition of a Java class from which new
   * instances of the class may be initialized and built. In much the same way,
   * individual iterations of this template type may be created, transformed,
   * and added the scene using the default buffers built herein.
   * <br />
   * <br />
   * The template model is an object containing as a series of properties a list
   * of <code>WebGLBuffer</code> instances created by
   * <code>inaccessible.assembleBuffer</code> as needed. This is done to help
   * manage memory resources required to render multiple instances of this type
   * in accordance with the rubric requirements and the precedent established
   * by <code>diskworld-2.html</code>. Each template has at least three buffers
   * related to normals, vertices, and indices, with select template types
   * possessing a fourth buffer related to texture application coordinates.
   * Additional properties include an <code>isAnimated</code> boolean allowing
   * the user to remove all instances of a certain template type from the scene
   * by selected a checkbox in the user interface. This was especially useful to
   * the author during the testing period, as it allowed him to inspect one type
   * at a time to ensure all transformation were undertaken as expected.
   *
   * @param {string} paramType
   * @param {object} paramModelData
   * @returns {object} model
   */
  inaccessible.assembleShapeTemplate = function (paramType, paramModelData) {

    // Declarations
    let that, model;

    // Definitions
    that = this;
    model = {};

    model.shapeType = paramType; // "Icosahedron"
    model.coordsBuffer = this.assembleBuffer(paramModelData.vertexPositions,
        'ARRAY_BUFFER');
    model.normalBuffer = this.assembleBuffer(paramModelData.vertexNormals,
        'ARRAY_BUFFER');
    if (paramModelData.vertexTextureCoords != null) {
      model.texCoordsBuffer =
          this.assembleBuffer(paramModelData.vertexTextureCoords,
            'ARRAY_BUFFER');
    }
    model.indexBuffer = this.assembleBuffer(paramModelData.indices,
        'ELEMENT_ARRAY_BUFFER');
    model.count = paramModelData.indices.length;
    model.isAnimated = true;

    return model;
  };

  /**
   * @description This helper assembly function is simply used to mass-create
   * the various polyhedron templates and their associated buffers required to
   * build and render instances of this type in the <code>canvas</code>-mediated
   * scene. It iterates through the getter function properties marked externally
   * accessible by the module argument parameter <Code>Polyhedra</code> (really
   * <code>ProjectFourDataModule</code> in <code>js/data.js</code>), defining
   * the template name and data object accordingly and passing them to the
   * builder function <code>inaccessible.assembleShapeTemplate</code>.
   *
   * @returns {void}
   */
  inaccessible.assembleShapeTemplates = function () {

    // Declarations
    let getter, polyhedronName, data;

    for (getter in Polyhedra) {

      // "getIcosahedron" -> "Icosahedron"
      polyhedronName = getter.split('get')[1];

      // "Polyhedra.getIcosahedron()"
      data = Polyhedra[getter]();

      this.templates[polyhedronName] =
          this.assembleShapeTemplate(polyhedronName, data);
    }
  };

  /**
   * @description This assembly function is responsible for iterating through
   * the object-global array of lght source config objects housed at
   * <code>inaccessible.lightSourceData</code>, applying each applicable value
   * to the appropriate shader uniform variable as required. As there is a fair
   * bit of variance permitted in light sources, frequent <code>if</code>
   * statements are used just for clarity's sake. Default values are applied at
   * the initialization of the GL context in <code>inaccessible.initGL</code>,
   * but the author just wanted to make sure erroneous or undefined values were
   * never applied by accident.
   *
   * @returns {void}
   */
  inaccessible.assembleLights = function () {

    // Declarations
    let light, key;

    for (let i = 0; i < this.lightSourceData.length; i++) {
      this.pushMatrix();

      // Definition
      light = this.lightSourceData[i];

      // Apply custom lights uniforms if they exist
      if (light.lightsUniforms != null) {
        for (key in light.lightsUniforms) {
          this.handleDefinitionOfUniform(light.lightsUniforms, key, i);
        }
      }

      // If the light is physically in the scene, configure size and placement
      if (light.transformations != null) {
        for (key in light.transformations) {
          mat4[key](this.modelview, this.modelview, light.transformations[key]);
        }
      }

      // Emissive color is set herein if applicable
      if (light.materialUniforms != null) {
        for (key in light.materialUniforms) {
          this.handleDefinitionOfUniform(light.materialUniforms, key);
        }
      }

      // Only applicable to lights in the scene (not viewpoint/global lights)
      if (light.shapeType != null && light.shapeColor != null) {
        this.handleLightPositioning(this.u_lights[i].position,
          light.lightsUniforms.position);
        this.handleShapeTemplateRendering(light);
      }

      // Reset material uniforms, specifically emissiveColor
      if (light.materialUniforms != null) {
        for (key in light.materialUniforms) {
          this.handleDefinitionOfUniform(this.DefaultUniforms.MATERIAL, key);
        }
      }

      this.popMatrix();
    }
  };

  /**
   * @description Like the assembly function above it, namely
   * <code>inaccessible.assembleLights</code>, this function is used to create
   * and configure the various scene objects housed in the object-global array
   * <code>inaccessible.sceneObjectsData</code>. Depending on the config object,
   * various transformations about the object's own axes may be undertaken in
   * addition to each object's orbit around the central "sun" object.
   * <br />
   * <br />
   * Unlike the aforementioned light assembly function above, however, this
   * particular function was initially difficult to implement due to the author
   * forgetting to include the necessary <code>mat4.rotate</code> code making
   * use of the frame counter object-global <code>frameCounter</code>. Prior to
   * discovering this error, the author was simply making use of the deprecated
   * object-global counter <code>orbitAngle</code> originally used to move
   * objects around their own axes at various rates. This resulted in an
   * axes-skew from the camera position, meaning objects were placed properly
   * but rotated such that the camera was looking down the x-axis rather than
   * the z-axis. This took some wasted effort to figure out and required a look
   * at the resource file <code>diskworld-2.html</code>.
   *
   * @returns {void}
   */
  inaccessible.assembleScene = function () {

    // Declarations
    let dataContents, current, matrixFunctionName, key, value;

    if (DEBUG) {
      dataContents = this.debugSceneObjectsData;
    } else {
      dataContents = this.sceneObjectsData;
    }

    for (let i = 0; i < dataContents.length; i++) {

      // Define
      current = dataContents[i];

      // If user wants all items of this shape hidden, we move on to the next
      if (!this.templates[current.shapeType].isAnimated) {
        continue;
      }

      this.pushMatrix();

      // Define object's orbit around the sun (y-axis)
      if (!DEBUG) {
        mat4.rotate(this.modelview, this.modelview,
            (-this.frameNumber) / 180 * Math.PI, [0, 1, 0]);
      }

      // Move origin to the object's specific location in system
      mat4.translate(this.modelview, this.modelview,
          current.transformations.translate);

      // Define rotations about the object's own x and y-axes
      for (key in current.transformations.rotate) {

        // Definitions
        value = current.transformations.rotate[key];
        matrixFunctionName = `rotate${key.toUpperCase()}`;

        // Either mat4.rotateX or mat4.rotateY
        mat4[matrixFunctionName](this.modelview, this.modelview,
            (this.frameNumber * value) / 180 * Math.PI);
      }

      // Object sizing
      mat4.scale(this.modelview, this.modelview,
          current.transformations.scale);

      // Optional custom shininess property
      if (current.materialUniforms.specularColor != null) {
        this.gl.uniform3f(this.u_material.specularColor,
            ...current.materialUniforms.specularColor);
      }

      // Associated exponent value
      if (current.materialUniforms.specularExponent != null) {
        this.gl.uniform1f(this.u_material.specularExponent,
            current.materialUniforms.specularExponent);
      }

      // Render the image shape
      this.handleShapeTemplateRendering(current);

      // Reset specularColor to default for next item
      if (current.materialUniforms.specularColor != null) {
        this.gl.uniform3f(this.u_material.specularColor,
            ...this.DefaultUniforms.MATERIAL.specularColor);
      }

      // Reset specularExponent to default for next item
      if (current.materialUniforms.specularExponent != null) {
        this.gl.uniform1f(this.u_material.specularExponent,
            this.DefaultUniforms.MATERIAL.specularExponent);
      }

      this.popMatrix();
    }
  };

  /**
   * @description This function is responsible for assembling each of the
   * interface checkbox elements used to toggle the animation of various scene
   * components visible in the <code>canvas</code>. Each light source and scene
   * object has its own checkbox (and own label) in the sidebar, styled like a
   * <code>JToggleButton</code> depending on its clicked/changed state. Each
   * element has its own unique id consisting of its name with an appended
   * randomly generated integer to permit the addition of multiple instances of
   * a single shape type to the interface without the risk of multiple ids
   * existing in the sidebar.
   *
   * @param {object} paramObject
   * @param {string} paramListener Representation of handler signature
   * @returns {void}
   */
  inaccessible.assembleCheckBoxElement = function (paramObject, paramListener) {

    // Declarations
    let that, checkBoxListElement, checkBoxConfig, labelConfig, elementId,
      tempName, property, aliasIds;

    // Preserve scope context
    that = this;

    // Ugly way of handling fact that lights need special button text property
    property = (paramObject.lightText != null) ? 'lightText' : 'shapeType';

    // String will be used to create elementId and button text
    tempName = paramObject[property];

    // Template literal for element id
    elementId = `toggle${tempName}`;

    // Add id to object as property for use in scene reset
    paramObject.elementId = elementId;

    // Once lowerCamelCase id is built, split at capital letters for button text
    tempName = tempName.split(/(?=[A-Z])/).join(' ');

    // Styleguide permits aliasing enums, see styleguide #2 linked above
    aliasIds = this.Identifiers;

    // Checkbox properties
    checkBoxConfig = {
      type: 'checkbox',
      id: elementId,
      class: aliasIds.CHECKBOX_CLASS,
      name: elementId,
      checked: paramObject.isAnimated,
    };

    // Label properties
    labelConfig = {
      for: elementId,
      id: `${elementId}-label`,
      class: `${aliasIds.LABEL_CLASS} ${aliasIds.SIDEBAR_ELEMENT_CLASS}`,
    };

    // Creates <input> and <label> elements inside a <div> container
    checkBoxListElement = this.assembleElement(['div', {},
        ['input', checkBoxConfig, ''],
        ['label', labelConfig, `${this.Text.LABEL} ${tempName}`]]);

    // Add <div> container to <form> container/holder/wrapper/thingie
    this.append(aliasIds.FORM_ID, checkBoxListElement);

    // Add toggle listener, passing object reference as argument
    document.getElementById(elementId).addEventListener('change', function () {
      that[paramListener](paramObject);
    }, false);
  };

  /**
   * @description This function, like
   * <code>inaccessible.assembleCheckBoxElement</code> above it, is used to
   * build button elements to be used to trigger certain events in the interface
   * on click. However, it is simplified in some respects; as it unlikely that
   * multiple instances of the same button will be added to the interface, no
   * unique id containing a randomly generated number has been created. Instead,
   * only the button name with a prepended "button" is used to create the id.
   *
   * @param {object} paramObject
   * @returns {void}
   */
  inaccessible.assembleButtonElement = function (paramObject) {

    // Declarations
    let that, elementId, tempName, buttonConfig, buttonElement, aliasIds;

    // Definitions
    that = this;
    tempName = paramObject.buttonType;
    elementId = `button${tempName}`;

    // Styleguide permits aliasing enums, see styleguide #2 linked above
    aliasIds = this.Identifiers;

    // Button properties
    buttonConfig = {
      id: elementId,
      class: `${aliasIds.BUTTON_CLASS} ${aliasIds.SIDEBAR_ELEMENT_CLASS}`,
    };

    // <button> inside <div> wrapper
    buttonElement = this.assembleElement(['div', {},
        ['button', buttonConfig, tempName]]);

    // Add to button module
    this.append(aliasIds.BUTTON_HOLDER_ID, buttonElement);

    document.getElementById(elementId).addEventListener('click', function () {
      that[paramObject.functionName](...paramObject.functionArguments);
    }, false);
  };

  /**
   * @description As its name implies, this function is used to construct an
   * individual instance of an element or object; in this case, it builds a
   * single HTML element that will be returned from the function and appended to
   * the DOM dynamically. It accepts an array of strings denoting the type of
   * element to create and also handles potentially nested element arrays for
   * elements that are to exist inside the outer element tags as inner HTML.
   * <br />
   * <br />
   * This method was borrowed and slightly modified from a StackOverflow thread
   * response found <a href="https://stackoverflow.com/a/2947012">here</a>. Link
   * is provided in jsdoc style below but doesn't work as expected in NetBeans
   * despite being of the proper form.
   *
   * @see {@link https://stackoverflow.com/a/2947012|SO Thread}
   * @param {!Array<string>} paramArray
   * @returns {HTMLElement} element
   */
  inaccessible.assembleElement = function (paramArray) {

    // Declarations
    let element, name, attributes, counter, content;

    // Make sure input argument is a well-formatted array
    if (!this.isArray(paramArray)) {
      return this.assembleElement.call(this,
          Array.prototype.slice.call(arguments));
    }

    // Definitions
    name = paramArray[0];
    attributes = paramArray[1];
    element = document.createElement(name);
    counter = 1;

    // attributes != null -> attributes === undefined || attributes === null
    if (typeof attributes === 'object' && attributes != null &&
        !this.isArray(attributes)) {

      for (let attribute in attributes) {
        element.setAttribute(attribute, attributes[attribute]);
      }
      counter = 2;
    }

    for (let i = counter; i < paramArray.length; i++) {

      // If there's inner HTML to hand, recursively call self
      if (this.isArray(paramArray[i])) {
        content = this.assembleElement(paramArray[i]);

      // Otherwise, treat any remaining array elements as text content
      } else {
         content = document.createTextNode(paramArray[i]);
      }

      // Add to outer parent element
      element.appendChild(content);
    }

    return element;
  };

  /**
   * @description This function makes significant use of the DOM element builder
   * <code>inaccessible.assembleElement</code>'s recursive functionality to
   * construct many levels of nested elements. This function mainly just fills
   * the otherwise empty <code>body</code> tag with a container wrapper
   * <code>div</code>, a set of sidebar containers for checkboxes and buttons,
   * and a <code>div</code> wrapper for the <code>canvas</code> itself. It is
   * to these DOM nodes that the rest of the elements are assembled dynamically
   * and added to the wrapper.
   *
   * @returns {void}
   */
  inaccessible.assembleUserInterface = function () {

    // Declarations
    let containerConfig ,canvasContainerConfig, canvasConfig,
      sidebarContainerConfig, checkboxModuleConfig, checkboxHeaderConfig,
      buttonModuleConfig, buttonHeaderConfig;

    // Config object for wrapper
    containerConfig = {
      id: this.Identifiers.CONTAINER_ID,
      style: 'opacity: 0',
    };

    // Config object for canvas container
    canvasContainerConfig = {
      id: this.Identifiers.CANVAS_HOLDER_ID,
      class: this.Identifiers.CONTAINER_MODULE,
    };

    // Config object for canvas
    canvasConfig = {
      id: this.Identifiers.CANVAS_ID,
      width: this.Utility.CANVAS_WIDTH,
      height: this.Utility.CANVAS_HEIGHT,
    };

    // Config object for sidebar wrapper
    sidebarContainerConfig = {
      id: this.Identifiers.SIDEBAR_ID,
      class: this.Identifiers.CONTAINER_MODULE,
    };

    // Config object for checkboxes sidebar module
    checkboxModuleConfig = {
      id: this.Identifiers.FORM_ID,
      class: this.Identifiers.SIDEBAR_MODULE_CLASS,
    };

    // Config object for checkboxes module header
    checkboxHeaderConfig = {
      class: this.Identifiers.HEADER_CLASS,
    };

    // Config object for buttons sidebar module
    buttonModuleConfig = {
      id: this.Identifiers.BUTTON_HOLDER_ID,
      class: this.Identifiers.SIDEBAR_MODULE_CLASS,
    };

    // Config object for buttons module header
    buttonHeaderConfig = {
      class: this.Identifiers.HEADER_CLASS,
    };

    // Return assembled interface
    return this.assembleElement(
      ['div', containerConfig,
        ['div', sidebarContainerConfig,
          ['form', checkboxModuleConfig,
            ['div', checkboxHeaderConfig,
              this.Text.CHECKBOXES_HEADER
            ]
          ],
          ['div', buttonModuleConfig,
            ['div', buttonHeaderConfig,
              this.Text.BUTTON_HOLDER_HEADER
            ]
          ]
        ],
        ['div', canvasContainerConfig,
          ['canvas', canvasConfig,
            this.Text.ERROR_TEXT
          ],
        ],
      ]
    );
  };

  // Handler functions

  /**
   * @description Like the function below it, this handler is used to deal with
   * presses of the "Start animation" button, setting the appropriate object-
   * global boolean <code>isSceneAnimated</code> to true and calling the
   * animation handler <code>inaccessible.handleFrame</code>. If the scene is
   * currently animated and the start button pressed again, the program displays
   * a <code>window.alert</code> popup letting the user know.
   *
   * @returns {void}
   */
  inaccessible.handleAnimationStart = function () {
    if (!this.isSceneAnimated) {
      this.isSceneAnimated = true;
      this.handleFrame();
    } else {
      window.alert(this.Text.START_BUTTON_ERROR);
    }
  };

  /**
   * @description This function is like that above it,
   * <code>inaccessible.handleAnimationStart</code>, in that it simply sets the
   * object-global <code>inaccessible.isSceneAnimated</code> and displays a
   * <code>window.alert</code> popup if the button is pressed and the animation
   * is not running.
   *
   * @returns {void}
   */
  inaccessible.handleAnimationStop = function () {
    if (this.isSceneAnimated) {
      this.isSceneAnimated = false;
    } else {
      window.alert(this.Text.STOP_BUTTON_ERROR);
    }
  };

  /**
   * @description Using code from the author's Project 3 Three.js submission and
   * the resource file <code>diskworld-2.html</code>, this handler function is
   * used to reset the scene when the button "Reset scene" is pressed by the
   * user. On such resets, the scene (if animated) is set to unanimated, any
   * hidden objects restored to view, and all user-unchecked checkboxes checked
   * to true again, removing their red coloration. Furthermore, the default
   * scene camera perspective is reset to the default as evidenced in the
   * aforementioned <code>diskworld-2.html</code> file.
   * <br />
   * <br />
   * For reasons the author does not understand, the moving of the default
   * values of the <code>TrackballRotator</code> to the appropriate enum
   * <code>inaccessible.Utility</code> somehow breaks the default scene camera
   * perspective. This makes no sense but has not yet been rectified, requiring
   * the author to grudgingly leave magic numbers floating around in the code
   * outside of the enums for fear of breaking the scene on resets.
   *
   * @returns {void}
   */
  inaccessible.handleReset = function () {

    // Declarations
    let template, model;

    // Redefine rotator defaults
    this.rotator.setView(17, [0, 1, 2]);
    this.frameNumber = 0;
    this.sceneScale = 1;
    this.isSceneAnimated = false;

    // If user has hidden some object types, display them on reset
    for (template in this.templates) {

      // Define template model
      model = this.templates[template];

      // Check all unchecked checkboxes
      document.getElementById(model.elementId).checked = true;

      // Return model to view (unhide)
      model.isAnimated = true;
    }

    this.render();
  };

  /**
   * @description One of two checkbox listener handlers, this function simply
   * sets the negated value of the <code>isAnimated</code> <code>boolean</code>
   * object property as the property itself, like a toggle function of sorts.
   *
   * @param {object} paramObject
   * @returns {void}
   */
  inaccessible.handleSceneElementCheckboxChanges = function (paramObject) {
    paramObject.isAnimated = !paramObject.isAnimated;

    if (!this.isSceneAnimated) {
      this.render();
    }
  };

  /**
   * @description The second of the two checkbox event listener handlers, this
   * function negates the <code>isAnimated</code> <code>boolean</code> property
   * and switches on or off the light accordingly.
   *
   * @param {object} paramObject
   * @returns {void}
   */
  inaccessible.handleLightSourceCheckboxChanges = function (paramObject) {

    // One of the author's favorite unsung heroes, the XOR bitwise toggler
    paramObject.lightsUniforms.enabled ^= 1;

    if (!this.isSceneAnimated) {
      this.render();
    }
  };

  /**
   * @description This handler function is used by
   * <code>inaccessible.assembleLights</code> to set the position of a light
   * source in the scene. The transformed matrix position of the light source is
   * applied to the relevent shader uniform in eye coordinates. This function
   * was taken almost entirely from the Project 4 resources file
   * <code>diskworld-2.html</code>, specifically the method called
   * <code>setLightPosition</code>.
   *
   * @see diskworld-2.setLightPosition
   * @param {!Array<number>} paramUniformLocation
   * @param {!Array<number>} paramLightLocation
   * @returns {void}
   */
  inaccessible.handleLightPositioning = function (paramUniformLocation,
      paramLightLocation) {

    // Declaration
    let transformedPosition;

    // Definition
    transformedPosition = new Float32Array(4);

    // Set light placement in eye coordinates
    vec4.transformMat4(transformedPosition, paramLightLocation, this.modelview);
    this.gl.uniform4fv(paramUniformLocation, transformedPosition);
  };

  /**
   * @description As the name implies, this handler function is used to bind a
   * <code>WebGLBuffer</code> instance attached to a shape template model array
   * to the appropriate attribute shader location. This functionality is used in
   * the body of the main rendering function
   * <code>inaccessible.handleShapeTemplateRendering</code> to bind vertices,
   * indicies, normals, and possibly texture buffers to locations for use in
   * rendering, coloring, and texturing the item in question.
   * <br />
   * <br />
   * As with many of the functions included in this program, this particular
   * function was built from copy/pasted functionality included multiple times
   * in <code>diskworld-2.html</code>'s <code>createModel.render</code> inner
   * function and was simply moved to a helper handler to reduce copy/pasta in
   * the author's submission.
   *
   * @see diskworld-2.createModel
   * @param {GLint} paramLocation
   * @param {WebGLBuffer} paramBuffer
   * @param {integer} paramSize
   * @returns {void}
   */
  inaccessible.handleBufferBinding = function (paramLocation, paramBuffer,
      paramSize) {

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, paramBuffer);
    this.gl.vertexAttribPointer(paramLocation, paramSize, this.gl.FLOAT, false,
        0, 0);
    this.gl.enableVertexAttribArray(paramLocation);
  };

  /**
   * @description This function is in large part the main image rendering
   * handler of the program, as it handles the binding of the appropriate shape
   * template buffers, coloring of various lighting and painting aspects, and
   * the actual drawing of the object according to a certain type of primitive
   * (either <code>gl.LINE_LOOP</code> for nifty wire frame objects or
   * <code>gl.TRIANGLES</code> for solid shapes).
   * <br />
   * <br />
   * As with the above helper function, this method was mostly pulled from the
   * inner function of <code>diskworld-2.html</code>'s <code>createModel</code>
   * function, namely <code>model.render</code>. The author saw fit to extract
   * that rendering method to the object-global namespace to enhance readability
   * and remove unnecessarily nested functions.
   *
   * @see diskworld-2.createModel
   * @param {object} paramConfig
   * @returns {void}
   */
  inaccessible.handleShapeTemplateRendering = function (paramConfig) {

    // Declaration
    let model, primitive;

    // Definition
    model = this.templates[paramConfig.shapeType];

    // Handle potential wire frame objects
    if (paramConfig.isWireFrame) {
      primitive = this.gl.LINE_LOOP;
    } else {
      primitive = this.gl.TRIANGLES;
    }

    // Bind the appropriate buffers to the attribute locations
    this.handleBufferBinding(this.a_coords_loc, model.coordsBuffer, 3);
    this.handleBufferBinding(this.a_normal_loc, model.normalBuffer, 3);

    // Not all models will be texture-friendly
    if (model.texCoordsBuffer != null) {
      this.handleBufferBinding(this.a_texCoords_loc, model.texCoordsBuffer, 2);
    } else {
      this.gl.disableVertexAttribArray(this.a_texCoords_loc);
    }

    // Assuming the object has a texture property denoting an image path
    if (paramConfig.texture != null) {

      // Tell shader program that we intend to use texture here
      this.gl.uniform1i(this.u_useTexture, 1);

      // Apply temporary color texture while loading image texture from file
      this.handleTextureLoading(paramConfig.texture, this.Colors.WHITE);
    } else {

      // In case it's on, turn off the texture boolean since there is no texture
      this.gl.uniform1i(this.u_useTexture, 0);

      // If no texture used, we pass the flat object color as the diffuseColor
      this.gl.uniform4fv(this.u_material.diffuseColor, paramConfig.shapeColor);
    }

    // Default render properties
    this.gl.uniformMatrix4fv(this.u_modelview, false, this.modelview);
    mat3.normalFromMat4(this.normalMatrix, this.modelview);
    this.gl.uniformMatrix3fv(this.u_normalMatrix, false, this.normalMatrix);

    // Make use of indicies buffer
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);

    // Draw the element
    this.gl.drawElements(primitive, model.count, this.gl.UNSIGNED_SHORT, 0);

    // Turn off attribute location buffer access
    this.gl.disableVertexAttribArray(this.a_coords_loc);
    this.gl.disableVertexAttribArray(this.a_normal_loc);
    this.gl.disableVertexAttribArray(this.a_texCoords_loc);
  };

  /**
   * @description This handler function is used to apply a <code>String</code>
   * representation of a shader attribute location to an object-global for use
   * in attaching a <code>WebGLBuffer</code>, among other uses. Once the
   * attribute location has been acquired, the subsequent
   * <code>enableVertexAttribArray</code> call is made to turn on the generic
   * vertex attribute array. The author is unsure if this final part is
   * necessary since there are other points in the program in which the
   * attribute array is activated again but left it in just in case.
   *
   * @param {string} paramAttribute
   * @returns {void}
   */
  inaccessible.handleAttributeLocationAcquisition = function (paramAttribute) {

    // Declaration
    let globalAttribute;

    // Definition
    globalAttribute = `${paramAttribute}_loc`;

    // Acquire location
    this[globalAttribute] =
        this.gl.getAttribLocation(this.shaderProgram, paramAttribute);

    // Turn on the generic vertex attribute array
    this.gl.enableVertexAttribArray(this[globalAttribute]);
  };

  /**
   * @description This function is used to acquire a certain shader uniform
   * location and use its name and location in the application of an object-
   * global property of use to the rendering and display of various scene
   * elements. Depending on whether or not the included uniform is a part of a
   * fragment shader <code>struct</code>, it may have a full stop/period
   * requiring some janky prestidigitations to handle. If the function is called
   * with the optional <code>paramCounter</code> argument parameter included, it
   * is part of the <code>LightProperties struct</code> and is related to a
   * specific in-scene light. The author is willing to admit that this method
   * was built during one of those "seemed like a good idea at the time" moments
   * and would have likely gone about building this differently the second time
   * in the hopes of making it more readable. As it stands, he can barely
   * figure out what is going on in here.
   * <br />
   * <br />
   * As per the Google styleguide, the use of default parameters in function
   * declarations is permitted in most cases and particularly encouraged for
   * optional parameters that may not actually be defined in certain invocation
   * cases in which the function might be called.
   *
   * @param {type} paramUniform
   * @param {!integer=} paramCounter
   * @returns {void}
   */
  inaccessible.handleUniformLocationAcquisition = function (paramUniform,
      paramCounter = null) {

    // Declarations
    let splitString, globalUniform, globalProperty;

    if (paramUniform.indexOf('.') !== -1) {

      // Definitions
      splitString = paramUniform.split('.'); // 'lights.enabled'
      globalUniform = splitString[0];        // 'lights'
      globalProperty = splitString[1];       // 'enabled'

      // Lights
      if (paramCounter != null) {
        this[`u_${globalUniform}`][paramCounter] =
            this[`u_${globalUniform}`][paramCounter] || {};

        this[`u_${globalUniform}`][paramCounter][globalProperty] =
            this.gl.getUniformLocation(this.shaderProgram,
              `${globalUniform}[${paramCounter}].${globalProperty}`);
      } else {
        this[`u_${globalUniform}`] = this[`u_${globalUniform}`] || {};
        this[`u_${globalUniform}`][globalProperty] =
            this.gl.getUniformLocation(this.shaderProgram, paramUniform);
      }
    } else {
      this[`u_${paramUniform}`] =
        this.gl.getUniformLocation(this.shaderProgram, paramUniform);
    }
  };

  /**
   * @description This function is used both by the primary lighting config
   * function <code>inaccessible.assembleLights</code> and by the default
   * uniform setter <code>inaccessible.handleSettingOfDefaultUniforms</code> to
   * handle the setting of both <code>MaterialProperties</code> and
   * <code>LightProperties</code> <code>struct</code> properties dynamically as
   * needed in the rendering process. Originally, this single method was two,
   * one for each of the <code>struct</code>s in question, though the author
   * eventually meshed them together with the intention of cleaning up the mix's
   * contents. However, he eventually forgot about this until documenting the
   * program and now has no time to fix it.
   * <br />
   * <br />
   * As per the Google styleguide, the use of default parameters in function
   * declarations is permitted in most cases and particularly encouraged for
   * optional parameters that may not actually be defined in certain invocation
   * cases in which the function might be called.
   *
   * @param {object} paramDataObject
   * @param {string} paramProperty
   * @param {!integer=} paramCounter
   * @returns {void}
   */
  inaccessible.handleDefinitionOfUniform = function (paramDataObject,
      paramProperty, paramCounter = null) {

    // Declarations
    let value;

    value = paramDataObject[paramProperty];

    if (paramCounter != null) {
      if (this.isArray(value)) {
        if (paramProperty === 'position') {
          this.gl.uniform4f(this.u_lights[paramCounter].position, ...value);
        } else {
          value = value.slice(0, 3); // Drop last Color element
          this.gl.uniform3f(this.u_lights[paramCounter][paramProperty],
              ...value);
        }
      } else {
        if (paramProperty === 'enabled') {
          this.gl.uniform1i(this.u_lights[paramCounter].enabled, value);
        } else {
          this.gl.uniform1f(this.u_lights[paramCounter][paramProperty], value);
        }
      }
    } else {
      if (this.isArray(value)) {
        if (paramProperty === 'diffuseColor') {
          this.gl.uniform4fv(this.u_material.diffuseColor, value);
        } else {
          value = value.slice(0, value.length - 1);
          this.gl.uniform3f(this.u_material[paramProperty], ...value);
        }
      } else {
        this.gl.uniform1f(this.u_material[paramProperty], value);
      }
    }
  };

  /**
   * @description This function is used to set all the various uniform values
   * with their appropriate default values as denoted in the object-global enum
   * <code>inaccessible.DefaultUniforms</code>. It makes use of the helper
   * functions <code>inaccessible.handleDefinitionOfUniform</code> and
   * <code>inaccessible.handleUniformLocationAcquisition</code> to define
   * object-global properties and add the values to the uniforms dynamically as
   * required.
   * <br />
   * <br />
   * As per the Google styleguide, the use of default parameters in function
   * declarations is permitted in most cases and particularly encouraged for
   * optional parameters that may not actually be defined in certain invocation
   * cases in which the function might be called.
   *
   * @param {string} paramType
   * @param {!integer=} paramCounter
   * @returns {void}
   */
  inaccessible.handleSettingOfDefaultUniforms = function (paramType,
      paramCounter = null) {

    // Declarations
    let property, defaultName, uniform;

    // Definition -> MATERIAL or LIGHTS
    defaultName = paramType.toUpperCase();

    for (property in this.DefaultUniforms[defaultName]) {
      uniform = `${paramType.toLowerCase()}.${property}`;

      this.handleUniformLocationAcquisition(uniform, paramCounter);
      this.handleDefinitionOfUniform(this.DefaultUniforms[defaultName],
          property, paramCounter);
    }
  };

  /**
   * @description This function is supposed to be the means by which a series of
   * <code>.jpg</code> image textures are applied to various objects in the
   * scene. It is supposed to work by applying a temporary color texture to a
   * scene object while the image itself is loaded. Once the image is loaded,
   * the included callback function replaces the color texture with the scene
   * object image texture itself as desired. The use of the color texture was
   * suggested by a number of StackOverflow threads and several Mozilla
   * tutorials as a way to enter an object into service in the scene without
   * render-blocking the rest of the scene while waiting for the texture to load
   * entirely.
   * <br />
   * <br />
   * However, for reasons the author cannot fully understand, the color texture
   * is properly applied by the shaders as a legitimate texture, but the image
   * itself, though loaded, is never applied to the object. The author has tried
   * all manner of alternate approaches, including hardcoding the images into
   * the DOM as child nodes of the <code>body</code> tag, deferring loading of
   * this JS file until the DOM has been completed. Once loaded, this function
   * was reconfigured to grab these loaded images and their <code>src</code>
   * attributes by their ids. However, not even this approach worked. The author
   * also tried render-blocking the program until the images had been obtained,
   * forcing the textures to be fully loaded prior to even the first render of
   * the scene. However, this approach too did not work. The author is unsure of
   * whether or not the issue is with his shaders or with this method, as the
   * console does not display any errors as to a misapplied or misconfigured
   * texture. For now, since the color textures <em>technically</em> are
   * textures as per the rubric requirement to use textures, the author must be
   * content with not knowning why the images are not displayed.
   *
   * @param {string} paramAddress
   * @param {!Array<number>} paramColorTexture
   * @returns {void}
   */
  inaccessible.handleTextureLoading = function (paramAddress,
      paramColorTexture) {

    // Declarations
    let that, image, texture, colorTexture;

    // Definitions
    that = this;
    image = new Image();
    colorTexture = this.convertColorToUint8Array(paramColorTexture);
    texture = this.gl.createTexture();

    // We bind the texture
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    // Add temporary color texture to begin object use; replace once image ready
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0,
        this.gl.RGBA, this.gl.UNSIGNED_BYTE, colorTexture);

    image.onload = function() {

      // Add active texture at unit 0
      that.gl.activeTexture(that.gl.TEXTURE0);

      // Bind the texture to texture unit 0
      that.gl.bindTexture(that.gl.TEXTURE_2D, texture);

      // Tell the shader we bound the texture to texture unit 0
      that.gl.uniform1i(that.u_texture, 0);

      // Replace default texture color with loaded image
      that.gl.texImage2D(that.gl.TEXTURE_2D, 0, that.gl.RGBA, that.gl.RGBA,
          that.gl.UNSIGNED_BYTE, this);

      // WebGL1 has different requirements for power-of-two images
      if (that.isPowerOf2(image.width) && that.isPowerOf2(image.height)) {
        that.gl.generateMipmap(that.gl.TEXTURE_2D);
      } else {
        that.gl.texParameteri(that.gl.TEXTURE_2D, that.gl.TEXTURE_WRAP_S,
            that.gl.CLAMP_TO_EDGE);
        that.gl.texParameteri(that.gl.TEXTURE_2D, that.gl.TEXTURE_WRAP_T,
            that.gl.CLAMP_TO_EDGE);
        that.gl.texParameteri(that.gl.TEXTURE_2D, that.gl.TEXTURE_MIN_FILTER,
            that.gl.LINEAR); // Should be NEAREST?
      }
    };
    image.src = paramAddress;
  };

  /**
   * @description This function is responsible for handling the frame-by-frame
   * rendering of the scene by calling the main <code>inaccessible.render</code>
   * function via <code>window.requestAnimationFrame</code>. It is also used to
   * increment the <code>frameNumber</code> counter used to rotate the scene
   * objects around the "sun" as well as adjust the orbital rotation angle value
   * used by the objects to determine the rate at which they spin about their
   * individual axes.
   * <br />
   * <br />
   * As with many functions included herein, this function was based on one in
   * the Project 4 resource file <code>diskworld-2.html</code>, namely
   * <code>frame</code>.
   *
   * @see diskworld-2.frame
   * @returns {void}
   */
  inaccessible.handleFrame = function () {
    if (this.isSceneAnimated) {
      this.frameNumber += 1;
      this.render();
      window.requestAnimationFrame(this.handleFrame.bind(this));
    }
  };

  // Main functions

  /**
   * @description This function is used as the central scene rendering function,
   * called by many functions as needed whenever a refresh of the scene context
   * is required to display the changes made by the function in question. It
   * first paints the background black and removes all prior scene objects,
   * setting the perspective according to the viewpoint values included in the
   * enum <code>inaccessible.Utility</code>. If the user has used the middle
   * mouse wheel to zoom in on the scene, the function scales accordingly after
   * gathering modelview matrix context from the <code>TrackballRotator</code>
   * and then assembles both the lights and the scene objects via their own
   * assembly functions.
   * <br />
   * <br />
   * As with many functions included herein, this function was based on one in
   * the Project 4 resource file <code>diskworld-2.html</code>, namely
   * <code>draw</code>. Though a few modifications have been made to make the
   * scene have a 4:3 aspect ratio and draw magic numbers from the appropriate
   * enum as needed, the basic skeleton of the function comes from its
   * progenitor.
   *
   * @see diskworld-2.draw
   * @returns {void}
   */
  inaccessible.render = function () {

    // Background color
    this.gl.clearColor(...this.Colors.BLACK);

    // Clear scene context
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Set aspect ratio (4/3)
    mat4.perspective(this.projection, this.Utility.CAMERA_FOV,
        this.Utility.ASPECT_RATIO, this.Utility.FRUSTRUM_NEAR_PLANE,
        this.Utility.FRUSTRUM_FAR_PLANE);

    this.gl.uniformMatrix4fv(this.u_projection, false, this.projection);
    this.modelview = this.rotator.getViewMatrix();

    if (DEBUG) {

      // Default zoom-in on sun + test object
      mat4.scale(this.modelview, this.modelview,
        [this.Utility.DEBUG_ZOOM_DEGREE, this.Utility.DEBUG_ZOOM_DEGREE,
           this.Utility.DEBUG_ZOOM_DEGREE]);
    } else {

      // Apply middle-mouse button (or debug) scaling prior to scene build
      mat4.scale(this.modelview, this.modelview,
          [this.sceneScale, this.sceneScale, this.sceneScale]);
    }

    // Build lights and scene objects
    this.assembleLights();
    this.assembleScene();
  };

  /**
   * @description As per the layout of a great many WebGL programs, a special
   * function used to initialize the GL context is employed by the program to
   * acquire the various attribute and uniform shader variable locations in the
   * fragment and vertex shaders, setting their contents to a default set of
   * values specified in the enum <code>inaccessible.DefaultUniforms</code>. In
   * the interests of optimization and readability, the author made use of a
   * number of helper handler functions to both define and acquire the locations
   * of these shader variables as needed, allowing the user to see at a glance
   * what is being acquired and what is being defined herein from the start of
   * the program rendering.
   * <br />
   * <br />
   * Beneath all the optimized helper method invocations is the skeleton
   * framework set forth in the Project 4 resource file relied upon as a
   * template for much of the functionality included herein, namely
   * <code>diskworld-2.html</code>. Its method, also called <code>initGL</code>,
   * was the template upon which this method's contents were based.
   *
   * @see diskworld-2.initGL
   * @returns {void}
   */
  inaccessible.initGL = function () {

    // Declarations
    let requestedAttributes, requestedUniforms;

    // Definitions
    requestedAttributes = [
      'a_coords',
      'a_normal',
      'a_texCoords',
    ];
    requestedUniforms = [
      'modelview',
      'projection',
      'normalMatrix',
      'texture',
      'useTexture',
    ];

    // Make use if init-defined shader program
    this.gl.useProgram(this.shaderProgram);
    this.gl.enable(this.gl.DEPTH_TEST);

    // Get attribute locations
    for (let i = 0; i < requestedAttributes.length; i++) {
      this.handleAttributeLocationAcquisition(requestedAttributes[i]);
    }

    // Get uniform locations for mv, proj, normals, and textures
    for (let i = 0; i < requestedUniforms.length; i++) {
      this.handleUniformLocationAcquisition(requestedUniforms[i]);
    }

    // Get material uniform locations and apply default configuration
    this.handleSettingOfDefaultUniforms('Material');

    // Get uniforms locations and set defaults for each of the defined lights
    for (let i = 0; i < this.lightSourceData.length; i++) {
      this.handleSettingOfDefaultUniforms('Lights', i);
    }
  };

  /**
   * @description The main function of the program module, this method is called
   * from <code>accessible.init</code> upon completion of the DOM loading
   * process. It is responsible for assembling the user interface dynamically
   * from a set of builder methods by first assembling a layout skeleton and
   * adding checkboxes and buttons to the sidebar as the various shape templates
   * are assembled and defined. Once all necessary UI elements have been
   * completed and the shader program assembled, the function calls
   * <code>inaccessible.fadeIn</code> and renders the scene via an invocation of
   * <code>inaccessible.render</code>.
   * <br />
   * <br />
   * The function is also responsible for a number of ancillary functions as
   * well, from the setting of important object-global properties like a little
   * pseudo-constructor to the handling of the scene manipulation operations. In
   * addition to the included <code>TrackballRotator</code> used to move about
   * the scene while defining the viewmodel with each transformation, the
   * function also included functionality supporting a zoom-in ability used via
   * the middle mouse scroll wheel. Using this wheel, the user can zoom in on
   * certain objects in the scene and view them in detail.
   *
   * @returns {void}
   */
  inaccessible.init = function () {

    // Declarations
    let that, userInterface, shaderSet;

    // Preserve scope context
    that = this;

    // Assemble the user interface dynamically
    userInterface = this.assembleUserInterface();

    // Populate DOM body with assembled interface
    document.body.appendChild(userInterface);

    // Build sidebar buttons for scene manipulation
    this.sidebarButtonData.forEach(function (button) {
      that.assembleButtonElement(button);
    });

    // Acquire WebGL context and define as object-global
    this.glcanvas = document.getElementById('glcanvas');
    this.gl = this.glcanvas.getContext('webgl') ||
        this.glcanvas.getContext('experimental-webgl');

    // Important global properties
    this.templates = {};
    this.isSceneAnimated = false;
    this.projection = mat4.create();
    this.normalMatrix = mat3.create();
    this.matrixStack = [];
    this.u_lights = [];
    this.sceneScale = 1;
    this.frameNumber = 0;

    // Build buffers and define templates for each of the polyhedra models
    this.assembleShapeTemplates();

    // Add a toggle checkbox affecting all instances of polyhedron type
    for (let model in this.templates) {
      this.assembleCheckBoxElement(this.templates[model],
          'handleSceneElementCheckboxChanges');
    }

    // Create checkbox for each light source
    for (let i = 0; i < this.lightSourceData.length; i++) {
      this.assembleCheckBoxElement(this.lightSourceData[i],
          'handleLightSourceCheckboxChanges');
    }

    // Define TrackballRotator and callback handler
    this.rotator = new TrackballRotator(this.glcanvas, function () {
      if (!that.isSceneAnimated) {
        that.render();
      }
    }, 17, [0, 1, 2]);

    // Zoom in on scene with middle mouse scroll wheel (ES6 only)
    this.glcanvas.addEventListener('wheel', paramEvent => {
      this.sceneScale += Math.sign(paramEvent.wheelDelta) / 10;

      if (!this.isSceneAnimated) {
        this.render();
      }
    }, false);

    // Array of objects denoting types of shader used
    shaderSet = [
      {
        type: this.gl.VERTEX_SHADER,
        contents: this.Shaders.VERTEX,
      },
      {
        type: this.gl.FRAGMENT_SHADER,
        contents: this.Shaders.FRAGMENT,
      }
    ];

    // Build the vertex shader and fragment shader program from array
    this.shaderProgram = this.assembleShaderProgram(shaderSet);

    // Acquire shader locations and set defaults
    this.initGL();

    // Fade in on the canvas
    this.fadeIn(this.Identifiers.CONTAINER_ID);

    // Render the scene
    this.render();
  };

  // Accessible functions

  /**
   * @description External getter for immutable <code>Utility</code>
   *
   * @returns {enum} inaccessible.Utility
   */
  accessible.getUtility = function () {
    return inaccessible.Utility;
  };

  /**
   * @description External getter for immutable <code>Identifiers</code>
   *
   * @returns {enum} inaccessible.Identifiers
   */
  accessible.getIdentifiers = function () {
    return inaccessible.Identifiers;
  };

  /**
   * @description External getter for immutable <code>Text</code>
   *
   * @returns {enum} inaccessible.Text
   */
  accessible.getText = function () {
    return inaccessible.Text;
  };

  /**
   * @description External getter for immutable <code>Colors</code>
   *
   * @returns {enum} inaccessible.Colors
   */
  accessible.getColors = function () {
    return inaccessible.Colors;
  };

  /**
   * @description External getter for immutable <code>DefaultUniforms</code>
   *
   * @returns {enum} inaccessible.DefaultUniforms
   */
  accessible.getDefaultUniforms = function () {
    return inaccessible.DefaultUniforms;
  }

  /**
   * @description External getter for immutable <code>Textures</code>
   *
   * @returns {enum} inaccessible.Textures
   */
  accessible.getTextures = function () {
    return inaccessible.Textures;
  }

  /**
   * @description External getter for immutable <code>Shader</code>
   *
   * @returns {enum} inaccessible.Shaders
   */
  accessible.getShaders = function () {
    return inaccessible.Shaders;
  };

  /**
   * @description The main function of the <code>accessible</code> access scope
   * object namespace, <code>init</code> is called on the completion of the
   * loading of the HTML <code>body</code> element. This method is the only
   * non-getter accessible function of the <code>ProjectFourModule</code>
   * module, and simply calls <code>inaccessible.int</code> to get the program
   * started.
   *
   * @returns {void}
   */
  accessible.init = function () {
    inaccessible.init();
  };

  // Return external-facing namespace object
  return accessible;

})(ProjectFourDataModule);