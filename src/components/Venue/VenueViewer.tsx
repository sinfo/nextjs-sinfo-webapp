"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { venueConfig, type DayConfig } from "@/constants/venueData";
import type * as THREE_TYPES from "three";
import { useRouter } from "next/navigation";

// ── Core ──
import { initScene, startAnimationLoop } from "./core/SceneManager";
import {
  PERSP_INITIAL_POSITION,
  PERSP_INITIAL_ZOOM,
  ORTHO_INITIAL_POSITION,
  ORTHO_INITIAL_ZOOM,
  CONTROLS_TARGET,
} from "./core/constants";

// ── Builders ──
import { buildGround } from "./builders/GroundBuilder";
import { buildEntrances } from "./builders/EntranceBuilder";
import { buildZones } from "./builders/ZoneBuilder";
import { buildAllStands } from "./builders/StandManager";
import { buildChairs } from "./builders/ChairBuilder";
import { buildTVs } from "./builders/TelevisionBuilder";

// ── Updaters ──
import { updateLabels } from "./updaters/LabelUpdater";
import { updateSigns } from "./updaters/SignUpdater";
import { updateLogoPanels } from "./updaters/LogoPanelUpdater";
import {
  clearSpeakerCards,
  createSpeakerCards,
  updateSpeakerCardsLayout,
} from "./updaters/SpeakerCardManager";

// ── Interaction ──
import { setupRaycastHandler } from "./interaction/RaycastHandler";
import { setupPanZoom } from "./interaction/PanZoomHandler";
import { setupModifierHandler } from "./interaction/ModifierHandler";
import { setupTouchHandler } from "./interaction/TouchHandler";

// ─────────────────────────────────────────────────────────────────────────────

interface VenueViewerProps {
  companies?: Company[];
  speakers?: Speaker[];
  sessions?: SINFOSession[];
}

const shouldDebug = false;

