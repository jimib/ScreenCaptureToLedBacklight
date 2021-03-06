// Use if you want to force the software SPI subsystem to be used for some reason (generally, you don't)
// #define FASTLED_FORCE_SOFTWARE_SPI
// Use if you want to force non-accelerated pin access (hint: you really don't, it breaks lots of things)
// #define FASTLED_FORCE_SOFTWARE_SPI
// #define FASTLED_FORCE_SOFTWARE_PINS
#include "FastLED.h"

///////////////////////////////////////////////////////////////////////////////////////////
//
// Move a white dot along the strip of leds.  This program simply shows how to configure the leds,
// and then how to turn a single pixel white and then off, moving down the line of pixels.
// 

// How many leds are in the strip?
#define NUM_LEDS 144

// Data pin that led data will be written out over
#define DATA_PIN 7

// Clock pin only needed for SPI based chipsets when not using hardware SPI
//#define CLOCK_PIN 8

// This is an array of leds.  One item for each led in your strip.
CRGB leds[NUM_LEDS];

// This function sets up the ledsand tells the controller about them
void setup() {
  Serial.begin( 57600 );
  // sanity check delay - allows reprogramming if accidently blowing power w/leds
  delay(2000);

  // Uncomment one of the following lines for your leds arrangement.
  // FastLED.addLeds<TM1803, DATA_PIN, RGB>(leds, NUM_LEDS);
  // FastLED.addLeds<TM1804, DATA_PIN, RGB>(leds, NUM_LEDS);
  // FastLED.addLeds<TM1809, DATA_PIN, RGB>(leds, NUM_LEDS);
  FastLED.addLeds<WS2811, DATA_PIN, GRB>(leds, NUM_LEDS);
  // FastLED.addLeds<WS2812, DATA_PIN, RGB>(leds, NUM_LEDS);
  // FastLED.addLeds<WS2812B, DATA_PIN, RGB>(leds, NUM_LEDS);
  // FastLED.addLeds<NEOPIXEL, DATA_PIN>(leds, NUM_LEDS);
  // FastLED.addLeds<APA104, DATA_PIN>(leds, NUM_LEDS);
  // FastLED.addLeds<WS2811_400, DATA_PIN, RGB>(leds, NUM_LEDS);
  // FastLED.addLeds<GW6205, DATA_PIN, RGB>(leds, NUM_LEDS);
  // FastLED.addLeds<GW6205_400, DATA_PIN, RGB>(leds, NUM_LEDS);
  // FastLED.addLeds<UCS1903, DATA_PIN, RGB>(leds, NUM_LEDS);
  // FastLED.addLeds<UCS1903B, DATA_PIN, RGB>(leds, NUM_LEDS);

  // FastLED.addLeds<WS2801, RGB>(leds, NUM_LEDS);
  // FastLED.addLeds<SM16716, RGB>(leds, NUM_LEDS);
  // FastLED.addLeds<LPD8806, RGB>(leds, NUM_LEDS);
  // FastLED.addLeds<P9813, RGB>(leds, NUM_LEDS);
  // FastLED.addLeds<APA102, RGB>(leds, NUM_LEDS);
  // FastLED.addLeds<DOTSTAR, RGB>(leds, NUM_LEDS);
  
  // FastLED.addLeds<WS2801, DATA_PIN, CLOCK_PIN, RGB>(leds, NUM_LEDS);
  // FastLED.addLeds<SM16716, DATA_PIN, CLOCK_PIN, RGB>(leds, NUM_LEDS);
  // FastLED.addLeds<LPD8806, DATA_PIN, CLOCK_PIN, RGB>(leds, NUM_LEDS);
  // FastLED.addLeds<P9813, DATA_PIN, CLOCK_PIN, RGB>(leds, NUM_LEDS);
  // FastLED.addLeds<APA102, DATA_PIN, CLOCK_PIN, RGB>(leds, NUM_LEDS);
  // FastLED.addLeds<DOTSTAR, DATA_PIN, CLOCK_PIN, RGB>(leds, NUM_LEDS);
}

// This function runs over and over, and is where you do the magic to light
// your leds.
CRGB Colors[] = {
  CRGB::Red,CRGB::Green,CRGB::Blue
};
char data[40];
bool boolChanged = false;
bool boolReadSerial = false;
void loop() {
   // Move a single white led 
   //Serial.println( "loop" );
   boolChanged = false;
   

   int len = 0;
   data[0] = '\0';
   if( Serial.available() > 0 ){
    boolReadSerial = true;
    while( boolReadSerial ){
      len = Serial.readBytesUntil( ',',data, 40 );
      data[len] = '\0';
      if( len > 0 ){
        char *p = data;
        char *str;
        int i = 0;
        int led = -1;
        //Serial.println( data );
        //parse the incoming color
        while ((str = strtok_r(p, ":", &p)) != NULL){
          if( strlen(str) > 0 ){
            int value;
            sscanf(str, "%d", &value);
            
            if( i == 0 ){
              led = value;  
            }else if( led > -1 && led < NUM_LEDS && value >= 0 && value <= 255 ){
              leds[ led ][ i - 1 ] = value;
              boolChanged = true;
            }
          }
          
          //Serial.println(str);
          i++;
        }
      }else{
        boolReadSerial = false; 
      }
    }
   }

   if( boolChanged ){
    FastLED.show(); 
   }

   delay( 1 );
   /*for(int i = 0; i < NUM_LEDS; i++) {
      
      // Turn our current led on to white, then show the leds
      leds[i] = Colors[i % 3];

      // Show the leds (only one of which is set to white, from above)
      FastLED.show();

      // Wait a little bit
      delay(1);

      // Turn our current led back to black for the next loop around
      leds[i] = CRGB::Black;
   }*/
}

