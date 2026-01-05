<h3>
<img width="1024" height="246" alt="pixil-frame-0-4" src="https://github.com/user-attachments/assets/0b4770bc-bd89-433e-9c79-e38b815bfbeb" />

## GPIO
You can use your Flipper Zero for hardware exploration, firmware flashing, debugging, and fuzzing. Flipper Zero can be connected to hardware using its built-in GPIO pins, control hardware with buttons, run your code, and show debug messages on the screen. Flipper Zero can also be used as a USB to UART/SPI/I2C converter.



    Insert a microSD card to use the GPIO app

    Before using the GPIO app, make sure to update your Flipper Zero firmware with a microSD card inserted since Flipper Zero stores databases on a microSD card. For more information about the update process, visit the Firmware update page.  


<div class="warning flipper-callout">
    <div class="callout-header">Insert a microSD card to use the GPIO app</div>
    Before using the GPIO app, make sure to update your Flipper Zero firmware with a microSD card inserted since Flipper Zero stores databases on a microSD card. For more information about the update process, visit the <a href="https://docs.flipperzero.one/basics/firmware-update" onclick="next.router.push('https://docs.flipperzero.one/basics/firmware-update')"><u>Firmware update</u> page.  
</div>

      
## Pin layout
Flipper Zero has 18 pins on the top side, consisting of power supply pins and I/O pins. Power supply pins can be used to power your external modules. Input/output (I/O) pins are +3.3 V <br> tolerant for input and output. For more information, see 3.3 V and 5 V tolerance.

<p> Flipper Zero GPIO Pinout </p>

<img src="./otherFiles/GPIO/Flipper_Zero_GPIO_Pinout_v2.jpg" alt="FlipperGPIO" width="800"/><br>

<small>
    <a href="https://cdn.flipperzero.one/Flipper_Zero_GPIO_Pinout_v2.jpg">Image Source</a><br>
</small>

</div>

I/O pins connect external modules to the I/O pins of the STM32WB55 microcontroller through 51 Ohm resistors. All pins are electrostatic discharge (ESD) protected

## Installation
1. Navigate to QFlipper
2. Go to your SD card
3. Open the `GPIO` folder
4. Press "Upload"
Then you will have more working GPIO add-ons on your Flipper!
>[!IMPORTANT]
> If a file does not work properly, report it in discussions or create an issue.
