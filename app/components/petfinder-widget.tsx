import { useEffect, useRef } from "react";
import type { PetfinderWidgetConfig } from "../lib/petfinder-config.server";

const DEFAULT_SCRIPT_URL = "https://www.petfinder.com/pet-scroller.bundle.js";

let scriptLoaded = false;
let scriptLoading: Promise<void> | null = null;

function loadPetfinderScript(scriptUrl: string): Promise<void> {
  if (scriptLoaded) return Promise.resolve();
  if (scriptLoading) return scriptLoading;

  scriptLoading = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-petfinder-widget="true"]`
    );
    if (existing) {
      scriptLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = scriptUrl || DEFAULT_SCRIPT_URL;
    script.async = true;
    script.dataset.petfinderWidget = "true";
    script.onload = () => {
      scriptLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load Petfinder widget script"));
    document.body.appendChild(script);
  });

  return scriptLoading;
}

function setJsonAttribute(element: HTMLElement, name: string, values: string[]) {
  if (values.length > 0) {
    element.setAttribute(name, JSON.stringify(values));
  }
}

function createPetScroller(config: PetfinderWidgetConfig): HTMLElement {
  const scroller = document.createElement("pet-scroller");

  scroller.setAttribute("apiBase", config.apiBase);
  scroller.setAttribute("s3Url", config.s3Url);
  scroller.setAttribute("petfinderUrl", config.petfinderUrl);
  scroller.setAttribute("status", config.status);
  scroller.setAttribute("limit", String(config.limit));
  scroller.setAttribute("hideBreed", config.hideBreed);

  if (config.petListTitle) {
    scroller.setAttribute("petListTitle", config.petListTitle);
  }

  setJsonAttribute(scroller, "organization", config.organization);
  setJsonAttribute(scroller, "type", config.type);
  setJsonAttribute(scroller, "age", config.age);

  return scroller;
}

interface PetfinderWidgetProps {
  config: PetfinderWidgetConfig;
}

export default function PetfinderWidget({ config }: PetfinderWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scroller: HTMLElement | null = null;
    let cancelled = false;

    loadPetfinderScript(config.scriptUrl)
      .then(() => {
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = "";
        scroller = createPetScroller(config);
        containerRef.current.appendChild(scroller);
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      cancelled = true;
      if (scroller?.parentNode) {
        scroller.parentNode.removeChild(scroller);
      }
    };
  }, [config]);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-[480px] rounded-2xl overflow-hidden bg-white shadow-soft border border-gray-100"
      aria-live="polite"
      aria-busy="true"
    />
  );
}
