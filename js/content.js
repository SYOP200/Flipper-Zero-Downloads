/* ==========================================================================
   content.js
   All copy lives here, separate from rendering (app.js) and structure
   (index.html). To add a page: add one entry to NAV and one entry to PAGES.
   ========================================================================== */

const REPO_URL = "https://github.com/SYOP200/Flipper-Zero-Downloads";
const REPO_TREE = `${REPO_URL}/tree/main`;

/* Left-nav structure. `icon` keys map to the ICONS table in app.js. */
const NAV = [
  {
    label: "Guides",
    items: [
      { id: "about", title: "about", icon: "book" },
      { id: "installation", title: "installation", icon: "download" },
      { id: "terms", title: "terms-of-use", icon: "shield" },
      { id: "credits", title: "credits", icon: "users" },
    ],
  },
  {
    label: "Downloads",
    items: [
      { id: "firmware", title: "firmware", icon: "chip" },
      { id: "apps", title: "apps", icon: "grid" },
      { id: "gpio", title: "gpio", icon: "pin" },
      { id: "subghz", title: "sub-ghz", icon: "wave" },
      { id: "infrared", title: "infrared", icon: "wave" },
      { id: "nfc", title: "nfc", icon: "tag" },
      { id: "rfid", title: "rfid", icon: "tag" },
      { id: "badusb", title: "badusb", icon: "usb" },
      { id: "scripts", title: "scripts", icon: "terminal" },
      { id: "graphics", title: "graphics", icon: "image" },
      { id: "picopass", title: "picopass", icon: "tag" },
      { id: "subplaylist", title: "subplaylist", icon: "list" },
      { id: "unirf", title: "unirf", icon: "wave" },
      { id: "3dprints", title: "3d-prints", icon: "cube" },
      { id: "games", title: "games", icon: "game" },
    ],
  },
];

/* Flat order, used for prev/next footer links. */
const PAGE_ORDER = NAV.flatMap((g) => g.items.map((i) => i.id));

function folder(name) {
  return `${REPO_TREE}/${name}`;
}

/* Small inline icons used only inside callout boxes. Kept local to this
   file so content.js has no load-order dependency on app.js. */
const CALLOUT_ICON = {
  tip: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.4 1 1.2 1 2.05V17h6v-.25c0-.85.4-1.65 1-2.05A7 7 0 0 0 12 2Z"/></svg>',
  warn: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  danger: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v5"/><path d="M12 16h.01"/></svg>',
};

/* Small helpers so page bodies stay readable below. */
const callout = (kind, title, text) => `
  <div class="callout callout--${kind}">
    ${CALLOUT_ICON[kind] || ""}
    <p><strong>${title}</strong>${text}</p>
  </div>`;

