<h3>
<img width="1024" height="246" alt="pixil-frame-0-4" src="https://github.com/user-attachments/assets/0b4770bc-bd89-433e-9c79-e38b815bfbeb" />

## Infrared
Flipper Zero can interact with devices that use infrared (IR) light to send commands, such as TVs, air conditioners, multimedia systems, etc. With its built-in infrared module, Flipper Zero can learn and save infrared remotes and use its own universal remotes to control other devices.
## Infrared menu
You can access the Infrared application from the Main Menu. In the application, you can use universal remotes to control other devices, learn new remotes, and manage saved remotes.
- Universal Remotes: iterates over a dictionary of known protocols and sends the same command for all supported models. The dictionary is stored on the microSD card. This is also known as a brute force attack. Because Flipper Zero iterates over an entire dictionary, the process of sending signals takes few seconds.
- Learn New Remote: reads and saves signals from infrared remotes. Each button of a remote is saved separately.
- Saved Remotes: lists saved remotes, which can be edited and played back.
- GPIO Settings: sets signal output and power supply to an extenal IR transmitter.
## Infrared hardware
Flipper Zero has a built-in Infrared module consisting of an IR light transparent plastic window, three transmitting infrared LEDs, and an infrared receiver.



