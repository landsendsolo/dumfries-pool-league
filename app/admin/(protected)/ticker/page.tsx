"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { logout } from "@/app/admin/actions";
import { AdminNav } from "@/app/admin/components/admin-nav";

interface CustomNewsItem {
  id: string;
  text: string;
  enabled: boolean;
}

interface TickerSettings {
  enabled: {
    leagueLeader: boolean;
    topPlayer: boolean;
    nextFixtures: boolean;
    eventDeadlines: boolean;
    recentResults: boolean;
    sosChampions: boolean;
  };
  customMessages: string[];
  customNewsItems: CustomNewsItem[];
}

interface TickerPreview {
  mode: "live" | "news" | "none";
  items: string[];
}

const TOGGLE_LABELS: Record<string, string> = {
  leagueLeader: "League Leader",
  topPlayer: "Top Player Win %",
  nextFixtures: "Next Fixtures",
  eventDeadlines: "Event Deadlines",
  recentResults: "Recent Results",
  sosChampions: "SoS Champions",
};

function formatPreviewItem(text: string): ReactNode {
  const parts = text.split(/(\d+\s*-\s*\d+|\d+(?:\.\d+)?%|\d+ points)/);
  return parts.map((part, i) => {
    if (/\d+\s*-\s*\d+|\d+(?:\.\d+)?%|\d+ points/.test(part)) {
      return (
        <span key={i} className="text-gold font-bold">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function TickerSettingsPage() {
  const [settings, setSettings] = useState<TickerSettings | null>(null);
  const [preview, setPreview] = useState<TickerPreview | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [newNewsItem, setNewNewsItem] = useState("");
  const [saving, setSaving] = useState(false);
  const [testLive, setTestLive] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/ticker/settings");
      if (!res.ok) throw new Error();
      const json = await res.json();
      // Ensure customNewsItems exists for older settings
      if (!json.customNewsItems) json.customNewsItems = [];
      setSettings(json);
    } catch {
      setSettings({
        enabled: {
          leagueLeader: true,
          topPlayer: true,
          nextFixtures: true,
          eventDeadlines: true,
          recentResults: true,
          sosChampions: true,
        },
        customMessages: [],
        customNewsItems: [],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPreview = useCallback(async () => {
    try {
      const res = await fetch("/api/ticker");
      if (!res.ok) return;
      const json = await res.json();
      setPreview(json);
    } catch {
      /* skip */
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    fetchPreview();
  }, [fetchSettings, fetchPreview]);

  async function saveSettings(updated: TickerSettings) {
    setSaving(true);
    try {
      const res = await fetch("/api/ticker/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      if (res.ok) {
        setSettings(updated);
        // Refresh preview after a short delay to let the API pick up new settings
        setTimeout(fetchPreview, 500);
      }
    } catch {
      /* skip */
    } finally {
      setSaving(false);
    }
  }

  function handleToggle(key: string) {
    if (!settings) return;
    const updated = {
      ...settings,
      enabled: {
        ...settings.enabled,
        [key]: !settings.enabled[key as keyof typeof settings.enabled],
      },
    };
    setSettings(updated);
    saveSettings(updated);
  }

  function handleAddMessage() {
    if (!settings || !newMessage.trim()) return;
    const updated = {
      ...settings,
      customMessages: [...settings.customMessages, newMessage.trim()],
    };
    setNewMessage("");
    setSettings(updated);
    saveSettings(updated);
  }

  function handleDeleteMessage(index: number) {
    if (!settings) return;
    const updated = {
      ...settings,
      customMessages: settings.customMessages.filter((_, i) => i !== index),
    };
    setSettings(updated);
    saveSettings(updated);
  }

  // Custom News Items handlers
  function handleAddNewsItem() {
    if (!settings || !newNewsItem.trim()) return;
    const item: CustomNewsItem = {
      id: Date.now().toString(),
      text: newNewsItem.trim(),
      enabled: true,
    };
    const updated = {
      ...settings,
      customNewsItems: [...settings.customNewsItems, item],
    };
    setNewNewsItem("");
    setSettings(updated);
    saveSettings(updated);
  }

  function handleToggleNewsItem(id: string) {
    if (!settings) return;
    const updated = {
      ...settings,
      customNewsItems: settings.customNewsItems.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item,
      ),
    };
    setSettings(updated);
    saveSettings(updated);
  }

  function handleDeleteNewsItem(id: string) {
    if (!settings) return;
    const updated = {
      ...settings,
      customNewsItems: settings.customNewsItems.filter((item) => item.id !== id),
    };
    setSettings(updated);
    saveSettings(updated);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const previewDuration = preview
    ? Math.max(18, preview.items.length * 4)
    : 18;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <AdminNav />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Ticker Settings</h1>
          <p className="text-gray-400 text-sm mt-1">
            Control the scrolling ticker bar
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="text-gray-500 hover:text-gray-300 text-xs cursor-pointer"
          >
            Logout
          </button>
        </form>
      </div>

      {/* News Sources */}
      <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4 sm:p-6 mb-6">
        <h2 className="text-sm font-bold text-gold uppercase tracking-wider mb-4">
          News Sources
        </h2>
        <div className="space-y-3">
          {Object.entries(TOGGLE_LABELS).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center justify-between py-2 cursor-pointer"
            >
              <span className="text-sm text-gray-300">{label}</span>
              <button
                type="button"
                onClick={() => handleToggle(key)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer ${
                  settings?.enabled[key as keyof typeof settings.enabled]
                    ? "bg-gold"
                    : "bg-navy-dark border border-gold/20"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
                    settings?.enabled[key as keyof typeof settings.enabled]
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </label>
          ))}
        </div>
        {saving && (
          <p className="text-xs text-gold mt-3">Saving...</p>
        )}
      </div>

      {/* Custom News Items */}
      <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4 sm:p-6 mb-6">
        <h2 className="text-sm font-bold text-gold uppercase tracking-wider mb-4">
          Custom News Items
        </h2>
        <p className="text-gray-500 text-xs mb-4">
          Add custom items to the ticker. Toggle each item on or off.
        </p>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newNewsItem}
            onChange={(e) => setNewNewsItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddNewsItem()}
            placeholder="Enter a custom news item..."
            className="flex-1 bg-navy-dark/50 border border-gold/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors placeholder:text-gray-600"
          />
          <button
            type="button"
            onClick={handleAddNewsItem}
            disabled={!newNewsItem.trim()}
            className="bg-gold text-navy font-bold text-sm px-4 py-3 rounded-lg hover:bg-gold/90 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            Add
          </button>
        </div>
        {settings && settings.customNewsItems.length > 0 ? (
          <ul className="space-y-2">
            {settings.customNewsItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 bg-navy-dark/30 rounded-lg px-4 py-3"
              >
                <button
                  type="button"
                  onClick={() => handleToggleNewsItem(item.id)}
                  className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                    item.enabled
                      ? "bg-gold"
                      : "bg-navy-dark border border-gold/20"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                      item.enabled ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
                <span
                  className={`text-sm flex-1 mr-3 break-words min-w-0 ${
                    item.enabled ? "text-gray-300" : "text-gray-600 line-through"
                  }`}
                >
                  {item.text}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteNewsItem(item.id)}
                  className="text-red-400 hover:text-red-300 text-xs shrink-0 cursor-pointer"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-sm">No custom news items.</p>
        )}
      </div>

      {/* Custom Messages */}
      <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4 sm:p-6 mb-6">
        <h2 className="text-sm font-bold text-gold uppercase tracking-wider mb-4">
          Custom Messages
        </h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddMessage()}
            placeholder="Enter a custom ticker message..."
            className="flex-1 bg-navy-dark/50 border border-gold/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors placeholder:text-gray-600"
          />
          <button
            type="button"
            onClick={handleAddMessage}
            disabled={!newMessage.trim()}
            className="bg-gold text-navy font-bold text-sm px-4 py-3 rounded-lg hover:bg-gold/90 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            Add
          </button>
        </div>
        {settings && settings.customMessages.length > 0 ? (
          <ul className="space-y-2">
            {settings.customMessages.map((msg, i) => (
              <li
                key={i}
                className="flex items-center justify-between bg-navy-dark/30 rounded-lg px-4 py-3"
              >
                <span className="text-sm text-gray-300 flex-1 mr-3 break-words min-w-0">
                  {msg}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteMessage(i)}
                  className="text-red-400 hover:text-red-300 text-xs shrink-0 cursor-pointer"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-sm">No custom messages.</p>
        )}
      </div>

      {/* Preview */}
      <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gold uppercase tracking-wider">
            Preview
          </h2>
          <button
            type="button"
            onClick={() => setTestLive(!testLive)}
            className={`text-xs font-medium px-3 py-1.5 rounded cursor-pointer transition-colors ${
              testLive
                ? "bg-[#e24b4a] text-white"
                : "bg-navy-dark border border-gold/20 text-gray-400 hover:text-gray-300"
            }`}
          >
            {testLive ? "Live Mode ON" : "Test Live Mode"}
          </button>
        </div>

        {preview && preview.items.length > 0 ? (
          <div className="w-full h-9 bg-navy rounded-lg flex items-center overflow-hidden border border-gold/10">
            <div className="shrink-0 h-full flex items-center px-2 sm:px-3 z-10 bg-navy">
              {testLive ? (
                <span className="flex items-center gap-1.5 bg-[#e24b4a] text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  LIVE
                </span>
              ) : (
                <span className="bg-gold text-navy text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded">
                  NEWS
                </span>
              )}
            </div>
            <div className="flex-1 overflow-hidden relative">
              <div
                className="flex whitespace-nowrap"
                style={{
                  animation: `ticker-scroll ${previewDuration}s linear infinite`,
                }}
              >
                {[...preview.items, ...preview.items].map((item, i) => (
                  <span key={i} className="inline-flex items-center">
                    <span className="text-[11px] sm:text-xs text-white">
                      {formatPreviewItem(item)}
                    </span>
                    <span className="text-gold/30 mx-3 sm:mx-4 text-xs select-none">
                      |
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-sm">
            Ticker is hidden — enable some sources or add a custom message.
          </p>
        )}
      </div>
    </div>
  );
}
