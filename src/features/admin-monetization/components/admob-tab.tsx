"use client";

import { Play, Tv } from "lucide-react";
import { AdMobConfig } from "../types";

/** Sub-tab 2: control remoto de la publicidad. */
interface AdmobTabProps {
  admob: AdMobConfig;
  setAdmob: (next: AdMobConfig) => void;
  onSavePolicy: () => void;
  onSimulateAd: () => void;
  onToast: (message: string) => void;
}

export function AdmobTab({ admob, setAdmob, onSavePolicy, onSimulateAd, onToast }: AdmobTabProps) {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-card border border-border-default space-y-6 shadow-card-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Tv size={18} className="text-amber-400" />
              <span>Telemetría y Control Remoto de Google AdMob</span>
            </h3>
            <p className="text-xs text-slate-muted mt-1 leading-relaxed">
              Los cambios se propagan de forma instantánea a la app móvil sin necesidad de enviar nuevas versiones a Google Play o App Store.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSimulateAd}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Play size={13} />
              <span>Probar Anuncio en Simulador</span>
            </button>
            <button
              type="button"
              onClick={onSavePolicy}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-brand text-canvas text-xs font-bold hover:bg-mint-brand transition-colors cursor-pointer shadow-glow-emerald"
            >
              Guardar Cambios
            </button>
          </div>
        </div>

        {/* Controles de Publicidad */}
        <div className="space-y-6">
          {/* Slider de Frecuencia */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">
                  Frecuencia de Anuncios Intersticiales (Pantalla Completa)
                </h4>
                <p className="text-[11px] text-slate-muted">
                  Dispara un video publicitario cada N minijuegos completados por usuarios en plan Free.
                </p>
              </div>
              <span className="text-sm font-black font-mono px-3 py-1 rounded-xl bg-canvas border border-border-default text-emerald-brand">
                Cada {admob.interstitialFreq} juegos
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={admob.interstitialFreq}
              onChange={(e) =>
                setAdmob({
                  ...admob,
                  interstitialFreq: parseInt(e.target.value, 10),
                })
              }
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-canvas rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-subtle">
              <span>1 juego (Alta intensidad)</span>
              <span>2 juegos</span>
              <span className="text-emerald-brand font-bold">3 juegos (Recomendado)</span>
              <span>4 juegos</span>
              <span>5 juegos (Baja fricción)</span>
            </div>
          </div>

          {/* Banners Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-canvas border border-border-default">
            <div>
              <h4 className="text-xs font-bold text-white">Banners Inferiores en Catálogo (320x50)</h4>
              <p className="text-[11px] text-slate-muted">
                Muestra banners fijos al pie de la pantalla en la vista Home y Catálogo de lecciones para usuarios gratuitos.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={admob.bannersEnabled}
                onChange={(e) => {
                  setAdmob({ ...admob, bannersEnabled: e.target.checked });
                  onToast(`Preferencia de banners actualizada (${e.target.checked ? "ON" : "OFF"})`);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-brand" />
            </label>
          </div>

          {/* Rewarded Ads Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-canvas border border-border-default">
            <div>
              <h4 className="text-xs font-bold text-white">
                Videos Recompensados por Vidas y Congelamiento de Racha
              </h4>
              <p className="text-[11px] text-slate-muted">
                Permite a los estudiantes ver un video voluntario para recuperar sus 5 corazones o proteger su racha de días.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={admob.rewardedEnabled}
                onChange={(e) => {
                  setAdmob({ ...admob, rewardedEnabled: e.target.checked });
                  onToast(`Videos recompensados actualizados (${e.target.checked ? "ON" : "OFF"})`);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-brand" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
