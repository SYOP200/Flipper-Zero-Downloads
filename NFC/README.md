<h3>
<img width="1024" height="246" alt="pixil-frame-0-4" src="https://github.com/user-attachments/assets/0b4770bc-bd89-433e-9c79-e38b815bfbeb" />

## NFC
Flipper Zero supports NFC technology, which is implemented in public transport smart cards, access cards or tags, and digital business cards. These cards have complex protocols and support encryption, authentication, and full-fledged two-way data transfer. Flipper Zero has a built-in 13.56 MHz NFC module capable of reading, saving, and emulating NFC cards.
## NFC menu
You can access the NFC application from the Main Menu. In the application, you can interact with NFC cards, analyze readers, and generate NFC cards.
- Read: reads and saves NFC card’s data such as UID, SAK, ATQA, and stored data.
- Extract MF keys: emulates an NFC card to collect data (nonces) used to calculate keys attempted by a reader
- Saved: lists saved NFC cards, which can be emulated and renamed.
- Extra Actions: additional reading scripts, plugins, keys management, etc.
- Add Manually: generates new virtual NFC cards by manually entering card’s data.
## NFC hardware
Flipper Zero has a built-in NFC module based on an ST25R3916 NFC chip and a 13.56 MHz high-frequency antenna. The chip is used for high-frequency protocols and is responsible for reading and emulation of cards. <br>
The high-frequency 13.56 MHz antenna is placed on the Dual Band RFID antenna next to the low-frequency 125 kHz antenna. <br>
## Installation
1. Navigate to QFlipper
2. Go to your SD card
3. Open the `NFC` folder
4. Press "Upload"
Then you will have more working `NFC` files on your Flipper!
>[!IMPORTANT]
> If a file does not work properly, report it in discussions or create an issue.
