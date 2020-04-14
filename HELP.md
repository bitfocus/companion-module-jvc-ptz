# Help for the JVC module

>> TESTED against a KZ100 camera

## Configuration
* **Target IP** Enter the address of the JVC Camera.
* **Username** default = jvc
* **Password** default = 0000

## Actions

>>First look at the presets, they have a stop command in there!

The following actions are available:
* **Zoom:** Program voor Wide or Tele, ALWAYS put a stop command (do it on keyup)
* **Focus:** Program voor Near or Far, ALWAYS put a stop command (do it on keyup)
* **Set Zoom position:** position 0-499
* **Set preset zoom position in memory:** put position (0-499) into memory A, B, C or D
* **Gain control:** +1 or -1 steps of 3db
* **White balance control:** Set to Auto WB, 3200K or 5600K options depens on camera model
* **Iris:** Set open and close
* **Exposure setting:** Manual, Auto, IrisPriority, ShutterPriority
* **Recoring control:** Start or stop recording
* **Tally light control:** Set tally light o fthe camera

## Variables available

To use the following, replace INSTANCENAME with the name of your module instance.

* **$(INSTANCENAME:model)**: Model of the camera (Standard would be $(JVC ptz:model), type that in a button text)
* **$(INSTANCENAME:serial)**: Serial number of the camera (Standard would be $(JVC ptz:serial), type that in a button text)

# Feedbacks

For recoring and tally you can program feedback on a button. They will respond to status.
