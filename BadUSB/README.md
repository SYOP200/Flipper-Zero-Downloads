<h3>
<img width="1024" height="246" alt="pixil-frame-0-4" src="https://github.com/user-attachments/assets/0b4770bc-bd89-433e-9c79-e38b815bfbeb" />

## BadUSB
Flipper Zero can act as a BadUSB device, recognized by computers as a Human Interface Device (HID), such as a keyboard or even a mouse. A BadUSB device can change system settings, open backdoors, retrieve data, initiate reverse shells, or do basically anything that can be achieved with physical access. It is done by executing a set of commands written in the Rubber Ducky Scripting Language, also known as DuckyScript. This set of commands is also called a payload.
## Flipper Zero scripting language
Before using your Flipper Zero as a BadUSB device, you need to write a payload in the `.txt` format in any common ASCII text editor using the scripting language. Flipper Zero can execute extended Rubber Ducky script syntax. The syntax is compatible with the classic Rubber Ducky Scripting Language 1.0 but provides additional commands and features, such as the ALT+Numpad input method, SysRq command, and more.
## Uploading new payloads
Once the payload is created, you can upload it to your Flipper Zero via qFlipper or Flipper Mobile App to the `SD Card/badusb/ folder`. The new payloads will be available in the Bad USB application.
>[!CAUTION]
> Make sure SD card is properly inserted when using BadUSB payloads.
