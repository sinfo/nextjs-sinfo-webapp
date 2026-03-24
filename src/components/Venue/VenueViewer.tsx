"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  venueConfig,
  type Stand,
  type Company,
  type Speaker,
  type DayConfig,
} from "@/constants/venueData";
import type * as THREE_TYPES from "three";

/* ━━━ Types ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface PopupInfo {
  stand: Stand;
  company?: Company;
}

/* ━━━ Component ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function VenueViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE_TYPES.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE_TYPES.Scene | null>(null);
  const perspCameraRef = useRef<THREE_TYPES.PerspectiveCamera | null>(null);
  const orthoCameraRef = useRef<THREE_TYPES.OrthographicCamera | null>(null);
  const controlsRef = useRef<any>(null);
  const raycasterRef = useRef<THREE_TYPES.Raycaster | null>(null);
  const mouseRef = useRef<THREE_TYPES.Vector2 | null>(null);
  const standMeshesRef = useRef<Map<string, THREE_TYPES.Object3D>>(new Map());
  const labelSpritesRef = useRef<Map<string, THREE_TYPES.Sprite>>(new Map());
  const standSignsRef = useRef<Map<string, THREE_TYPES.Mesh>>(new Map());
  const standLogoPanelsRef = useRef<Map<string, THREE_TYPES.Mesh>>(new Map());
  const speakerSpritesRef = useRef<Map<string, THREE_TYPES.Sprite[]>>(
    new Map(),
  );
  const debugRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const threeRef = useRef<typeof THREE_TYPES | null>(null);
  const is3DRef = useRef(false);

  const [is3D, setIs3D] = useState(false);
  const [popup, setPopup] = useState<PopupInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(0);
  const hoveredStandIdRef = useRef<string | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  const currentDay: DayConfig | undefined = venueConfig.days[selectedDay];

  // ── Resolve stand → company for current day ──
  const getStandCompany = useCallback(
    (standId: string): Company | undefined => {
      return currentDay?.standAssignments.find((a) => a.standId === standId)
        ?.company;
    },
    [currentDay],
  );

  // ── Get speakers for a zone on the current day ──
  const getSpeakersForZone = useCallback(
    (zoneId: string): Speaker[] => {
      return (
        currentDay?.zoneSchedules.find((zs) => zs.zoneId === zoneId)
          ?.speakers ?? []
      );
    },
    [currentDay],
  );

  // ── Create a text canvas ──
  const createTextCanvas = useCallback(
    (
      text: string,
      opts: {
        fontSize?: number;
        color?: string;
        bgColor?: string;
        width?: number;
        height?: number;
        bold?: boolean;
        borderRadius?: number;
      } = {},
    ) => {
      const {
        fontSize = 48,
        color = "#ffffff",
        bgColor = "transparent",
        width = 512,
        height = 128,
        bold = true,
        borderRadius = 0,
      } = opts;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;

      if (bgColor !== "transparent") {
        ctx.fillStyle = bgColor;
        if (borderRadius > 0) {
          ctx.beginPath();
          ctx.roundRect(0, 0, width, height, borderRadius);
          ctx.fill();
        } else {
          ctx.fillRect(0, 0, width, height);
        }
      }

      ctx.fillStyle = color;
      ctx.font = `${bold ? "bold " : ""}${fontSize}px "Montserrat", Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const words = text.split(" ");
      const lines: string[] = [];
      let currentLine = words[0];
      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + " " + words[i];
        if (ctx.measureText(testLine).width < width - 20) {
          currentLine = testLine;
        } else {
          lines.push(currentLine);
          currentLine = words[i];
        }
      }
      lines.push(currentLine);

      const lineHeight = fontSize * 1.2;
      const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((line, i) => {
        ctx.fillText(line, width / 2, startY + i * lineHeight);
      });

      return canvas;
    },
    [],
  );

  // ── Initialize Three.js scene ──
  useEffect(() => {
    let disposed = false;

    async function init() {
      const THREE = await import("three");
      const { OrbitControls } =
        await import("three/examples/jsm/controls/OrbitControls.js");

      if (disposed || !containerRef.current) return;
      threeRef.current = THREE;

      const container = containerRef.current;
      const w = container.clientWidth;
      const h = container.clientHeight;

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setClearColor(0xf0f2f5);
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Scene
      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0xf0f2f5, 60, 120);
      sceneRef.current = scene;

      // Cameras
      const aspect = w / h;
      const perspCamera = new THREE.PerspectiveCamera(50, aspect, 0.1, 250);
      perspCamera.position.set(-19.3, 35, -11.97);
      perspCamera.zoom = 1.2;
      perspCameraRef.current = perspCamera;

      const frustumSize = 30;
      const orthoCamera = new THREE.OrthographicCamera(
        (-frustumSize * aspect) / 2,
        (frustumSize * aspect) / 2,
        frustumSize / 2,
        -frustumSize / 2,
        0.1,
        200,
      );
      orthoCamera.position.set(-18.3, 50, -11.97);
      orthoCamera.lookAt(-18.3, 0, -11.97);
      orthoCamera.zoom = 1.2;
      orthoCamera.updateProjectionMatrix();
      orthoCameraRef.current = orthoCamera;

      // Controls
      const controls = new OrbitControls(perspCamera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.maxPolarAngle = Math.PI / 2.5;
      controls.minDistance = 5;
      controls.maxDistance = 50;
      controls.target.set(-3.1, 20, -2.6);
      controls.enabled = false;
      controlsRef.current = controls;

      // Raycaster
      raycasterRef.current = new THREE.Raycaster();
      mouseRef.current = new THREE.Vector2();

      // Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.4));
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
      dirLight.position.set(20, 35, 15);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.set(2048, 2048);
      dirLight.shadow.camera.left = -40;
      dirLight.shadow.camera.right = 40;
      dirLight.shadow.camera.top = 40;
      dirLight.shadow.camera.bottom = -40;
      scene.add(dirLight);
      scene
        .add(new THREE.DirectionalLight(0xb0c4de, 0.3))
        .position.set(-15, 20, -10);

      // Ground
      const groundGeo = new THREE.PlaneGeometry(
        venueConfig.floor.width,
        venueConfig.floor.depth,
      );
      const ground = new THREE.Mesh(
        groundGeo,
        new THREE.MeshStandardMaterial({ color: 0xffffff, opacity: 0.5 }),
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.set(-3.1, 0, -2.6);
      ground.receiveShadow = true;
      scene.add(ground);

      // Entrances
      venueConfig.entrances.forEach((ent) => {
        const entGeo = new THREE.PlaneGeometry(4.5, 1.8);
        const entMat = new THREE.MeshStandardMaterial({
          color: 0x444444,
          roughness: 0.5,
          transparent: true,
          opacity: 0.8,
        });
        const entMesh = new THREE.Mesh(entGeo, entMat);
        entMesh.rotation.x = -Math.PI / 2;
        if (ent.rotation) {
          entMesh.rotation.z = (ent.rotation * Math.PI) / 180;
        }
        entMesh.position.set(ent.position.x, 0.03, ent.position.z);
        scene.add(entMesh);

        // Entrance label sprite
        const labelCanvas = createTextCanvas(ent.label, {
          fontSize: 32,
          color: "#ffffff",
          width: 256,
          height: 64,
        });
        const labelTexture = new THREE.CanvasTexture(labelCanvas);
        const labelMat = new THREE.SpriteMaterial({
          map: labelTexture,
          transparent: true,
        });
        const labelSprite = new THREE.Sprite(labelMat);
        labelSprite.position.set(ent.position.x, 0.2, ent.position.z);
        labelSprite.scale.set(2.0, 0.5, 1);
        scene.add(labelSprite);
      });

      // Zones
      venueConfig.zones.forEach((zone) => {
        const h = zone.height || 0.01;
        const isBox = zone.height && zone.height > 0.05;

        const zoneGeo = isBox
          ? new THREE.BoxGeometry(zone.size.w, h, zone.size.d)
          : new THREE.PlaneGeometry(zone.size.w, zone.size.d);

        const zoneMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(zone.color),
          roughness: 0.8,
          transparent: true,
          opacity: 0.85,
        });
        const zoneMesh = new THREE.Mesh(zoneGeo, zoneMat);

        if (isBox) {
          zoneMesh.position.set(zone.position.x, h / 2, zone.position.z);
        } else {
          zoneMesh.rotation.x = -Math.PI / 2;
          zoneMesh.position.set(zone.position.x, 0.02, zone.position.z);
        }

        zoneMesh.receiveShadow = true;
        scene.add(zoneMesh);

        // Zone label sprite
        const labelCanvas = createTextCanvas(zone.label, {
          fontSize: 40,
          color: "#ffffff",
          width: 512,
          height: 96,
          borderRadius: 16,
        });
        const labelTexture = new THREE.CanvasTexture(labelCanvas);
        labelTexture.minFilter = THREE.LinearFilter;
        labelTexture.colorSpace = THREE.SRGBColorSpace;
        const labelMat = new THREE.SpriteMaterial({
          map: labelTexture,
          transparent: true,
          depthTest: false,
        });
        const labelSprite = new THREE.Sprite(labelMat);
        labelSprite.position.set(zone.position.x, h + 0.5, zone.position.z);
        labelSprite.scale.set(6, 1.5, 1);
        scene.add(labelSprite);
      });

      // Stands
      const osbColor = new THREE.Color(0xc9a96e);
      const frameColor = new THREE.Color(0x2a2a2a);
      const carpetColor = new THREE.Color(0x1c2b70);
      const logoPlaceholderColor = new THREE.Color(0xffffff);

      // ── Reusable Single Booth Builder ──
      const buildSingleBooth = (
        w: number,
        d: number,
        h_: number,
        isSharedBack: boolean = false,
      ) => {
        const group = new THREE.Group();

        // Carpet
        const carpet = new THREE.Mesh(
          new THREE.PlaneGeometry(w + 0.4, d + 0.4),
          new THREE.MeshStandardMaterial({
            color: carpetColor,
            roughness: 0.95,
          }),
        );
        carpet.rotation.x = -Math.PI / 2;
        carpet.position.y = 0.03;
        carpet.receiveShadow = true;
        group.add(carpet);

        // Materials
        const wallMat = new THREE.MeshStandardMaterial({
          color: osbColor,
          roughness: 0.85,
          metalness: 0.05,
        });
        const frameMat = new THREE.MeshStandardMaterial({
          color: frameColor,
          roughness: 0.5,
          metalness: 0.3,
        });

        // Back wall
        const zOff = isSharedBack ? 0.02 : 0;
        const thck = isSharedBack ? 0.04 : 0.08;
        const backWall = new THREE.Mesh(
          new THREE.BoxGeometry(w, h_, thck),
          wallMat,
        );
        backWall.position.set(0, h_ / 2, -d / 2 + zOff);
        backWall.castShadow = true;
        backWall.receiveShadow = true;
        group.add(backWall);

        // Frame strips
        const frameGeo = new THREE.BoxGeometry(0.06, h_, 0.1);
        [-w / 2, 0, w / 2].forEach((xPos) => {
          const frame = new THREE.Mesh(frameGeo, frameMat);
          frame.position.set(xPos, h_ / 2, -d / 2 + zOff);
          frame.castShadow = true;
          group.add(frame);
        });

        // Short side wall (on the right)
        const sideMat = wallMat.clone();
        const sideGeo = new THREE.BoxGeometry(0.08, 1, 1);
        const rightWall = new THREE.Mesh(sideGeo, sideMat);
        rightWall.position.set(w / 2, 0.5, -d / 2 + 0.5);
        rightWall.castShadow = true;
        group.add(rightWall);

        // Full Left side wall
        const leftWall = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 1, 1.5),
          sideMat,
        );
        leftWall.position.set(-w / 2, 0.5, -d / 2 + 0.75);
        leftWall.castShadow = true;
        group.add(leftWall);

        // Front-Left Logo Cube
        const leftCube = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 0.3),
          wallMat.clone(),
        );
        leftCube.position.set(-w / 2 + 0.5, 0.5, d / 2 - 0.15);
        leftCube.castShadow = true;
        group.add(leftCube);

        // Logo panel facing front
        const logoPanel = new THREE.Mesh(
          new THREE.PlaneGeometry(0.96, 0.96),
          new THREE.MeshStandardMaterial({
            color: logoPlaceholderColor,
            roughness: 0.4,
          }),
        );
        logoPanel.position.set(
          -w / 2 + 0.5,
          0.5,
          d / 2 - 0.15 + 0.16, // Half of 0.3 depth + 0.01 gap
        );
        group.add(logoPanel);

        // Top sign
        const sign = new THREE.Mesh(
          new THREE.BoxGeometry(w * 0.7, 0.3, 0.05),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }),
        );
        // Place sign right below the top rim, in front of the vertical frame
        sign.position.set(0, h_ - 0.15, -d / 2 + zOff + 0.05 + 0.026);
        group.add(sign);

        return { boothGroup: group, logoPanel, sign };
      };

      venueConfig.stands.forEach((stand) => {
        const group = new THREE.Group();
        group.position.set(stand.position.x, 0, stand.position.z);
        group.userData = { standId: stand.id };

        const w = stand.size?.w || 2.5;
        const d = stand.size?.d || 2.5;
        const h_ = stand.height || 2.5;

        if (!stand.quadGroup && !stand.doubleGroup) {
          // ── SINGLE BOOTH rendering ──
          const { boothGroup, logoPanel, sign } = buildSingleBooth(
            w,
            d,
            h_,
            false,
          );

          if (stand.rotation !== undefined) {
            boothGroup.rotation.y = stand.rotation;
          }

          group.add(boothGroup);
          standLogoPanelsRef.current.set(stand.id, logoPanel);
          standSignsRef.current.set(stand.id, sign);
        } else {
          // ── QUAD/DOUBLE BOOTH — invisible mesh for raycasting ──
          const invisibleBox = new THREE.Mesh(
            new THREE.BoxGeometry(w, 0.5, d),
            new THREE.MeshBasicMaterial({ visible: false }),
          );
          invisibleBox.position.y = 0.25;
          group.add(invisibleBox);
        }

        scene.add(group);
        standMeshesRef.current.set(stand.id, group);

        // 2D label sprite
        const labelMat = new THREE.SpriteMaterial({
          transparent: true,
          depthTest: false,
        });
        const labelSprite = new THREE.Sprite(labelMat);
        labelSprite.position.set(stand.position.x, 4, stand.position.z);
        labelSprite.scale.set(2.3, 1.15, 1);
        scene.add(labelSprite);
        labelSpritesRef.current.set(stand.id, labelSprite);
      });

      // ── Render DOUBLE BOOTH shared geometry ──
      const doubleGroups = new Map<string, typeof venueConfig.stands>();
      venueConfig.stands.forEach((s) => {
        if (s.doubleGroup) {
          if (!doubleGroups.has(s.doubleGroup))
            doubleGroups.set(s.doubleGroup, []);
          doubleGroups.get(s.doubleGroup)!.push(s);
        }
      });

      doubleGroups.forEach((members) => {
        const xs = members.map((m) => m.position.x);
        const zs = members.map((m) => m.position.z);
        const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
        const cz = (Math.min(...zs) + Math.max(...zs)) / 2;
        const h_ = members[0].height || 2.5;
        const isVertical =
          Math.abs(members[0].position.z - members[1].position.z) > 0.1;

        const doubleGroup = new THREE.Group();
        doubleGroup.position.set(cx, 0, cz);

        if (isVertical) {
          doubleGroup.rotation.y = -Math.PI / 2;
        }

        const sortedMembers = [...members].sort((a, b) =>
          isVertical
            ? a.position.z - b.position.z
            : a.position.x - b.position.x,
        );

        // Left booth (faces West)
        const left = buildSingleBooth(2.5, 2.5, h_, true);
        left.boothGroup.position.set(-1.25, 0, 0);
        left.boothGroup.rotation.y = -Math.PI / 2;
        doubleGroup.add(left.boothGroup);
        if (sortedMembers[0]) {
          standLogoPanelsRef.current.set(sortedMembers[0].id, left.logoPanel);
          standSignsRef.current.set(sortedMembers[0].id, left.sign);
        }

        // Right booth (faces East)
        const right = buildSingleBooth(2.5, 2.5, h_, true);
        right.boothGroup.position.set(1.25, 0, 0);
        right.boothGroup.rotation.y = Math.PI / 2;
        doubleGroup.add(right.boothGroup);
        if (sortedMembers[1]) {
          standLogoPanelsRef.current.set(sortedMembers[1].id, right.logoPanel);
          standSignsRef.current.set(sortedMembers[1].id, right.sign);
        }

        scene.add(doubleGroup);
      });

      // ── Render QUAD ISLAND shared geometry (Image 2) ──
      const quadGroups = new Map<string, typeof venueConfig.stands>();
      venueConfig.stands.forEach((s) => {
        if (s.quadGroup) {
          if (!quadGroups.has(s.quadGroup)) quadGroups.set(s.quadGroup, []);
          quadGroups.get(s.quadGroup)!.push(s);
        }
      });

      quadGroups.forEach((members) => {
        const xs = members.map((m) => m.position.x);
        const zs = members.map((m) => m.position.z);
        const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
        const cz = (Math.min(...zs) + Math.max(...zs)) / 2;
        const totalW = 5.0; // Math.max(...xs) - Math.min(...xs) + 2.5
        const totalD = 5.0; // Math.max(...zs) - Math.min(...zs) + 2.5
        const h_ = members[0].height;

        const quadGroup = new THREE.Group();
        quadGroup.position.set(cx, 0, cz);

        // Shared carpet
        const qCarpet = new THREE.Mesh(
          new THREE.PlaneGeometry(totalW + 0.4, totalD + 0.4),
          new THREE.MeshStandardMaterial({
            color: carpetColor,
            roughness: 0.95,
          }),
        );
        qCarpet.rotation.x = -Math.PI / 2;
        qCarpet.position.y = 0.02;
        qCarpet.receiveShadow = true;
        quadGroup.add(qCarpet);

        const wallMat = new THREE.MeshStandardMaterial({
          color: osbColor,
          roughness: 0.85,
          metalness: 0.05,
        });

        // Two crossing shared back walls (no gap, forming a cross separating all 4 booths)
        const wallX = new THREE.Mesh(
          new THREE.BoxGeometry(totalW, h_, 0.08),
          wallMat,
        );
        wallX.position.set(0, h_ / 2, 0);
        wallX.castShadow = true;
        wallX.receiveShadow = true;
        quadGroup.add(wallX);

        const wallZ = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, h_, totalD),
          wallMat.clone(),
        );
        wallZ.position.set(0, h_ / 2, 0);
        wallZ.castShadow = true;
        wallZ.receiveShadow = true;
        quadGroup.add(wallZ);

        // Frame strips
        const qFrameGeo = new THREE.BoxGeometry(0.06, h_, 0.1);
        const qFrameMat = new THREE.MeshStandardMaterial({
          color: frameColor,
          roughness: 0.5,
          metalness: 0.3,
        });
        [-totalW / 2, 0, totalW / 2].forEach((xPos) => {
          const f1 = new THREE.Mesh(qFrameGeo, qFrameMat);
          f1.position.set(xPos, h_ / 2, 0);
          f1.castShadow = true;
          quadGroup.add(f1);
        });
        [-totalD / 2, 0, totalD / 2].forEach((zPos) => {
          const f2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, h_, 0.06),
            qFrameMat,
          );
          f2.position.set(0, h_ / 2, zPos);
          f2.castShadow = true;
          quadGroup.add(f2);
        });

        // Four corner logo cubes (now rectangular)
        const cubeSide = 1; // Used for corner area targeting
        const corners = [
          { x: -totalW / 2 + cubeSide / 2, z: -totalD / 2 + cubeSide / 2 },
          { x: totalW / 2 - cubeSide / 2, z: -totalD / 2 + cubeSide / 2 },
          { x: -totalW / 2 + cubeSide / 2, z: totalD / 2 - cubeSide / 2 },
          { x: totalW / 2 - cubeSide / 2, z: totalD / 2 - cubeSide / 2 },
        ];

        const sortedMembers = [...members].sort((a, b) => {
          if (Math.abs(a.position.z - b.position.z) > 0.1)
            return a.position.z - b.position.z;
          return a.position.x - b.position.x;
        }); // 0: Top-Left, 1: Top-Right, 2: Bot-Left, 3: Bot-Right

        corners.forEach((corner, i) => {
          const faceX = corner.x < 0 ? -1 : 1;
          const rectCubeCenter = faceX * (totalW / 2 - 0.15); // Width is 0.3, so flush with outer edge +/- 2.5

          const cube = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 1, 1),
            wallMat.clone(),
          );
          cube.position.set(rectCubeCenter, 0.5, corner.z);
          cube.castShadow = true;
          quadGroup.add(cube);

          const logoPanel = new THREE.Mesh(
            new THREE.PlaneGeometry(0.96, 0.96),
            new THREE.MeshStandardMaterial({
              color: logoPlaceholderColor,
              roughness: 0.4,
            }),
          );
          logoPanel.position.set(
            rectCubeCenter + faceX * 0.16, // Half of 0.3 width + 0.01
            0.5,
            corner.z,
          );
          logoPanel.rotation.y = faceX < 0 ? -Math.PI / 2 : Math.PI / 2; // Face East/West
          quadGroup.add(logoPanel);

          if (sortedMembers[i])
            standLogoPanelsRef.current.set(sortedMembers[i].id, logoPanel);
        });

        // 4 individual signs on top, in the diagonal
        const signGeo = new THREE.BoxGeometry(0.05, 0.3, 1.8);
        const signMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.3,
        });

        sortedMembers.forEach((member) => {
          const sign = new THREE.Mesh(signGeo, signMat.clone());
          const faceX = member.position.x < cx ? -1 : 1;
          const faceZ = member.position.z < cz ? -1 : 1;

          sign.position.set(faceX * 0.625, h_ - 0.15, faceZ * 0.625);
          sign.rotation.y = faceX === faceZ ? -Math.PI / 4 : Math.PI / 4;

          quadGroup.add(sign);
          standSignsRef.current.set(member.id, sign);
        });

        scene.add(quadGroup);
      });

      setIsLoading(false);

      // Animation loop
      function animate() {
        animFrameRef.current = requestAnimationFrame(animate);
        controls.update();
        const camera = is3DRef.current ? perspCamera : orthoCamera;
        renderer.render(scene, camera);

        if (debugRef.current) {
          const pos = camera.position;
          const target = controls.target;
          const zoom = (camera as any).zoom || 1;
          debugRef.current.innerText = `Pos: ${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)} | Target: ${target.x.toFixed(2)}, ${target.y.toFixed(2)}, ${target.z.toFixed(2)} | Zoom: ${zoom.toFixed(2)}`;
        }
      }
      animate();

      // Resize
      const resizeObserver = new ResizeObserver(() => {
        if (!container || disposed) return;
        const nw = container.clientWidth;
        const nh = container.clientHeight;
        renderer.setSize(nw, nh);
        const a = nw / nh;
        perspCamera.aspect = a;
        perspCamera.updateProjectionMatrix();
        orthoCamera.left = (-frustumSize * a) / 2;
        orthoCamera.right = (frustumSize * a) / 2;
        orthoCamera.top = frustumSize / 2;
        orthoCamera.bottom = -frustumSize / 2;
        orthoCamera.updateProjectionMatrix();
      });
      resizeObserver.observe(container);
      (renderer as any)._ro = resizeObserver;
    }

    init();

    return () => {
      disposed = true;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (rendererRef.current) {
        const r = rendererRef.current;
        (r as any)._ro?.disconnect();
        r.dispose();
        r.domElement.remove();
      }
      controlsRef.current?.dispose();
    };
  }, [createTextCanvas]);

  // ── Update labels/signs/logos when day changes ──
  useEffect(() => {
    const THREE = threeRef.current;
    if (!THREE) return;

    venueConfig.stands.forEach((stand) => {
      const company = getStandCompany(stand.id);
      const label = company?.name || stand.label;

      // 2D sprite label — render company logo image if available, else text
      const sprite = labelSpritesRef.current.get(stand.id);
      if (sprite) {
        const cw = 256;
        const ch = 128;
        const canvas = document.createElement("canvas");
        canvas.width = cw;
        canvas.height = ch;
        const ctx = canvas.getContext("2d")!;
        const bg = company
          ? "rgba(255, 255, 255, 0.95)"
          : "rgba(255, 255, 255, 0.7)";

        // Fill background (rounded)
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.roundRect(0, 0, cw, ch, 16);
        ctx.fill();

        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearFilter;
        tex.colorSpace = THREE.SRGBColorSpace;
        (sprite.material as THREE_TYPES.SpriteMaterial).map?.dispose();
        (sprite.material as THREE_TYPES.SpriteMaterial).map = tex;
        (sprite.material as THREE_TYPES.SpriteMaterial).needsUpdate = true;

        if (company?.logoUrl) {
          // Load logo image and draw it onto the canvas
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          img.src = company.logoUrl;
          img.onload = () => {
            ctx.fillStyle = bg;
            ctx.beginPath();
            ctx.roundRect(0, 0, cw, ch, 16);
            ctx.fill();
            const maxW = 200;
            const maxH = 90;
            const ratio = Math.min(maxW / img.width, maxH / img.height);
            const dw = img.width * ratio;
            const dh = img.height * ratio;
            ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
            tex.needsUpdate = true;
          };
          img.onerror = () => {
            // Fallback: draw text
            ctx.fillStyle = "#ffffff";
            ctx.font = `bold 28px "Montserrat", Arial, sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(label, cw / 2, ch / 2);
            tex.needsUpdate = true;
          };
        } else {
          // No logo — draw text label
          ctx.fillStyle = "#1c2b70";
          ctx.font = `bold ${company ? 28 : 38}px "Montserrat", Arial, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(label, cw / 2, ch / 2);
          tex.needsUpdate = true;
        }
      }

      // 3D sign on top of stand
      const sign = standSignsRef.current.get(stand.id);
      if (sign && company) {
        const nameCanvas = createTextCanvas(company.name, {
          fontSize: 36,
          color: "#1c2b70",
          bgColor: "#ffffff",
          width: 512,
          height: 64,
        });
        const nameTex = new THREE.CanvasTexture(nameCanvas);
        nameTex.minFilter = THREE.LinearFilter;
        nameTex.colorSpace = THREE.SRGBColorSpace;
        const oldMat = sign.material as THREE_TYPES.MeshStandardMaterial;
        oldMat.map?.dispose();
        sign.material = new THREE.MeshStandardMaterial({
          map: nameTex,
          roughness: 0.3,
        });
        oldMat.dispose();
      } else if (sign) {
        const oldMat = sign.material as THREE_TYPES.MeshStandardMaterial;
        oldMat.map?.dispose();
        sign.material = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.3,
        });
        oldMat.dispose();
      }

      // Logo panel on stand side — load logo texture centered without stretching
      const logoPanel = standLogoPanelsRef.current.get(stand.id);

      const setFallbackWhite = () => {
        if (!logoPanel) return;
        const oldMat = logoPanel.material as THREE_TYPES.MeshStandardMaterial;
        oldMat.map?.dispose();
        logoPanel.material = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.6,
        });
        oldMat.dispose();
      };

      if (logoPanel && company?.logoUrl) {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = company.logoUrl;
        img.onload = () => {
          const cw = 512;
          const ch = 512;
          const canvas = document.createElement("canvas");
          canvas.width = cw;
          canvas.height = ch;
          const ctx = canvas.getContext("2d")!;

          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, cw, ch);

          const padding = 32;
          const maxW = cw - padding * 2;
          const maxH = ch - padding * 2;
          const ratio = Math.min(maxW / img.width, maxH / img.height);
          const dw = img.width * ratio;
          const dh = img.height * ratio;
          ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);

          const logoTex = new THREE.CanvasTexture(canvas);
          logoTex.minFilter = THREE.LinearFilter;
          logoTex.colorSpace = THREE.SRGBColorSpace;
          logoTex.generateMipmaps = true;

          const oldMat = logoPanel.material as THREE_TYPES.MeshStandardMaterial;
          oldMat.map?.dispose();
          logoPanel.material = new THREE.MeshStandardMaterial({
            map: logoTex,
            roughness: 0.4,
            color: 0xffffff,
          });
          oldMat.dispose();
        };
        img.onerror = setFallbackWhite;
      } else if (logoPanel) {
        setFallbackWhite();
      }
    });
  }, [selectedDay, getStandCompany, createTextCanvas, isLoading]);

  // ── Toggle 2D/3D ──
  useEffect(() => {
    if (
      !controlsRef.current ||
      !orthoCameraRef.current ||
      !perspCameraRef.current
    )
      return;
    is3DRef.current = is3D;
    const controls = controlsRef.current;
    if (is3D) {
      controls.enabled = true;
      perspCameraRef.current.position.set(-18.3, 35, -11.97);
      perspCameraRef.current.zoom = 1.2;
      perspCameraRef.current.updateProjectionMatrix();
      controls.target.set(-18.3, 20, -11.97);
      controls.update();
    } else {
      controls.enabled = false;
      orthoCameraRef.current.position.set(-18.3, 50, -11.97);
      orthoCameraRef.current.lookAt(-18.3, 0, -11.97);
      orthoCameraRef.current.zoom = 1.2;
      orthoCameraRef.current.updateProjectionMatrix();
    }
    labelSpritesRef.current.forEach((sprite) => {
      sprite.scale.set(is3D ? 2 : 3, is3D ? 1 : 1.5, 1);
      sprite.position.y = is3D ? 3.5 : 4;
    });
  }, [is3D]);

  // ── Pointer interaction — hover to show popup ──
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function getIntersectedStandId(e: MouseEvent): string | null {
      if (
        !rendererRef.current ||
        !sceneRef.current ||
        !raycasterRef.current ||
        !mouseRef.current
      )
        return null;
      const rect = container!.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      const camera = is3D ? perspCameraRef.current : orthoCameraRef.current;
      if (!camera) return null;
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const meshes = Array.from(standMeshesRef.current.values());
      const allChildren: THREE_TYPES.Object3D[] = [];
      meshes.forEach((m) => m.traverse((c) => allChildren.push(c)));
      const intersects = raycasterRef.current.intersectObjects(
        allChildren,
        false,
      );
      if (intersects.length > 0) {
        let obj: THREE_TYPES.Object3D | null = intersects[0].object;
        while (obj && !obj.userData?.standId) obj = obj.parent;
        return obj?.userData?.standId ?? null;
      }
      return null;
    }

    function onPointerMove(e: PointerEvent) {
      const standId = getIntersectedStandId(e);
      container!.style.cursor = standId ? "pointer" : is3D ? "grab" : "default";
    }

    function onPointerDown(e: PointerEvent) {
      pointerStartRef.current = { x: e.clientX, y: e.clientY };
    }

    function onClick(e: MouseEvent) {
      // Check if this was a drag or a click
      if (!pointerStartRef.current) return;
      const dx = Math.abs(e.clientX - pointerStartRef.current.x);
      const dy = Math.abs(e.clientY - pointerStartRef.current.y);
      if (dx > 5 || dy > 5) return; // It was a drag, don't open dialog

      const standId = getIntersectedStandId(e);
      if (standId) {
        const stand = venueConfig.stands.find((s) => s.id === standId);
        if (stand) {
          setPopup({
            stand,
            company: currentDay?.standAssignments.find(
              (a) => a.standId === stand.id,
            )?.company,
          });
        }
      }
    }

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("click", onClick);
    return () => {
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("click", onClick);
    };
  }, [is3D, currentDay]);

  // ── 2D manual pan & zoom (only active when !is3D) ──
  useEffect(() => {
    const container = containerRef.current;
    if (!container || is3D) return;

    let isPanning = false;
    let startX = 0;
    let startY = 0;
    let startCamX = 0;
    let startCamZ = 0;

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const cam = orthoCameraRef.current;
      if (!cam) return;
      cam.zoom = Math.max(0.3, Math.min(5, cam.zoom - e.deltaY * 0.002));
      cam.updateProjectionMatrix();
    }

    function onPointerDown(e: PointerEvent) {
      if (e.button !== 0) return;
      isPanning = true;
      startX = e.clientX;
      startY = e.clientY;
      const cam = orthoCameraRef.current;
      if (cam) {
        startCamX = cam.position.x;
        startCamZ = cam.position.z;
      }
      container!.style.cursor = "grabbing";
    }

    function onPointerMoveHandler(e: PointerEvent) {
      if (!isPanning) return;
      const cam = orthoCameraRef.current;
      if (!cam) return;
      const dx = ((e.clientX - startX) * 0.05) / cam.zoom;
      const dy = ((e.clientY - startY) * 0.05) / cam.zoom;
      cam.position.x = startCamX - dx;
      cam.position.z = startCamZ - dy;
      cam.lookAt(cam.position.x, 0, cam.position.z);
    }

    function onPointerUp() {
      isPanning = false;
      container!.style.cursor = "default";
    }

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMoveHandler);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointerleave", onPointerUp);
    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMoveHandler);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointerleave", onPointerUp);
    };
  }, [is3D]);

  // ── Update speaker sprites in zones when day changes ──
  useEffect(() => {
    const THREE = threeRef.current;
    const scene = sceneRef.current;
    if (!THREE || !scene) return;

    // Remove old speaker sprites
    speakerSpritesRef.current.forEach((sprites) => {
      sprites.forEach((s) => scene.remove(s));
    });
    speakerSpritesRef.current.clear();

    // Add new speaker sprites for each zone
    venueConfig.zones.forEach((zone) => {
      const speakers = getSpeakersForZone(zone.id);
      if (speakers.length === 0) return;

      const sprites: THREE_TYPES.Sprite[] = [];
      const lineH = 1;
      const totalH = speakers.length * lineH;
      const startZ = zone.position.z - totalH / 2 + lineH / 2;

      speakers.forEach((speaker, i) => {
        const text = `${speaker.time || ""} ${speaker.name} — ${speaker.title}`;
        const canvas = createTextCanvas(text, {
          fontSize: 22,
          color: "#ffffff",
          bgColor: "rgba(0,0,0,0.5)",
          width: 512,
          height: 48,
          bold: false,
          borderRadius: 12,
        });
        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearFilter;
        tex.colorSpace = THREE.SRGBColorSpace;
        const mat = new THREE.SpriteMaterial({
          map: tex,
          transparent: true,
          depthTest: false,
        });
        const sprite = new THREE.Sprite(mat);
        sprite.position.set(zone.position.x, 1.5, startZ + i * lineH);
        sprite.scale.set(8, 0.75, 1);
        scene.add(sprite);
        sprites.push(sprite);
      });

      speakerSpritesRef.current.set(zone.id, sprites);
    });
  }, [selectedDay, getSpeakersForZone, createTextCanvas, isLoading]);

  return (
    <div className="flex flex-col">
      {/* ═══ Day Selector Pills ═══ */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 px-4 py-4 bg-gray-50 border-b border-gray-200">
        {venueConfig.days.map((day, idx) => (
          <button
            key={day.date}
            onClick={() => {
              setSelectedDay(idx);
              setPopup(null);
            }}
            className={`
              px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap
              ${
                selectedDay === idx
                  ? "bg-sinfo-primary text-white shadow-lg shadow-sinfo-primary/30 scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200"
              }
            `}
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* ═══ 3D Viewer ═══ */}
      <div className="relative w-full" style={{ height: "min(65vh, 600px)" }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-sinfo-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600 font-medium">Loading venue...</p>
            </div>
          </div>
        )}

        <div
          ref={containerRef}
          className="relative w-full h-full overflow-hidden"
        />

        {/* ═══ Debug Overlay ═══ */}
        <div
          ref={debugRef}
          className="absolute bottom-4 left-4 z-[60] bg-black/70 text-white font-mono text-[10px] px-2 py-1 rounded backdrop-blur-sm pointer-events-none border border-white/10"
        />

        {/* ═══ Company Dialog (Centered Modal) ═══ */}
        {popup && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => setPopup(null)}
            />

            {/* Dialog Content */}
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-lg animate-in zoom-in-95 fade-in duration-300">
              {/* Header */}
              <div className="bg-sinfo-primary px-6 py-5 flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-xl leading-tight">
                    {popup.company?.name || popup.stand.label}
                  </p>
                  <p className="text-white/70 text-sm">
                    Stand {popup.stand.label}
                  </p>
                </div>
                <button
                  onClick={() => setPopup(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {popup.company ? (
                <div className="p-6 text-left">
                  {popup.company.logoUrl && (
                    <div className="w-full h-32 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100 p-4 font-normal">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={popup.company.logoUrl}
                        alt={popup.company.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}
                  {popup.company.description && (
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {popup.company.description}
                    </p>
                  )}
                  {popup.company.siteUrl && (
                    <a
                      href={popup.company.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-sinfo-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-sinfo-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] w-full justify-center shadow-lg shadow-sinfo-primary/20"
                    >
                      Visit Website
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="inline-flex p-3 bg-gray-50 rounded-full mb-3 text-gray-400">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium italic">
                    Available for {currentDay?.longLabel || "this day"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2D/3D toggle */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button
            onClick={() => setIs3D(false)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md ${
              !is3D
                ? "bg-sinfo-primary text-white"
                : "bg-white/90 text-gray-700 hover:bg-white"
            }`}
          >
            2D View
          </button>
          <button
            onClick={() => setIs3D(true)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md ${
              is3D
                ? "bg-sinfo-primary text-white"
                : "bg-white/90 text-gray-700 hover:bg-white"
            }`}
          >
            3D View
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 sm:p-4">
          <p className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
            Legend
          </p>
          <div className="flex flex-col gap-1.5">
            {venueConfig.zones.map((zone) => (
              <div key={zone.id} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: zone.color }}
                />
                <span className="text-xs text-gray-700">{zone.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: "#c9a96e" }}
              />
              <span className="text-xs text-gray-700">Company Stands</span>
            </div>
          </div>
        </div>

        {/* Mobile hint */}
        {is3D && (
          <div className="absolute bottom-4 right-4 z-20 sm:hidden">
            <div className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
              Pinch to zoom · Drag to rotate
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
