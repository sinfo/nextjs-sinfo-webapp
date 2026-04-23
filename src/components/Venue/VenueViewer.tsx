"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { venueConfig, type DayConfig } from "@/constants/venueData";
import type * as THREE_TYPES from "three";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { isMember } from "@/utils/utils";
import EventDayButton from "@/components/EventDayButton";
import GridList from "@/components/GridList";
import { Package } from "lucide-react";

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
import { buildMainStage, buildConnectStage } from "./builders/StageBuilder";
import { buildLoungeDecorations } from "./builders/LoungeBuilder";
import { buildPlants } from "./builders/PlantBuilder";
import { buildGamingZone } from "./builders/GamingBuilder";

// ── Updaters ──
import { updateLabels, updateZoneLabels } from "./updaters/LabelUpdater";
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
  userRole?: string;
}

const shouldDebug = false;

export default function VenueViewer({
  companies,
  speakers,
  sessions,
  userRole,
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
  const zoneSpritesRef = useRef<Map<string, THREE_TYPES.Sprite>>(new Map());
  const speakerCardsRef = useRef<Map<string, THREE_TYPES.Object3D[]>>(
    new Map(),
  );

  // ── State ──
  const [is3D, setIs3D] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("sinfo-venue-is3d") === "true";
    }
    return false;
  });
  const is3DRef = useRef(is3D);
  const isUserToggleRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("sinfo-venue-is3d", String(is3D));
    }
  }, [is3D]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(0);
  const [isLogisticsMode, setIsLogisticsMode] = useState(false);

  const userIsMember = userRole ? isMember(userRole) : false;

  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ── Sync URL Day Param ──
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const searchParamDay = searchParams.get("day");

    // 1. If we have a URL param, use it and cache it
    if (searchParamDay) {
      const targetDate = searchParamDay === "today" ? today : searchParamDay;
      const idx = venueConfig.days.findIndex((d) => d.date === targetDate);
      if (idx !== -1) {
        setSelectedDay(idx);
        sessionStorage.setItem("sinfo-venue-day", targetDate);
        return;
      }
    }

    // 2. Fallback to Session Storage
    const savedDay = sessionStorage.getItem("sinfo-venue-day");
    if (savedDay) {
      const savedIdx = venueConfig.days.findIndex((d) => d.date === savedDay);
      if (savedIdx !== -1) {
        setSelectedDay(savedIdx);
        const params = new URLSearchParams(searchParams.toString());
        params.set("day", savedDay);
        window.history.replaceState(
          null,
          "",
          `${pathname}?${params.toString()}`,
        );
        return;
      }
    }

    // 3. Default to today if it exists in config, else 0
    const todayIdx = venueConfig.days.findIndex((d) => d.date === today);
    const finalIdx = todayIdx !== -1 ? todayIdx : 0;
    setSelectedDay(finalIdx);

    // Instantly inject the default day into the URL so it is bookmarkable immediately
    const params = new URLSearchParams(searchParams.toString());
    params.set("day", venueConfig.days[finalIdx].date);
    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
    sessionStorage.setItem("sinfo-venue-day", venueConfig.days[finalIdx].date);
  }, [searchParams, pathname]);

  const handleDayChange = (idx: number) => {
    setSelectedDay(idx);
    const dateStr = venueConfig.days[idx].date;
    sessionStorage.setItem("sinfo-venue-day", dateStr);

    // Update the browser URL instantly to bypass Next.js transition latency
    const params = new URLSearchParams(searchParams.toString());
    params.set("day", dateStr);
    window.history.pushState(null, "", `${pathname}?${params.toString()}`);
  };

  const currentDay: DayConfig | undefined = venueConfig.days[selectedDay];

  // ── Logistics Logic: Identify stands that changed compared to the previous day ──
  const changingStands = useMemo(() => {
    const result = new Set<string>();
    const currentDate = venueConfig.days[selectedDay]?.date;
    if (!currentDate) return result;

    const findCompanyIdForStandOnDay = (sid: string, dateStr: string) => {
      return companies?.find((c) =>
        c.stands?.some((s) => s.standId === sid && s.date?.startsWith(dateStr)),
      )?.id;
    };

    if (selectedDay === 0) {
      // First day: any stand populated on this day is a change (from "nothing")
      venueConfig.stands.forEach((stand) => {
        if (findCompanyIdForStandOnDay(stand.id, currentDate)) {
          result.add(stand.id);
        }
      });
      return result;
    }

    const prevDate = venueConfig.days[selectedDay - 1]?.date;
    if (!prevDate) return result;

    venueConfig.stands.forEach((stand) => {
      const currentCid = findCompanyIdForStandOnDay(stand.id, currentDate);
      const prevCid = findCompanyIdForStandOnDay(stand.id, prevDate);

      // We highlight stands that are changing companies OR being newly occupied today
      if (currentCid !== prevCid && currentCid) {
        result.add(stand.id);
      }
    });

    return result;
  }, [selectedDay, companies]);

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
              (s.place === zoneId || s.place === zoneLabel) &&
              !(zoneId === "connect-stage" && s.kind === "Q&A"),
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
        // Run synchronous builders first
        buildGround(THREE, scene);
        buildEntrances(THREE, scene);
        zoneSpritesRef.current = buildZones(THREE, scene);
        buildTVs(THREE, scene);
        buildLoungeDecorations(THREE, scene);

        // Run async heavily network/parsing dependent builders concurrently
        await Promise.all([
          buildChairs(THREE, scene),
          buildMainStage(THREE, scene),
          buildConnectStage(THREE, scene),
          buildPlants(THREE, scene),
          buildGamingZone(THREE, scene),
        ]);

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
  // Effect 2: Update labels/signs/logos/visibility when day or mode changes
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const THREE = threeRef.current;
    const scene = sceneRef.current;
    if (!THREE || !scene || isLoading) return;

    // 1. Update component textures/content
    updateLabels(
      THREE,
      labelSpritesRef.current,
      getStandCompany,
      isLogisticsMode,
    );
    updateZoneLabels(THREE, zoneSpritesRef.current, selectedDay);
    updateSigns(THREE, standSignsRef.current, getStandCompany, isLogisticsMode);
    updateLogoPanels(THREE, standLogoPanelsRef.current, getStandCompany);

    // 2. Handle Logistics Mode visibility filtering
    standMeshesRef.current.forEach((mesh, standId) => {
      // Mesh is always visible as requested
      mesh.visible = true;

      const sprite = labelSpritesRef.current.get(standId);
      if (sprite) {
        // Only show label if normal mode OR (logistics mode AND changing)
        sprite.visible = !isLogisticsMode || changingStands.has(standId);
      }
    });

    // Hide logo panels in logistics mode for cleaner look
    standLogoPanelsRef.current.forEach((panel) => {
      panel.visible = !isLogisticsMode;
    });

    // Hide decorative elements in logistics mode
    scene.traverse((child) => {
      if (
        child.userData.isDecorative ||
        child.userData.isSpeakerCard ||
        child.userData.isSpeakerStem
      ) {
        child.visible = !isLogisticsMode;
      }
    });
  }, [
    selectedDay,
    getStandCompany,
    isLoading,
    isLogisticsMode,
    changingStands,
  ]);

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

    // Apply strict camera boundaries ONLY when the user explicitly clicks the 2D/3D toggle
    // Do NOT reset positions if this is just the component remounting from history.
    if (isUserToggleRef.current) {
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
      isUserToggleRef.current = false;
    } else {
      // Just bind controls
      controls.enabled = is3D;
    }

    // Update label sprite positions based on 3D depth
    labelSpritesRef.current.forEach((sprite) => {
      const scale = 2;
      sprite.scale.set(scale, scale, 1);
      sprite.position.y = is3D ? 3.5 : 4;
    });

    // Update speaker cards layout
    updateSpeakerCardsLayout(speakerCardsRef.current, is3D);
  }, [is3D, isLoading]);

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
      speakerCards: speakerCardsRef.current,
      is3DRef,
      getStandCompany,
      onNavigateToCompany: (companyId) =>
        router.push(`/companies/${companyId}`),
      onNavigateToSession: (sessionId) => router.push(`/sessions/${sessionId}`),
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
      <div className="bg-gray-50 border-b border-gray-200 pb-2 pt-4 px-4">
        <GridList>
          {venueConfig.days.map((day, idx) => (
            <EventDayButton
              key={day.date}
              date={day.date}
              onClick={() => handleDayChange(idx)}
              selected={selectedDay === idx}
            />
          ))}
        </GridList>
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

        {/* Mode Toggles */}
        <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => {
                isUserToggleRef.current = true;
                setIs3D(false);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md ${
                !is3D
                  ? "bg-sinfo-primary text-white"
                  : "bg-white/90 text-gray-700 hover:bg-white"
              }`}
            >
              2D
            </button>
            <button
              onClick={() => {
                isUserToggleRef.current = true;
                setIs3D(true);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md ${
                is3D
                  ? "bg-sinfo-primary text-white"
                  : "bg-white/90 text-gray-700 hover:bg-white"
              }`}
            >
              3D
            </button>
          </div>

          {userIsMember && (
            <button
              onClick={() => setIsLogisticsMode(!isLogisticsMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md ${
                isLogisticsMode
                  ? "bg-amber-500 text-white shadow-amber-500/30"
                  : "bg-white/90 text-gray-700 hover:bg-white"
              }`}
            >
              <Package size={18} />
              Logistics
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