const PAGES = {
  /* ---------------------------------------------------------- guides --- */

  about: {
    title: "About this repo",
    tag: "about",
    githubUrl: REPO_URL,
    lede:
      "A single, curated place to find the plugins, firmware, and files people actually use on their Flipper Zero — instead of hunting across a dozen scattered repos.",
    html: `
      <p>Useful Flipper Zero files tend to live in a hundred different places: a firmware here, an IR database there, a folder of BadUSB payloads somebody posted once in a Discord. This project pulls the commonly used pieces into one repository, organized by category, so you can find what you need without the archaeology.</p>

      ${callout("tip", "Who this is for", "New Flipper owners looking for a starting point, and returning users who just want the file without re-searching for it.")}

      <h2>What's inside</h2>
      <p>The repository is organized into folders by file type — firmware, apps, GPIO, sub-GHz, infrared, NFC, RFID, BadUSB, scripts, graphics, and a few smaller specialty folders. Use the sidebar to browse each category; every page here links straight to the matching folder on GitHub.</p>

      <h2>Ownership</h2>
      <p>Nothing in this collection is original work unless stated otherwise. Every file belongs to the creator who made it — see <code>Credits</code> for the list of authors and sources this project pulls from. This project only curates and organizes.</p>

      <h2>Project status</h2>
      <p>This is a community collection maintained by <a href="https://github.com/SYOP200" target="_blank" rel="noopener">@SYOP200</a> and updated as new files come in. Bug reports, missing-file reports, and suggestions are handled through GitHub Issues and Discussions.</p>
    `,
  },

  installation: {
    title: "Installation",
    tag: "installation",
    githubUrl: REPO_URL,
    lede:
      "Three ways to get files from this repository onto your Flipper Zero. Pick whichever matches the hardware you have on hand.",
    html: `
      <h2>Method 1 · SD card</h2>
      <p>The fastest and most reliable method, if you can get to the SD card directly.</p>
      <ol class="steps">
        <li>Clone or download and extract this repository to your computer.</li>
        <li>Open the downloaded folder in your file explorer.</li>
        <li>Remove the SD card from your Flipper and connect it to your computer.</li>
        <li>Copy the files you want into the matching folder on the SD card.</li>
        <li>Reinsert the SD card into your Flipper.</li>
      </ol>

      <h2>Method 2 · qFlipper</h2>
      ${callout("warn", "Slower for bulk transfers.", "Fine for a handful of files, but if you're copying the whole repository, use the SD card method instead — qFlipper can take a long time with large batches.")}
      <ol class="steps">
        <li>Clone or download and extract this repository to your computer.</li>
        <li>Connect your Flipper to your computer with a USB-C cable.</li>
        <li>Open <a href="https://flipperzero.one/update" target="_blank" rel="noopener">qFlipper</a> and confirm it shows "Connected."</li>
        <li>Make sure your Flipper's firmware is up to date, then reboot it before continuing.</li>
        <li>Open the File Manager tab in qFlipper and browse into <code>SD Card</code>, then the folder matching the file type.</li>
        <li>Drag the files you want from your computer into that folder.</li>
      </ol>

      <h2>Method 3 · Mobile app</h2>
      <ol class="steps">
        <li>Save the files you want to your phone (for example, to your Downloads folder).</li>
        <li>Open the Flipper mobile app, go to <code>Connected → Options</code>, and turn on Experimental Options.</li>
        <li>Open the new File Manager entry, navigate to <code>ext → (file type)</code>, and tap upload.</li>
        <li>Choose the file from your phone's Downloads folder.</li>
        <li>The file will appear on your Flipper under <code>(file type) → Saved</code>.</li>
      </ol>

      ${callout("tip", "Something not working?", "If a file doesn't load correctly on your Flipper, please file it as an issue on GitHub so it can be fixed or removed.")}
    `,
  },

  terms: {
    title: "Terms of use",
    tag: "terms-of-use",
    githubUrl: `${REPO_URL}#terms-of-use`,
    lede: "Read this before you use anything from the repository.",
    html: `
      ${callout("danger", "Experimental use only.", "These files are intended for learning, testing on your own hardware, and legitimate security research — not for illegal activity. Use them lawfully and responsibly.")}

      <ul>
        <li>Only test on devices, cards, and systems you own or have explicit permission to test.</li>
        <li>Using these files against other people's property without permission is illegal in most places — don't do it.</li>
        <li>This project is developed independently and has no affiliation with Flipper Devices.</li>
        <li>You are responsible for checking your local laws before using any file in this repository.</li>
        <li>The maintainers are not responsible for damage, legal consequences, or misuse resulting from these files.</li>
      </ul>

      <h2>No warranty</h2>
      <p>Files are provided as-is, gathered from the community, and are up to date as of when they were added. They may stop working after a firmware update, and some are experimental by nature.</p>

      <h2>License</h2>
      <p>The repository is distributed under the <strong>GNU General Public License v3.0</strong>. You're free to copy and redistribute it under the same terms; individual files may carry their own license from their original author — see <code>Credits</code>.</p>
    `,
  },

  credits: {
    title: "Credits & contributors",
    tag: "credits",
    githubUrl: `${REPO_URL}#credits`,
    lede:
      "None of this exists without the people who originally built, wrote, or reverse-engineered these files. This page is the paper trail.",
    html: `
      <p>This repository curates and organizes work from many corners of the Flipper Zero community. Where a source is known, it's credited below — if you notice a missing or incorrect credit, please open an issue.</p>

      <h2>Sources</h2>
      <table>
        <tr><th>Source</th><th>Provides</th></tr>
        <tr><td>Momentum Firmware</td><td>Firmware builds</td></tr>
        <tr><td>Xtreme Firmware</td><td>Firmware builds</td></tr>
        <tr><td><a href="https://github.com/Lucaslhm/Flipper-IRDB" target="_blank" rel="noopener">Flipper IRDB</a></td><td>Infrared files</td></tr>
        <tr><td><a href="https://github.com/beigeworm/BadUSB-Files-For-FlipperZero" target="_blank" rel="noopener">BadUSB-Files-For-FlipperZero</a></td><td>BadUSB payloads</td></tr>
        <tr><td><a href="https://github.com/hnesk/flipper-raw-rfid" target="_blank" rel="noopener">Flipper-Raw-RFID</a></td><td>RFID files</td></tr>
        <tr><td>@UberGuidoZ</td><td>Various files</td></tr>
        <tr><td><a href="https://github.com/jkctech/Flipper-Zero-Scripts" target="_blank" rel="noopener">Flipper Zero Scripts</a> (JKCTech)</td><td>Scripts &amp; payloads</td></tr>
        <tr><td><a href="https://docs.flipper.net" target="_blank" rel="noopener">Flipper Docs</a></td><td>Reference information &amp; images</td></tr>
        <tr><td><a href="https://github.com/PINGEQUA/Flipper-Zero-5G-death" target="_blank" rel="noopener">Flipper Deauth</a></td><td>Application file</td></tr>
        <tr><td><a href="https://github.com/RogueMaster/awesome-flipperzero-withModules" target="_blank" rel="noopener">Awesome-Flipperzero</a></td><td>Various files</td></tr>
        <tr><td>@I-Am-Jakoby</td><td>BadUSB payloads &amp; scripts</td></tr>
        <tr><td>@kbembedded</td><td>GPIO files</td></tr>
        <tr><td><a href="https://github.com/w0lfzk1n/Flipper-Zero-NFC-Trolls" target="_blank" rel="noopener">Flipper Zero NFC Trolls</a></td><td>NFC files</td></tr>
        <tr><td>Flipper-zero-files</td><td>GPIO files</td></tr>
        <tr><td><a href="https://github.com/ESurge/flipperzero-firmware-unirfremix" target="_blank" rel="noopener">FlipperZero-Firmware-UniRFRemix</a></td><td>UniRF files &amp; information</td></tr>
        <tr><td>@SYOP200</td><td>IR remote files</td></tr>
        <tr><td><a href="https://github.com/ADolbyB/flipper-zero-files" target="_blank" rel="noopener">flipper-zero-files</a></td><td>Games</td></tr>
      </table>

      <h2>Maintainer</h2>
      <p>Files gathered and organized by <a href="https://github.com/SYOP200" target="_blank" rel="noopener">@SYOP200</a>.</p>

      ${callout("tip", "Want to contribute?", "Suggestions, missing files, and organization ideas are always welcome — open a discussion or pull request on GitHub.")}
    `,
  },

  /* -------------------------------------------------------- downloads --- */

  firmware: {
    title: "Firmware",
    tag: "firmware",
    githubUrl: folder("Firmware"),
    lede: "Alternative and stock-adjacent firmware builds for the Flipper Zero and the Wi-Fi devboard.",
    html: `
      <p>This folder collects firmware options beyond the official build, along with Wi-Fi devboard firmware. Each build trades off differently between stability, features, and how closely it tracks the official firmware.</p>
      <ul>
        <li><strong>Momentum</strong> — feature-rich, frequently updated, closely follows official firmware conventions.</li>
        <li><strong>Xtreme</strong> — heavily customizable, popular for its plugin ecosystem.</li>
      </ul>
      ${callout("warn", "Flash at your own risk.", "Always back up your device before flashing new firmware, and read that firmware's own documentation for install steps and known issues.")}
      <p>See <code>Installation</code> for how to get files onto your device once you've picked a build.</p>
    `,
  },

  apps: {
    title: "Apps",
    tag: "apps",
    githubUrl: folder("Apps"),
    lede: "Third-party applications and plugins that extend what your Flipper Zero can do.",
    html: `
      <p>Community-built apps that aren't part of the default firmware — utilities, tools, and add-ons that install like any other Flipper app. Requirements vary by app; some need a specific firmware or firmware version to run correctly.</p>
      ${callout("tip", "Check compatibility first.", "Before copying an app over, check which firmware it was built for. An app built for one firmware fork may not run on another.")}
    `,
  },

  gpio: {
    title: "GPIO",
    tag: "gpio",
    githubUrl: folder("GPIO"),
    lede: "GPIO scripts, pinouts, and hardware-interfacing files for the Flipper's expansion header.",
    html: `
      <p>Files here are for working with the Flipper's GPIO pins — driving external hardware, reading sensors, or interfacing with add-on modules connected to the pin header.</p>
      ${callout("warn", "Know your wiring.", "GPIO mistakes can damage your Flipper or connected hardware. Double-check pinouts and voltage levels before connecting anything new.")}
    `,
  },

  subghz: {
    title: "Sub-GHz",
    tag: "sub-ghz",
    githubUrl: folder("Sub ghz. files"),
    lede: "Sub-GHz signal files and remote captures for garage doors, gates, and other RF-controlled devices.",
    html: `
      <p>A collection of sub-GHz remote files and playback scripts. These interact with real-world RF-controlled hardware, so treat them the same way you'd treat a physical remote.</p>
      ${callout("danger", "Your own hardware only.", "Only use these files with devices you own or are explicitly authorized to test. Sub-GHz replay against someone else's property is illegal in most jurisdictions.")}
    `,
  },

  infrared: {
    title: "Infrared",
    tag: "infrared",
    githubUrl: folder("Infrared"),
    lede: "Infrared remote files for TVs, air conditioners, and other IR-controlled devices.",
    html: `
      <p>A large library of IR remote codes contributed by the community, plus the maintainer's own captures. Files are organized by device brand or type where possible.</p>
      <p>If a code doesn't work for your exact model, IR devices are often close enough between models in the same product line that a similar file will still work.</p>
    `,
  },

  nfc: {
    title: "NFC",
    tag: "nfc",
    githubUrl: folder("NFC"),
    lede: "Pre-made NFC card dumps and files for testing and experimentation.",
    html: `
      <p>NFC card files for use with the Flipper's NFC reader/emulator. Useful for learning how different NFC card types are structured, and for testing your own cards and access systems.</p>
      ${callout("danger", "Emulating other people's cards is illegal.", "Only read, dump, or emulate cards and access badges that belong to you or that you have written permission to test.")}
    `,
  },

  rfid: {
    title: "RFID",
    tag: "rfid",
    githubUrl: folder("RFID"),
    lede: "Low-frequency RFID tag files for the Flipper's built-in RFID reader.",
    html: `
      <p>Pre-made RFID tag files for common LF card formats. Handy for testing reader compatibility or replacing a lost fob you're authorized to duplicate.</p>
      ${callout("warn", "Same rule as NFC.", "Only clone or emulate tags you own or have explicit permission to duplicate.")}
    `,
  },

  badusb: {
    title: "BadUSB",
    tag: "badusb",
    githubUrl: folder("BadUSB"),
    lede: "Keystroke-injection payloads (Ducky Script) for the Flipper's BadUSB feature.",
    html: `
      <p>A payload library for the Flipper's BadUSB mode, covering common demonstrations and tools used in physical security testing and red-team exercises.</p>
      ${callout("danger", "For authorized testing only.", "Running these against a computer without the owner's permission is unauthorized access in most places — this is intended for your own machines or sanctioned pentesting engagements.")}
    `,
  },

  scripts: {
    title: "Scripts",
    tag: "scripts",
    githubUrl: folder("Scripts"),
    lede: "Standalone scripts and utility payloads that don't fit neatly into another category.",
    html: `
      <p>A grab-bag of small scripts contributed by the community — automation helpers, one-off utilities, and experiments. Check each script's own comments for usage notes before running it.</p>
    `,
  },

  graphics: {
    title: "Graphics",
    tag: "graphics",
    githubUrl: `${REPO_URL}/tree/dev/Graphics`,
    lede: "Animations, icons, and visual assets to personalize your Flipper's screen.",
    html: `
      <p>Custom boot animations, dolphin replacements, and icon packs for the Flipper's display. Purely cosmetic — safe to try and easy to swap back if you don't like one.</p>
    `,
  },

  picopass: {
    title: "Picopass",
    tag: "picopass",
    githubUrl: `${REPO_URL}/tree/dev/picopass`,
    lede: "Files for working with iCLASS / PicoPass cards, a common access-control card format.",
    html: `
      <p>PicoPass support requires a compatible firmware feature or app, since it isn't part of every build. Check your firmware's documentation if reading doesn't work out of the box.</p>
    `,
  },

  subplaylist: {
    title: "SubPlaylist",
    tag: "subplaylist",
    githubUrl: `${REPO_URL}/tree/dev/subplaylist`,
    lede: "Pre-built sub-GHz playlists for queuing up multiple signals in sequence.",
    html: `
      <p>Playlist files that let a compatible sub-GHz app step through several signals in a row, instead of loading them one at a time.</p>
    `,
  },

  unirf: {
    title: "UniRF",
    tag: "unirf",
    githubUrl: `${REPO_URL}/tree/dev/unirf`,
    lede: "Files for the UniRF Remix app, a universal RF remote interface for the Flipper.",
    html: `
      <p>Configuration and signal files built for use with the UniRF Remix application. See that project's own documentation for how the file format and remote layout work.</p>
    `,
  },

  "3dprints": {
    title: "3D Print Files",
    tag: "3d-prints",
    githubUrl: folder("3d print files"),
    lede: "Cases, mounts, and accessories you can 3D print for your Flipper Zero.",
    html: `
      <p>STL and print-ready files for Flipper accessories — cases, stands, and add-on mounts. Print settings vary by file; check for a readme in the specific model's folder where one is provided.</p>
    `,
  },

  games: {
    title: "Games",
    tag: "games",
    githubUrl: folder("Games"),
    lede: "A collection of community-favorite games that run on the Flipper Zero.",
    html: `
      <p>Because sometimes you just want to play something while your Flipper sits on your desk. This folder collects some of the most-loved community games.</p>
    `,
  },
};
