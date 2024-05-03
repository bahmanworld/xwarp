import { usePanelStack } from "../stores/useStack";
import SettingsPanel from "./SettingsPanel";
import { Github, Info, Settings, Terminal, X } from "lucide-react";
import { Button, ButtonGroup, Tooltip } from "@blueprintjs/core";
import AppLogo from "/logo.png";
import ConnectionIcon from "/connection.png";
import ConnectedIcon from "/connected.png";
import { IFConfigCountryFlag, useWarp } from "../stores/useWarp";
import PackageJSON from "../../package.json";
import LogsPanel from "./LogsPanel";
import AboutPanel from "./AboutPanel";
import React from "react";
import axios from "axios";

const HomePanel = () => {
  const stack = usePanelStack();
  const warp = useWarp();

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyItems: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          padding: 10,
          paddingTop: 35,
          flexDirection: "column",
          justifyItems: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 5,
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 10,
            }}
          >
            <img
              src={AppLogo}
              style={{
                width: 40,
                height: 40,
                borderRadius: 100,
              }}
            />
            <div>
              <div style={{ fontSize: 20, fontWeight: "bold" }}>XWarp</div>
              <div style={{ fontSize: 10, opacity: 0.4 }}>
                Version {PackageJSON.version}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            className={`big-button ${
              warp.connecting ? "connecting" : warp.connected ? "connected" : ""
            }`}
            onClick={() => {
              if (warp.connected) {
                warp.disconnect();
              } else {
                warp.connect();
              }
            }}
          >
            {!warp.connecting && (
              <div>
                {!warp.connected && (
                  <img
                    src={ConnectionIcon}
                    style={{
                      width: 80,
                      height: 80,
                      filter: "drop-shadow(5px 5px 15px #000a)",
                    }}
                  />
                )}
                {warp.connected && (
                  <img
                    src={ConnectedIcon}
                    style={{
                      width: 100,
                      height: 100,
                      filter: "drop-shadow(5px 10px 15px #0006)",
                    }}
                  />
                )}
              </div>
            )}
            {warp.connecting && (
              <img
                src={ConnectionIcon}
                style={{
                  width: 80,
                  height: "auto",
                }}
                className={warp.connecting ? "animating" : ""}
              />
            )}
          </button>
        </div>

        <div
          style={{
            padding: 20,
            opacity: warp.connected && warp.ifconfig ? 1 : 0.6,
            fontSize: 12,
            marginTop: -25,
          }}
        >
          {!warp.connected && !warp.connecting && "Disconnected"}
          {warp.connecting && "Connecting..."}
          {warp.connected && !warp.ifconfig && "Getting IP..."}
          {warp.connected && warp.ifconfig && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <div>
                {
                  IFConfigCountryFlag?.find(
                    (c) => (c.id = warp.ifconfig?.country_iso)
                  )?.flag
                }
              </div>
              <div>{warp.ifconfig?.country}</div>
            </div>
          )}
        </div>

        <ButtonGroup minimal style={{ marginBottom: 5 }}>
          <Tooltip compact content={"About..."}>
            <Button
              onClick={() => {
                stack.push({
                  renderPanel: AboutPanel,
                });
              }}
            >
              <Info size={18} style={{ marginBottom: -4 }} />
            </Button>
          </Tooltip>
          <Tooltip compact content={"Logs"}>
            <Button
              onClick={() => {
                stack.push({
                  renderPanel: LogsPanel,
                });
              }}
            >
              <Terminal size={18} style={{ marginBottom: -4 }} />
            </Button>
          </Tooltip>
          <Tooltip compact content={"Github Repository"}>
            <Button
              onClick={() => {
                window.electron.openExternalLink(
                  "https://github.com/bahmanworld/xwarp"
                );
              }}
            >
              <Github size={18} style={{ marginBottom: -4 }} />
            </Button>
          </Tooltip>
          <Tooltip compact content={"Settings"}>
            <Button
              onClick={() => {
                stack.push({
                  renderPanel: SettingsPanel,
                });
              }}
            >
              <Settings size={18} style={{ marginBottom: -4 }} />
            </Button>
          </Tooltip>
          <Tooltip compact intent="danger" content={"Force Quit"}>
            <Button
              intent="danger"
              onClick={() => {
                if (confirm("Force Quit Application?")) {
                  window.electron.quit();
                }
              }}
            >
              <X size={18} style={{ marginBottom: -4 }} />
            </Button>
          </Tooltip>
        </ButtonGroup>

        <div
          style={{
            fontSize: 10,
            opacity: 0.2,
            textAlign: "center",
          }}
        >
          <div>Dahatu Corporation</div>
          <div style={{ fontSize: 8 }}>
            Copyright ©{new Date(Date.now()).getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePanel;
