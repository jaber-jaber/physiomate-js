/*  Getting_BPM_to_Monitor prints the BPM to the Serial Monitor, using the least lines of code and PulseSensor Library.
    Tutorial Webpage: https://pulsesensor.com/pages/getting-advanced

  --------Use This Sketch To------------------------------------------
  1) Displays user's live and changing BPM, Beats Per Minute, in Arduino's native Serial Monitor.
  2) Print: "♥  A HeartBeat Happened !" when a beat is detected, live.
  2) Learn about using a PulseSensor Library "Object".
  4) Blinks LED on PIN 13 with user's Heartbeat.
  --------------------------------------------------------------------*/

#define USE_ARDUINO_INTERRUPTS true    // Set-up low-level interrupts for most acurate BPM math.
#include <PulseSensorPlayground.h>
#include <NewPing.h>

#define trigPin 12 // define TrigPin
#define echoPin 11 // define EchoPin.
#define MAX_DISTANCE 200 // Maximum sensor distance is rated at 400-500cm.
NewPing sonar(trigPin, echoPin, MAX_DISTANCE); // NewPing setup of pins and maximum distance.

unsigned long currentMillis;
int timeSeconds = 0;

//  Variables
const int PulseWire = 0;       // PulseSensor PURPLE WIRE connected to ANALOG PIN 0
//const int LED13 = 13;          // The on-board Arduino LED, close to PIN 13.
int Threshold = 400;           // Determine which Signal to "count as a beat" and which to ignore.
// Use the "Gettting Started Project" to fine-tune Threshold Value beyond default setting.
// Otherwise leave the default "550" value.

PulseSensorPlayground pulseSensor;  // Creates an instance of the PulseSensorPlayground object called "pulseSensor"
int myBPM = 0;
int counter = 0;
int BPMVAL[3];
int sum = 0;
int periodSeconds = 3;

void setup() {

  Serial.begin(9600);          // For Serial Monitor

  // Configure the PulseSensor object, by assigning our variables to it.
  pulseSensor.analogInput(PulseWire);
  //pulseSensor.blinkOnPulse(LED13);       //auto-magically blink Arduino's LED with heartbeat.
  pulseSensor.setThreshold(Threshold);

}
  
void loop() {
  currentMillis = millis();
  timeSeconds = currentMillis / 1000;
  double sonar_val = sonar.ping_cm(MAX_DISTANCE);

  if ((sonar_val <= 8) && (sonar_val != 0)) {
    Serial.println(sonar_val);
  }

  pulseSensor.begin();
  
  myBPM = pulseSensor.getBeatsPerMinute();  // Calls function on our pulseSensor object that returns BPM as an "int".
  // "myBPM" hold this BPM value now.
  
  if (pulseSensor.sawStartOfBeat()) {       // Constantly test to see if "a beat happened"
    counter++;
  }
  
  if (counter == 1) {
    BPMVAL[0] = myBPM;
  }

  if (counter == 2) {
    BPMVAL[1] = myBPM;
  }

  if (counter == 3) {
    BPMVAL[2] = myBPM;
    for (int i = 0; i < 3; i++){
      Serial.println(BPMVAL[i]);
      sum = BPMVAL[i] + sum;
    }
    counter = 0;
    Serial.println(sum/3);
    sum = 0;
  }
 
  delay(200);                    // considered best practice in a simple sketch.

}