export default function VenueViewer({
  companies,
  speakers,
  sessions,
}: VenueViewerProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const debugRef = useRef<HTMLDivElement>(null);

  // Scene refs (populated by init, read by effects)
  const threeRef = useRef<typeof THREE_TYPES | null>(null);
  const sceneRef = useRef<THREE_TYPES.Scene | null>(null);
  const perspCameraRef = useRef<THREE_TYPES.PerspectiveCamera | null>(null);
  const orthoCameraRef = useRef<THREE_TYPES.OrthographicCamera | null>(null);
  const controlsRef = useRef<any>(null);
  const raycasterRef = useRef<THREE_TYPES.Raycaster | null>(null);
  const mouseRef = useRef<THREE_TYPES.Vector2 | null>(null);

  // Stand refs (populated by builders, read by updaters)
  const standMeshesRef = useRef<Map<string, THREE_TYPES.Object3D>>(new Map());
  const labelSpritesRef = useRef<Map<string, THREE_TYPES.Sprite>>(new Map());
  const standSignsRef = useRef<Map<string, THREE_TYPES.Mesh>>(new Map());
  const standLogoPanelsRef = useRef<Map<string, THREE_TYPES.Mesh>>(new Map());
  const speakerCardsRef = useRef<Map<string, THREE_TYPES.Mesh[]>>(new Map());

  const is3DRef = useRef(false);

  // ── State ──
  const [is3D, setIs3D] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(0);

  const currentDay: DayConfig | undefined = venueConfig.days[selectedDay];

  // ── Enrich speakers with sessions ──
  const enrichedSpeakers = useMemo(() => {
    if (!speakers) return [];
    if (!sessions) return speakers;

    return speakers.map((speaker) => {
      const speakerSessions = sessions.filter((session) =>
        session.speakers?.some((s) => s.id === speaker.id),
      );
      return { ...speaker, sessions: speakerSessions };
    });
  }, [speakers, sessions]);

  // ── Resolve stand → company for current day ──
  const getStandCompany = useCallback(
    (standId: string): Company | undefined => {
      if (companies) {
        const dayDate = currentDay?.date;
        return companies.find((c) =>
          c.stands?.some(
            (s) =>
              s.standId === standId &&
              (!dayDate || s.date?.startsWith(dayDate)),
          ),
        );
      }
      return currentDay?.standAssignments.find((a) => a.standId === standId)
        ?.company;
    },
    [companies, currentDay],
  );

  // ── Get speakers for a zone on the current day ──
  const getSpeakersForZone = useCallback(
    (zoneId: string): Array<{ speaker: Speaker; session: SINFOSession }> => {
      const zone = venueConfig.zones.find((z) => z.id === zoneId);
      const zoneLabel = zone?.label;

      if (enrichedSpeakers) {
        const dayDate = currentDay?.date;
        if (!dayDate) return [];

        const results: Array<{ speaker: Speaker; session: SINFOSession }> = [];
        enrichedSpeakers.forEach((sp) => {
          const session = sp.sessions?.find(
            (s) =>
              s.date?.startsWith(dayDate) &&
              (s.place === zoneId || s.place === zoneLabel),
          );
          if (session) {
            results.push({ speaker: sp, session });
          }
        });
        results.sort((a, b) => a.session.date.localeCompare(b.session.date));
        return results;
      }
      return [];
    },
    [enrichedSpeakers, currentDay],
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // Effect 1: Initialize Three.js scene + build all geometry
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    let disposed = false;
    let stopLoop: (() => void) | null = null;
    let sceneCleanup: (() => void) | null = null;

    async function init() {
      try {
        if (!containerRef.current) return;

        const ctx = await initScene(containerRef.current);
        if (!ctx) return;

        // If component unmounted during async init, clean up immediately
        if (disposed) {
          ctx.cleanup();
          return;
        }

        // Store refs
        threeRef.current = ctx.THREE;
        sceneRef.current = ctx.scene;
        perspCameraRef.current = ctx.perspCamera;
        orthoCameraRef.current = ctx.orthoCamera;
        controlsRef.current = ctx.controls;
        raycasterRef.current = ctx.raycaster;
        mouseRef.current = ctx.mouse;
        sceneCleanup = ctx.cleanup;

        const { THREE, scene } = ctx;

        // ── Build all venue geometry ──
        buildGround(THREE, scene);
        buildEntrances(THREE, scene);
        buildZones(THREE, scene);
        await buildChairs(THREE, scene);
        buildTVs(THREE, scene);

        const standRefs = buildAllStands(THREE, scene);
        standMeshesRef.current = standRefs.standMeshes;
        labelSpritesRef.current = standRefs.labelSprites;
        standSignsRef.current = standRefs.standSigns;
        standLogoPanelsRef.current = standRefs.standLogoPanels;

        setIsLoading(false);

        // ── Start animation loop ──
        stopLoop = startAnimationLoop(ctx, is3DRef, debugRef.current);
      } catch (err) {
        console.error("[VenueViewer] init error:", err);
      }
    }

    init();

    return () => {
      disposed = true;
      stopLoop?.();
      sceneCleanup?.();
    };
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // Effect 2: Update labels/signs/logos when day changes
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const THREE = threeRef.current;
    if (!THREE || isLoading) return;

    updateLabels(THREE, labelSpritesRef.current, getStandCompany);
    updateSigns(THREE, standSignsRef.current, getStandCompany);
    updateLogoPanels(THREE, standLogoPanelsRef.current, getStandCompany);
  }, [selectedDay, getStandCompany, isLoading]);

  // ═══════════════════════════════════════════════════════════════════════════
  // Effect 3: Toggle 2D/3D camera mode
  // ═══════════════════════════════════════════════════════════════════════════
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
      perspCameraRef.current.position.set(
        PERSP_INITIAL_POSITION.x,
        PERSP_INITIAL_POSITION.y,
        PERSP_INITIAL_POSITION.z,
      );
      perspCameraRef.current.zoom = PERSP_INITIAL_ZOOM;
      perspCameraRef.current.updateProjectionMatrix();
      controls.target.set(
        CONTROLS_TARGET.x,
        CONTROLS_TARGET.y,
        CONTROLS_TARGET.z,
      );
      controls.update();
    } else {
      controls.enabled = false;
      orthoCameraRef.current.position.set(
        ORTHO_INITIAL_POSITION.x,
        ORTHO_INITIAL_POSITION.y,
        ORTHO_INITIAL_POSITION.z,
      );
      orthoCameraRef.current.lookAt(
        ORTHO_INITIAL_POSITION.x,
        0,
        ORTHO_INITIAL_POSITION.z,
      );
      orthoCameraRef.current.zoom = ORTHO_INITIAL_ZOOM;
      orthoCameraRef.current.updateProjectionMatrix();
    }

    // Update label sprite positions
    labelSpritesRef.current.forEach((sprite) => {
      const scale = 2;
      sprite.scale.set(scale, scale, 1);
      sprite.position.y = is3D ? 3.5 : 4;
    });

    // Update speaker cards layout
    updateSpeakerCardsLayout(speakerCardsRef.current, is3D);
  }, [is3D]);

  // ═══════════════════════════════════════════════════════════════════════════
  // Effect 4: Pointer interaction (hover + click)
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const container = containerRef.current;
    if (
      !container ||
      !raycasterRef.current ||
      !mouseRef.current ||
      !perspCameraRef.current ||
      !orthoCameraRef.current
    )
      return;

    return setupRaycastHandler({
      container,
      raycaster: raycasterRef.current,
      mouse: mouseRef.current,
      perspCamera: perspCameraRef.current,
      orthoCamera: orthoCameraRef.current,
      standMeshes: standMeshesRef.current,
      is3DRef,
      getStandCompany,
      onNavigateToCompany: (companyId) =>
        router.push(`/companies/${companyId}`),
    });
  }, [is3D, currentDay, getStandCompany, router, isLoading]);

  // ═══════════════════════════════════════════════════════════════════════════
  // Effect 5: 2D manual pan & zoom
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !controlsRef.current || !threeRef.current) return;

    const cleanupModifier = setupModifierHandler(
      container,
      threeRef.current,
      controlsRef.current,
    );
    const cleanupTouch = setupTouchHandler(container, controlsRef.current);

    return () => {
      cleanupModifier();
      cleanupTouch();
    };
  }, [isLoading]);

  // ═══════════════════════════════════════════════════════════════════════════
  // Effect 6: 2D manual pan & zoom
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const container = containerRef.current;
    if (!container || is3D || !orthoCameraRef.current || isLoading) return;

    return setupPanZoom(container, orthoCameraRef.current);
  }, [is3D, isLoading]);

  // ═══════════════════════════════════════════════════════════════════════════
  // Effect 7: Speaker cards (create/remove on day change)
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const THREE = threeRef.current;
    const scene = sceneRef.current;
    if (!THREE || !scene || isLoading) return;

    clearSpeakerCards(scene, speakerCardsRef.current);
    createSpeakerCards(
      THREE,
      scene,
      speakerCardsRef.current,
      getSpeakersForZone,
      is3DRef.current,
    );
  }, [selectedDay, getSpeakersForZone, isLoading]);

  // ═══════════════════════════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="flex flex-col">
      {/* ═══ Day Selector Pills ═══ */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 px-4 py-4 bg-gray-50 border-b border-gray-200">
        {venueConfig.days.map((day, idx) => (
          <button
            key={day.date}
            onClick={() => setSelectedDay(idx)}
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
          className="relative w-full h-full overflow-hidden touch-none"
        />

        {/* ═══ Debug Overlay ═══ */}
        {shouldDebug && (
          <div
            ref={debugRef}
            className="absolute bottom-4 left-4 z-[60] bg-black/70 text-white font-mono text-[10px] px-2 py-1 rounded backdrop-blur-sm pointer-events-none border border-white/10"
          />
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
            2D
          </button>
          <button
            onClick={() => setIs3D(true)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md ${
              is3D
                ? "bg-sinfo-primary text-white"
                : "bg-white/90 text-gray-700 hover:bg-white"
            }`}
          >
            3D
          </button>
        </div>
      </div>
    </div>
  );
}
