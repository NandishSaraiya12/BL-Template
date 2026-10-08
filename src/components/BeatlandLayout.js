import { fitFontSize } from "../layout";
import { Flag, LiveBadge, Logo } from "./Branding";
import { ParticipantVideo, Avatar } from "./ParticipantView";

// Width available for a battler name inside its bar, per orientation.
const NAME_BAR_TEXT_WIDTH = { landscape: 330, portrait: 760 };

// Bevelled purple frame used by every tile and name bar.
const Frame = ({ className = "", children }) => (
  <div className={`frame ${className}`}>
    <div className="frame-glow" />
    <div className="frame-body">
      <div className="frame-line">
        <div className="frame-screen">{children}</div>
      </div>
    </div>
  </div>
);

const SlotVideo = ({ slot, placeholder, live }) => {
  if (!slot) return <div className="placeholder">{placeholder}</div>;
  return live ? (
    <ParticipantVideo participantId={slot.id} name={slot.name} />
  ) : (
    <Avatar name={slot.name} />
  );
};

const BattlerTile = ({ slot, side, live }) => (
  <Frame className={`slot battler-tile battler-tile-${side}`}>
    <SlotVideo slot={slot} placeholder="WAITING FOR BATTLER" live={live} />
  </Frame>
);

const BattlerName = ({ slot, side, orientation }) => {
  const name = slot?.name || "";
  return (
    <Frame className={`slot name-bar name-bar-${side}`}>
      <div className="name-bar-content">
        <Flag country={slot?.country} className="name-bar-flag" />
        <span
          className="name-bar-text"
          style={{
            fontSize: fitFontSize(name, 64, NAME_BAR_TEXT_WIDTH[orientation]),
          }}
        >
          {name}
        </span>
      </div>
    </Frame>
  );
};

const HostTile = ({ slot, live }) => (
  <div className="slot host">
    <div className="host-ring">
      <div className="host-screen">
        <SlotVideo slot={slot} placeholder="HOST" live={live} />
        <div className="host-shade" />
      </div>
    </div>
    {slot && (
      <div className="host-label">
        <div className="host-name">
          <Flag country={slot.country} />
          <span>{slot.name}</span>
        </div>
        <div className="host-role">HOST</div>
      </div>
    )}
  </div>
);

const JudgeTile = ({ slot, live }) => (
  <div className="judge">
    <Frame className="judge-tile">
      <SlotVideo slot={slot} placeholder="JUDGE" live={live} />
    </Frame>
    <div className="judge-label">
      <Flag country={slot?.country} />
      <span>{slot ? slot.name : "JUDGE"}</span>
    </div>
  </div>
);

// `live` = render real participant video (false for the demo preview).
export const BeatlandLayout = ({ slots, text, orientation, live = true }) => (
  <div className="beatland">
    <header className="slot header">
      <div className="header-category">{text.category}</div>
      <Logo />
      <div className="header-live">{text.live && <LiveBadge />}</div>
    </header>

    <BattlerTile slot={slots.battlers[0]} side="left" live={live} />
    <BattlerTile slot={slots.battlers[1]} side="right" live={live} />
    <HostTile slot={slots.host} live={live} />

    <BattlerName slot={slots.battlers[0]} side="left" orientation={orientation} />
    <Frame className="slot name-bar name-bar-center">
      <div className="name-bar-content">
        <span className="center-text">{text.centerText}</span>
      </div>
    </Frame>
    <BattlerName slot={slots.battlers[1]} side="right" orientation={orientation} />

    <div className="slot judges">
      {slots.judges.map((slot, index) => (
        <JudgeTile key={slot ? slot.id : `judge-${index}`} slot={slot} live={live} />
      ))}
    </div>

    <footer className="slot footer">
      {text.footer.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </footer>
  </div>
);
