<img width="1024" height="246" alt="pixil-frame-0-4" src="https://github.com/user-attachments/assets/0b4770bc-bd89-433e-9c79-e38b815bfbeb" />

> **Navigation**
>
> [Overview](overview.md) | [Apps](apps.md) | [BadUSB](badusb.md) | [Firmware](firmware.md) | [GPIO](gpio.md) |
> [Graphics](graphics.md) | [Infrared](infrared.md) | [NFC](nfc.md) | [RFID](rfid.md) | [PicoPass](picopass.md) |
> [Scripts](scripts.md) | [Sub-GHz](subghz.md) | [UniRF](unirf.md) | [Playlists](playlists.md)

---

# 🧩 Apps

Custom apps extend your Flipper.

## 📂 Path


Restart Flipper → find them under **Applications**.

## 📝 Tips

- include description
- add screenshots when possible
- respect licenses

# App Development
# 🐬 Flipper Zero Application Development Guide

## Introduction

The Flipper Zero is a portable multi-tool for hackers, cybersecurity enthusiasts, and developers. It's a versatile device that can interact with various digital systems including RFID, NFC, infrared, Bluetooth, and more. This guide will help you get started with creating your own applications (also called "FAPs" - Flipper Application Packages) for the Flipper Zero.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Understanding Flipper Zero Architecture](#understanding-flipper-zero-architecture)
3. [Setting Up Your Development Environment](#setting-up-your-development-environment)
4. [Your First Application](#your-first-application)
5. [Application Structure](#application-structure)
6. [Key Concepts](#key-concepts)
7. [Building and Deploying](#building-and-deploying)
8. [Resources](#resources)

---

## Prerequisites

Before you start developing for Flipper Zero, you should have:

- **Basic C programming knowledge** - Flipper Zero apps are written in C
- **A Flipper Zero device** - For testing your applications
- **A computer** - Windows, macOS, or Linux
- **Git installed** - For cloning the firmware repository
- **USB cable** - To connect your Flipper Zero to your computer

---

## Understanding Flipper Zero Architecture

The Flipper Zero runs on custom firmware that provides an application framework. Here's how it's organized:

```
┌─────────────────────────────────────┐
│     Flipper Zero Hardware           │
│  (STM32 MCU + Peripherals)          │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│     Flipper Firmware (Core)         │
│  - Hardware Abstraction Layer       │
│  - System Services                  │
│  - API Framework                    │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│     Your Application (FAP)          │
│  - Uses Firmware APIs               │
│  - Implements Custom Logic          │
│  - Provides User Interface          │
└─────────────────────────────────────┘
```

---

## Setting Up Your Development Environment

### Step 1: Clone the Firmware Repository

```bash
git clone --recursive https://github.com/flipperdevices/flipperzero-firmware.git
cd flipperzero-firmware
```

### Step 2: Install Dependencies

**For Linux/macOS:**
```bash
./fbt
```

**For Windows:**
```bash
.\fbt.cmd
```

The `fbt` (Flipper Build Tool) will automatically install required dependencies.

### Step 3: Update Firmware SDK

```bash
./fbt update_all
```

This ensures you have the latest SDK and tools for development.

---

## Your First Application

Let's create a simple "Hello World" application for Flipper Zero.

### Application Directory Structure

Create a new folder in `applications_user`:

```
flipperzero-firmware/
└── applications_user/
    └── hello_world/
        ├── application.fam
        └── hello_world.c
```

### application.fam (Metadata)

This file describes your application to the build system:

```python
App(
    appid="hello_world",
    name="Hello World",
    apptype=FlipperAppType.EXTERNAL,
    entry_point="hello_world_app",
    stack_size=2 * 1024,
    fap_category="Examples",
    fap_icon="icon.png",  # Optional: 10x10 PNG icon
)
```

### hello_world.c (Application Code)

```c
#include <furi.h>
#include <gui/gui.h>

// Callback function to draw on the screen
static void app_draw_callback(Canvas* canvas, void* ctx) {
    UNUSED(ctx);
    
    canvas_clear(canvas);
    canvas_set_font(canvas, FontPrimary);
    canvas_draw_str(canvas, 25, 30, "Hello World!");
}

// Callback function to handle input events
static void app_input_callback(InputEvent* input_event, void* ctx) {
    furi_assert(ctx);
    FuriMessageQueue* event_queue = ctx;
    furi_message_queue_put(event_queue, input_event, FuriWaitForever);
}

// Main application entry point
int32_t hello_world_app(void* p) {
    UNUSED(p);
    
    // Create event queue for input events
    FuriMessageQueue* event_queue = furi_message_queue_alloc(8, sizeof(InputEvent));
    
    // Set up viewport and register callbacks
    ViewPort* view_port = view_port_alloc();
    view_port_draw_callback_set(view_port, app_draw_callback, NULL);
    view_port_input_callback_set(view_port, app_input_callback, event_queue);
    
    // Register viewport with GUI
    Gui* gui = furi_record_open(RECORD_GUI);
    gui_add_view_port(gui, view_port, GuiLayerFullscreen);
    
    // Event loop
    InputEvent event;
    bool running = true;
    
    while(running) {
        if(furi_message_queue_get(event_queue, &event, 100) == FuriStatusOk) {
            if(event.type == InputTypePress && event.key == InputKeyBack) {
                running = false;
            }
        }
    }
    
    // Cleanup
    gui_remove_view_port(gui, view_port);
    view_port_free(view_port);
    furi_message_queue_free(event_queue);
    furi_record_close(RECORD_GUI);
    
    return 0;
}
```

---

## Application Structure

Every Flipper Zero application follows this pattern:

### Visual Flow Diagram

```
Start App
    ↓
Initialize Resources
(ViewPort, GUI, Queues)
    ↓
Register Callbacks
(Draw, Input)
    ↓
Enter Event Loop ←──┐
    ↓               │
Process Events      │
    ↓               │
Exit Condition? ────┘
    │ Yes
    ↓
Cleanup Resources
    ↓
Exit App
```

---

## Key Concepts

### 1. ViewPort and Canvas

The **ViewPort** is your application's drawing area. The **Canvas** is where you actually draw:

```c
// Drawing examples
canvas_clear(canvas);                          // Clear screen
canvas_draw_str(canvas, x, y, "Text");        // Draw text
canvas_draw_line(canvas, x1, y1, x2, y2);     // Draw line
canvas_draw_box(canvas, x, y, width, height); // Draw filled rectangle
canvas_draw_frame(canvas, x, y, w, h);        // Draw empty rectangle
```

### 2. Input Handling

Flipper Zero has 5 directional buttons and a back button:

```c
InputKey options:
- InputKeyUp
- InputKeyDown
- InputKeyLeft
- InputKeyRight
- InputKeyOk
- InputKeyBack
```

### 3. Event Queue

Events (like button presses) are handled through message queues:

```c
FuriMessageQueue* queue = furi_message_queue_alloc(8, sizeof(InputEvent));
furi_message_queue_get(queue, &event, timeout);
```

### 4. Memory Management

Always clean up resources:

```c
// Allocate
ViewPort* vp = view_port_alloc();

// Use...

// Free
view_port_free(vp);
```

---

## Building and Deploying

### Build Your Application

```bash
./fbt fap_hello_world
```

This creates a `.fap` file in `build/f7-firmware-D/.extapps/`

### Deploy to Flipper Zero

**Option 1: Via USB**
```bash
./fbt launch_app APPSRC=applications_user/hello_world
```

**Option 2: Manual Copy**
1. Connect Flipper Zero via USB
2. Copy the `.fap` file to `/ext/apps/Examples/` on the device
3. Disconnect and navigate to Apps → Examples → Hello World

### Debug Your Application

```bash
./fbt debug_app APPSRC=applications_user/hello_world
```

---

## Resources

### Official Documentation
- [Flipper Zero Developer Documentation](https://developer.flipper.net/)
- [Firmware GitHub Repository](https://github.com/flipperdevices/flipperzero-firmware)
- [API Reference](https://developer.flipper.net/flipperzero/doxygen/)

### Community Resources
- [Awesome Flipper Zero](https://github.com/djsime1/awesome-flipperzero) - Curated list of resources
- [Flipper Zero Discord](https://flipperzero.one/discord) - Community support
- [Flipper Forum](https://forum.flipperzero.one/) - Official forum

### Example Applications
- Check the `applications/examples` folder in the firmware repository
- Browse community apps on [Flipper Application Catalog](https://lab.flipper.net/)

---

## Next Steps

Once you're comfortable with the basics:

1. **Explore the API** - Study the firmware's API documentation
2. **Use Hardware Features** - Try NFC, RFID, Infrared, GPIO
3. **Study Example Apps** - Learn from existing applications in the firmware
4. **Join the Community** - Share your apps and get feedback
5. **Contribute** - Submit your apps to the community catalog

---

## Tips for Beginners

- Start simple and gradually add features
- Use the debugger to understand program flow
- Read existing application code for patterns
- Test frequently on the actual device
- Keep backups of your Flipper Zero settings
- Join the community for help and inspiration

Happy coding! 🐬

---

---

# 🔧 Advanced Developer Section

This section provides detailed technical information for experienced developers who want to create sophisticated Flipper Zero applications.

---

## Advanced Architecture Deep Dive

### Firmware Architecture Layers

```
┌──────────────────────────────────────────────────────────┐
│                   Application Layer                       │
│  - External Apps (.fap)                                   │
│  - Built-in Apps                                          │
│  - Services (Notifications, Storage, etc.)                │
└─────────────────────┬────────────────────────────────────┘
                      │
┌─────────────────────▼────────────────────────────────────┐
│                   FURI (Flipper Universal Registry        │
│                        Implementation)                    │
│  - OS Abstraction Layer                                   │
│  - Resource Management                                    │
│  - Inter-Process Communication                            │
│  - Threading & Synchronization                            │
└─────────────────────┬────────────────────────────────────┘
                      │
┌─────────────────────▼────────────────────────────────────┐
│                   FreeRTOS Layer                          │
│  - Task Scheduler                                         │
│  - Memory Management                                      │
│  - Queues, Semaphores, Mutexes                           │
└─────────────────────┬────────────────────────────────────┘
                      │
┌─────────────────────▼────────────────────────────────────┐
│                   Hardware Abstraction Layer              │
│  - STM32 HAL                                              │
│  - Driver Layer (SPI, I2C, UART, GPIO, etc.)             │
└─────────────────────┬────────────────────────────────────┘
                      │
┌─────────────────────▼────────────────────────────────────┐
│                   Hardware                                │
│  STM32WB55 (Cortex-M4F + Cortex-M0+ for BLE)             │
└──────────────────────────────────────────────────────────┘
```

### Memory Layout

**Flash Memory (1MB):**
```
0x08000000 ├─────────────────┐
           │ Bootloader       │ 64KB
0x08010000 ├─────────────────┤
           │ Firmware         │ ~928KB
           │ - Core System    │
           │ - Built-in Apps  │
           │ - Resources      │
0x080F0000 ├─────────────────┤
           │ Reserved         │ 32KB
0x08100000 └─────────────────┘
```

**RAM (256KB):**
```
0x20000000 ├─────────────────┐
           │ System RAM       │ ~200KB
           │ - Stack          │
           │ - Heap           │
           │ - Static Data    │
0x20030000 ├─────────────────┤
           │ Shared RAM       │ 32KB
           │ (For BLE Core)   │
0x20038000 └─────────────────┘
```

**External Apps:**
- Loaded from SD card (`/ext/apps/`)
- Run in isolated memory space
- Limited to ~64KB per app (configurable)
- Use ELF format with Position Independent Code (PIC)

---

## FURI Framework Deep Dive

### Core FURI Concepts

FURI is Flipper's custom abstraction layer over FreeRTOS. Understanding FURI is critical for advanced development.

#### 1. Records System

Records are named resources that can be shared between applications:

```c
// Opening a record (returns pointer to service)
Gui* gui = furi_record_open(RECORD_GUI);
NotificationApp* notifications = furi_record_open(RECORD_NOTIFICATION);
Storage* storage = furi_record_open(RECORD_STORAGE);

// Using the record...

// Always close when done
furi_record_close(RECORD_GUI);
furi_record_close(RECORD_NOTIFICATION);
furi_record_close(RECORD_STORAGE);
```

**Common Records:**
- `RECORD_GUI` - Graphical user interface
- `RECORD_NOTIFICATION` - LED, vibration, speaker
- `RECORD_STORAGE` - File system access
- `RECORD_DIALOGS` - System dialogs (file picker, text input)
- `RECORD_DOLPHIN` - Dolphin state management
- `RECORD_BT` - Bluetooth service
- `RECORD_EXPANSION` - GPIO expansion module

#### 2. Threading Model

```c
// Thread creation
FuriThread* thread = furi_thread_alloc();
furi_thread_set_name(thread, "WorkerThread");
furi_thread_set_stack_size(thread, 2048);
furi_thread_set_context(thread, my_context);
furi_thread_set_callback(thread, worker_thread_callback);
furi_thread_start(thread);

// Worker callback
int32_t worker_thread_callback(void* context) {
    MyContext* ctx = context;
    
    while(ctx->running) {
        // Do work
        furi_delay_ms(100);
    }
    
    return 0;
}

// Cleanup
furi_thread_join(thread);
furi_thread_free(thread);
```

**Thread Priorities:**
```c
FuriThreadPriorityIdle      = 1,  // Lowest
FuriThreadPriorityLowest    = 14,
FuriThreadPriorityLow       = 15,
FuriThreadPriorityNormal    = 16, // Default for apps
FuriThreadPriorityHigh      = 17,
FuriThreadPriorityHighest   = 18,
FuriThreadPriorityIsr       = 31  // ISR deferred processing
```

#### 3. Message Queues vs Stream Buffers

**Message Queues** (for structured data):
```c
typedef struct {
    EventType type;
    int32_t value;
} MyEvent;

FuriMessageQueue* queue = furi_message_queue_alloc(8, sizeof(MyEvent));

// Producer
MyEvent event = {.type = EVENT_DATA, .value = 42};
furi_message_queue_put(queue, &event, FuriWaitForever);

// Consumer
MyEvent received;
if(furi_message_queue_get(queue, &received, 1000) == FuriStatusOk) {
    // Process event
}

furi_message_queue_free(queue);
```

**Stream Buffers** (for continuous data):
```c
FuriStreamBuffer* stream = furi_stream_buffer_alloc(1024, 1);

// Write data
uint8_t data[] = {0x01, 0x02, 0x03};
furi_stream_buffer_send(stream, data, sizeof(data), FuriWaitForever);

// Read data
uint8_t buffer[64];
size_t received = furi_stream_buffer_receive(stream, buffer, sizeof(buffer), 1000);

furi_stream_buffer_free(stream);
```

#### 4. Mutexes and Semaphores

```c
// Mutex for protecting shared resources
FuriMutex* mutex = furi_mutex_alloc(FuriMutexTypeNormal);

furi_mutex_acquire(mutex, FuriWaitForever);
// Critical section - modify shared data
furi_mutex_release(mutex);

furi_mutex_free(mutex);

// Semaphore for signaling
FuriSemaphore* semaphore = furi_semaphore_alloc(1, 0);

// Signal from one thread
furi_semaphore_release(semaphore);

// Wait in another thread
furi_semaphore_acquire(semaphore, FuriWaitForever);

furi_semaphore_free(semaphore);
```

---

## Advanced GUI Programming

### View Framework

The View framework provides a higher-level abstraction than raw ViewPorts:

```c
#include <gui/view.h>

// Custom view model
typedef struct {
    int counter;
    char text[32];
} MyViewModel;

// Draw callback
void my_view_draw_callback(Canvas* canvas, void* model) {
    MyViewModel* m = model;
    
    canvas_clear(canvas);
    canvas_draw_str(canvas, 0, 10, m->text);
    
    char buf[32];
    snprintf(buf, sizeof(buf), "Count: %d", m->counter);
    canvas_draw_str(canvas, 0, 25, buf);
}

// Input callback
bool my_view_input_callback(InputEvent* event, void* context) {
    furi_assert(context);
    
    if(event->type == InputTypePress) {
        // Update model with_view_model
        with_view_model(
            view,
            MyViewModel* model,
            { model->counter++; },
            true  // true = trigger redraw
        );
        return true;  // Event consumed
    }
    
    return false;  // Event not consumed
}

// Create and configure view
View* view = view_alloc();
view_allocate_model(view, ViewModelTypeLocking, sizeof(MyViewModel));
view_set_draw_callback(view, my_view_draw_callback);
view_set_input_callback(view, my_view_input_callback);

// Initialize model
with_view_model(
    view,
    MyViewModel* model,
    {
        model->counter = 0;
        strcpy(model->text, "Hello!");
    },
    false
);
```

### ViewDispatcher for Multiple Views

```c
#include <gui/view_dispatcher.h>

typedef enum {
    ViewMain,
    ViewSettings,
    ViewAbout
} ViewId;

ViewDispatcher* view_dispatcher = view_dispatcher_alloc();
view_dispatcher_enable_queue(view_dispatcher);

// Create views
View* view_main = view_alloc();
View* view_settings = view_alloc();
View* view_about = view_alloc();

// Add views to dispatcher
view_dispatcher_add_view(view_dispatcher, ViewMain, view_main);
view_dispatcher_add_view(view_dispatcher, ViewSettings, view_settings);
view_dispatcher_add_view(view_dispatcher, ViewAbout, view_about);

// Attach to GUI
Gui* gui = furi_record_open(RECORD_GUI);
view_dispatcher_attach_to_gui(view_dispatcher, gui, ViewDispatcherTypeFullscreen);

// Switch views
view_dispatcher_switch_to_view(view_dispatcher, ViewMain);

// Run event loop
view_dispatcher_run(view_dispatcher);

// Cleanup
view_dispatcher_remove_view(view_dispatcher, ViewMain);
view_dispatcher_remove_view(view_dispatcher, ViewSettings);
view_dispatcher_remove_view(view_dispatcher, ViewAbout);
view_dispatcher_free(view_dispatcher);
furi_record_close(RECORD_GUI);
```

### Scene Manager for Complex Navigation

```c
#include <gui/scene_manager.h>

typedef enum {
    SceneMain,
    SceneSettings,
    SceneAbout,
    SceneCount
} SceneId;

// Scene handlers
void scene_main_on_enter(void* context);
bool scene_main_on_event(void* context, SceneManagerEvent event);
void scene_main_on_exit(void* context);

// Scene handler arrays
void (*const scene_on_enter_handlers[])(void*) = {
    scene_main_on_enter,
    scene_settings_on_enter,
    scene_about_on_enter,
};

bool (*const scene_on_event_handlers[])(void*, SceneManagerEvent) = {
    scene_main_on_event,
    scene_settings_on_event,
    scene_about_on_event,
};

void (*const scene_on_exit_handlers[])(void*) = {
    scene_main_on_exit,
    scene_settings_on_exit,
    scene_about_on_exit,
};

// Scene manager configuration
const SceneManagerHandlers scene_handlers = {
    .on_enter_handlers = scene_on_enter_handlers,
    .on_event_handlers = scene_on_event_handlers,
    .on_exit_handlers = scene_on_exit_handlers,
    .scene_num = SceneCount,
};

// Create scene manager
SceneManager* scene_manager = scene_manager_alloc(&scene_handlers, context);

// Navigate scenes
scene_manager_next_scene(scene_manager, SceneSettings);
scene_manager_previous_scene(scene_manager);
scene_manager_search_and_switch_to_previous_scene(scene_manager, SceneMain);

// Cleanup
scene_manager_free(scene_manager);
```

---

## File System Operations

### Storage API

```c
#include <storage/storage.h>

Storage* storage = furi_record_open(RECORD_STORAGE);

// Check if SD card is present
FS_Error sd_status = storage_sd_status(storage);
if(sd_status != FSE_OK) {
    // Handle SD card error
}

// Common paths
#define APP_DATA_PATH(name) EXT_PATH("apps_data/" name)
#define APP_ASSETS_PATH(name) EXT_PATH("apps_assets/" name)

// Ensure directory exists
storage_common_mkdir(storage, APP_DATA_PATH("myapp"));

// Write file
File* file = storage_file_alloc(storage);
if(storage_file_open(file, APP_DATA_PATH("myapp/config.txt"), FSAM_WRITE, FSOM_CREATE_ALWAYS)) {
    const char* data = "key=value\n";
    storage_file_write(file, data, strlen(data));
    storage_file_close(file);
}
storage_file_free(file);

// Read file
file = storage_file_alloc(storage);
if(storage_file_open(file, APP_DATA_PATH("myapp/config.txt"), FSAM_READ, FSOM_OPEN_EXISTING)) {
    uint64_t size = storage_file_size(file);
    char* buffer = malloc(size + 1);
    
    storage_file_read(file, buffer, size);
    buffer[size] = '\0';
    
    // Process buffer
    
    free(buffer);
    storage_file_close(file);
}
storage_file_free(file);

// Directory iteration
File* dir = storage_file_alloc(storage);
if(storage_dir_open(dir, APP_DATA_PATH("myapp"))) {
    FileInfo file_info;
    char name[256];
    
    while(storage_dir_read(dir, &file_info, name, sizeof(name))) {
        if(file_info_is_dir(&file_info)) {
            // Directory
        } else {
            // File
            FURI_LOG_I("TAG", "File: %s, Size: %llu", name, file_info.size);
        }
    }
    
    storage_dir_close(dir);
}
storage_file_free(dir);

furi_record_close(RECORD_STORAGE);
```

### Stream API for Buffered I/O

```c
#include <toolbox/stream/file_stream.h>

Stream* stream = file_stream_alloc(storage);

// Write with buffering
if(file_stream_open(stream, APP_DATA_PATH("myapp/data.bin"), FSAM_WRITE, FSOM_CREATE_ALWAYS)) {
    uint32_t data = 0x12345678;
    stream_write_varint(stream, data);  // Variable-length integer
    stream_write_string(stream, "Hello!");
    
    uint8_t bytes[] = {0xAA, 0xBB, 0xCC};
    stream_write(stream, bytes, sizeof(bytes));
    
    file_stream_close(stream);
}

// Read with buffering
if(file_stream_open(stream, APP_DATA_PATH("myapp/data.bin"), FSAM_READ, FSOM_OPEN_EXISTING)) {
    uint32_t data;
    stream_read_varint(stream, &data);
    
    FuriString* str = furi_string_alloc();
    stream_read_string(stream, str);
    
    uint8_t bytes[3];
    stream_read(stream, bytes, sizeof(bytes));
    
    furi_string_free(str);
    file_stream_close(stream);
}

stream_free(stream);
```

---

## Hardware Interfacing

### GPIO Access

```c
#include <furi_hal_gpio.h>

// Configure GPIO
const GpioPin* pin = &gpio_ext_pa7;  // External GPIO connector pin

// Output mode
furi_hal_gpio_init_simple(pin, GpioModeOutputPushPull);
furi_hal_gpio_write(pin, true);   // Set high
furi_hal_gpio_write(pin, false);  // Set low

// Input mode with pull-up
furi_hal_gpio_init(pin, GpioModeInput, GpioPullUp, GpioSpeedLow);
bool state = furi_hal_gpio_read(pin);

// Interrupt mode
void gpio_interrupt_callback(void* context) {
    // Called on interrupt
    UNUSED(context);
}

furi_hal_gpio_init(pin, GpioModeInterruptRise, GpioPullDown, GpioSpeedLow);
furi_hal_gpio_add_int_callback(pin, gpio_interrupt_callback, NULL);

// Later, remove callback
furi_hal_gpio_remove_int_callback(pin);
```

### SPI Communication

```c
#include <furi_hal_spi.h>

// Acquire SPI bus (external pins)
FuriHalSpiBusHandle* spi = &furi_hal_spi_bus_handle_external;
furi_hal_spi_bus_handle_init(spi);

// Configure chip select
const GpioPin* cs_pin = &gpio_ext_pa4;
furi_hal_gpio_init_simple(cs_pin, GpioModeOutputPushPull);
furi_hal_gpio_write(cs_pin, true);  // CS high (inactive)

// Acquire bus
furi_hal_spi_acquire(spi);

// Transfer data
uint8_t tx_data[] = {0x01, 0x02, 0x03};
uint8_t rx_data[3];

furi_hal_gpio_write(cs_pin, false);  // CS low (active)
furi_hal_spi_bus_tx(spi, tx_data, sizeof(tx_data), 1000);
furi_hal_spi_bus_rx(spi, rx_data, sizeof(rx_data), 1000);
furi_hal_gpio_write(cs_pin, true);   // CS high (inactive)

// Release bus
furi_hal_spi_release(spi);
furi_hal_spi_bus_handle_deinit(spi);
```

### I2C Communication

```c
#include <furi_hal_i2c.h>

// Use external I2C bus
FuriHalI2cBusHandle* i2c = &furi_hal_i2c_handle_external;

// Acquire bus
furi_hal_i2c_acquire(i2c);

// Device address
uint8_t device_addr = 0x3C << 1;  // 7-bit address shifted

// Write register
uint8_t reg_addr = 0x10;
uint8_t data = 0xFF;
furi_hal_i2c_write_reg_8(i2c, device_addr, reg_addr, data, 100);

// Read register
uint8_t value;
furi_hal_i2c_read_reg_8(i2c, device_addr, reg_addr, &value, 100);

// Write multiple bytes
uint8_t tx_buffer[] = {0x00, 0x01, 0x02, 0x03};
furi_hal_i2c_write_mem(i2c, device_addr, 0x00, tx_buffer, sizeof(tx_buffer), 100);

// Read multiple bytes
uint8_t rx_buffer[4];
furi_hal_i2c_read_mem(i2c, device_addr, 0x00, rx_buffer, sizeof(rx_buffer), 100);

// Release bus
furi_hal_i2c_release(i2c);
```

### UART Communication

```c
#include <furi_hal_uart.h>

// Configure UART (external pins: TX=13, RX=14)
furi_hal_uart_init(FuriHalUartIdUSART1, 115200);

// TX callback
void uart_tx_complete(FuriHalUartId id, void* context) {
    UNUSED(id);
    UNUSED(context);
    // Transmission complete
}

// RX callback
void uart_rx_callback(FuriHalUartId id, uint8_t data, void* context) {
    UNUSED(id);
    MyContext* ctx = context;
    // Process received byte
    ctx->buffer[ctx->index++] = data;
}

// Set callbacks
furi_hal_uart_set_br(FuriHalUartIdUSART1, 115200);
furi_hal_uart_set_irq_cb(FuriHalUartIdUSART1, uart_rx_callback, my_context);

// Send data
uint8_t tx_data[] = "Hello UART!";
furi_hal_uart_tx(FuriHalUartIdUSART1, tx_data, sizeof(tx_data));

// Cleanup
furi_hal_uart_set_irq_cb(FuriHalUartIdUSART1, NULL, NULL);
furi_hal_uart_deinit(FuriHalUartIdUSART1);
```

---

## NFC/RFID Development

### NFC Worker Pattern

```c
#include <lib/nfc/nfc.h>
#include <lib/nfc/nfc_worker.h>

typedef struct {
    Nfc* nfc;
    NfcWorker* worker;
    NfcDeviceData* dev_data;
} NfcApp;

// Worker callback
void nfc_worker_callback(NfcWorkerEvent event, void* context) {
    NfcApp* app = context;
    
    switch(event) {
        case NfcWorkerEventSuccess:
            // Card detected and read
            break;
        case NfcWorkerEventFail:
            // Read failed
            break;
        case NfcWorkerEventAborted:
            // Operation aborted
            break;
        default:
            break;
    }
}

// Initialize NFC
NfcApp* app = malloc(sizeof(NfcApp));
app->nfc = nfc_alloc();
app->worker = nfc_worker_alloc();
app->dev_data = malloc(sizeof(NfcDeviceData));

// Start reading
nfc_worker_start(
    app->worker,
    NfcWorkerStateReadUid,  // Or other states
    app->dev_data,
    nfc_worker_callback,
    app
);

// Stop reading
nfc_worker_stop(app->worker);

// Cleanup
nfc_worker_free(app->worker);
nfc_free(app->nfc);
free(app->dev_data);
free(app);
```

### Emulating NFC Cards

```c
// Prepare device data
NfcDeviceData dev_data = {
    .protocol = NfcDeviceProtocolMifareUl,
    .nfc_data = {
        .uid_len = 7,
        .uid = {0x04, 0x12, 0x34, 0x56, 0x78, 0x90, 0xAB},
        .atqa = {0x44, 0x00},
        .sak = 0x00,
    },
};

// Start emulation
nfc_worker_start(
    app->worker,
    NfcWorkerStateEmulate,
    &dev_data,
    nfc_worker_callback,
    app
);

// Emulation runs until stopped
furi_delay_ms(30000);  // Emulate for 30 seconds

nfc_worker_stop(app->worker);
```

---

## SubGHz Radio Programming

### Basic SubGHz Transmission

```c
#include <lib/subghz/subghz_worker.h>
#include <lib/subghz/transmitter.h>
