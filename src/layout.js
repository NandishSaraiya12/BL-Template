// Slot assignment for the 8-tile Beatland layout:
// 2 battlers, 1 host and 5 judges.
//
// A participant lands in a slot by, in order of priority:
//   1. the latest LAYOUT_TOPIC PubSub message from the host app
//   2. participant metaData.role ("battler" | "host" | "judge")
//   3. join order (battlers, then host, then judges)

export const LAYOUT_TOPIC = "BEATLAND_LAYOUT";
export const JUDGE_COUNT = 5;

// Each PubSub message is a JSON object and is merged over the previous ones, so
// the host app can send partial updates such as {"centerText":"FINAL"}.
export const mergeLayoutMessages = (messages = []) =>
  messages.reduce((layout, { message }) => {
    try {
      const update = typeof message === "string" ? JSON.parse(message) : message;
      if (!update || typeof update !== "object") return layout;
      return {
        ...layout,
        ...update,
        countries: { ...layout.countries, ...update.countries },
        names: { ...layout.names, ...update.names },
      };
    } catch (err) {
      console.log(err, "invalid layout message");
      return layout;
    }
  }, {});

export const resolveSlots = (speakers, layout = {}) => {
  const slots = {
    battlers: [null, null],
    host: null,
    judges: Array(JUDGE_COUNT).fill(null),
  };
  const byId = new Map(speakers.map((speaker) => [speaker.id, speaker]));
  const placed = new Set();

  const toSlot = (speaker) => ({
    id: speaker.id,
    name: String(layout.names?.[speaker.id] || speaker.displayName || "").toUpperCase(),
    country: layout.countries?.[speaker.id] || speaker.metaData?.country || null,
  });

  const place = (list, index, speaker) => {
    if (!speaker || placed.has(speaker.id) || list[index]) return false;
    list[index] = toSlot(speaker);
    placed.add(speaker.id);
    return true;
  };

  const placeHost = (speaker) => {
    if (!speaker || placed.has(speaker.id) || slots.host) return false;
    slots.host = toSlot(speaker);
    placed.add(speaker.id);
    return true;
  };

  const placeInFirstFree = (list, speaker) =>
    list.some((slot, index) => !slot && place(list, index, speaker));

  // 1. Explicit assignment from the host app
  (layout.battlers || []).forEach((id, index) => {
    if (index < slots.battlers.length) place(slots.battlers, index, byId.get(id));
  });
  placeHost(byId.get(layout.host));
  (layout.judges || []).forEach((id, index) => {
    if (index < JUDGE_COUNT) place(slots.judges, index, byId.get(id));
  });

  // 2. Role from participant metaData
  speakers.forEach((speaker) => {
    const role = String(speaker.metaData?.role || "").toLowerCase();
    if (role === "battler") placeInFirstFree(slots.battlers, speaker);
    else if (role === "host") placeHost(speaker);
    else if (role === "judge") placeInFirstFree(slots.judges, speaker);
  });

  // 3. Everyone else by join order
  speakers.forEach((speaker) => {
    if (placed.has(speaker.id)) return;
    placeInFirstFree(slots.battlers, speaker) ||
      placeHost(speaker) ||
      placeInFirstFree(slots.judges, speaker);
  });

  return slots;
};

// Shrinks long names so they stay on one line inside a fixed-width bar.
export const fitFontSize = (text, maxSize, availableWidth) => {
  const length = Math.max(String(text || "").length, 1);
  return Math.min(maxSize, Math.floor(availableWidth / (length * 0.72)));
};
