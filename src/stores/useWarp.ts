import { create } from "zustand";
import { useSettings } from "./useSettings";

type IFConfig = {
  ip?: string;
  country?: string;
  country_iso?: string;
};

type WarpProps = {
  log: string;
  ifconfig?: IFConfig | null;
  connected: boolean;
  connecting: boolean;
  connect: () => void;
  disconnect: () => void;
  clearLogs: () => void;
};

export const useWarp = create<WarpProps>()((set, get) => ({
  log: "",
  ifconfig: null,
  connected: false,
  connecting: false,
  connect: () => {
    if (get().connecting) {
      get().disconnect();
      window.electron.disconnect();
      return;
    }
    set({ connecting: true });
    window.electron.logs((data) => {
      set({ log: data });
    });
    window.electron.connect(
      useSettings.getState().getSettings(),
      (_, connected) => {
        set({ connected: connected, connecting: false });
        setTimeout(() => {
          fetch("https://ifconfig.co/json")
            .then((res) => res.json())
            .then((res) => {
              set({ ifconfig: res as IFConfig });
            });
        }, 1000);
      }
    );
  },
  disconnect: () => {
    set({ log: "", connected: false, connecting: false, ifconfig: null });
    window.electron.disconnect();
  },
  clearLogs: () => {
    set({ log: "" });
  },
}));
