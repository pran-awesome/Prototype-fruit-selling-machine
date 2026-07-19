"""Door control module (Phase 1 - stubbed).

On a real Raspberry Pi this would toggle a GPIO pin wired to the door
actuator/solenoid. In this prototype phase there is no mechanical hardware, so
the trigger is a stub that logs the action. The real-hardware code path is kept
here (guarded by an optional import) so it drops straight onto a Pi later.
"""

import logging

logger = logging.getLogger("fresh_x.door")

# Placeholder BCM pin for the (future) door actuator. Single shared door, so a
# single output signal "unlocks" all 4 compartments.
DOOR_PIN = 17

try:  # pragma: no cover - only importable on real Raspberry Pi hardware
    import RPi.GPIO as GPIO  # type: ignore

    GPIO_AVAILABLE = True
except (ImportError, RuntimeError):
    GPIO = None
    GPIO_AVAILABLE = False


def open_door() -> dict:
    """Trigger the (single, shared) cabinet door to unlock.

    Returns a small dict describing what happened so the API/admin log can
    record whether this ran against real hardware or the stub.
    """
    if GPIO_AVAILABLE:  # pragma: no cover - real hardware only
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(DOOR_PIN, GPIO.OUT)
        GPIO.output(DOOR_PIN, GPIO.HIGH)
        logger.info("GPIO pin %s -> HIGH (real door unlock signal)", DOOR_PIN)
        mode = "gpio"
        detail = f"GPIO pin {DOOR_PIN} set HIGH"
    else:
        logger.info("[STUB] Door unlock signal sent (no GPIO hardware present).")
        mode = "stub"
        detail = "Stubbed unlock signal (no hardware)"

    return {"ok": True, "mode": mode, "detail": detail, "compartments": 4}
