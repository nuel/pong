# Stacks + Pong

![Stacks](https://cloud.githubusercontent.com/assets/6472410/13347286/15473eb6-dc6d-11e5-82a4-a4cf94638720.JPG)


~~Recently~~ In 2016, I designed a decorative table lamp for [LEDbits][1], to sort of show what their product
can do, which is a modular light system. The system is cool because it produces as
much light as a normal lightbulb, but allows daisy chaining, has a magnetic system to swap
lenses and, best of all, has support for PWM

Which means... time to break out the Arduino and HACK SOME TABLE LAMPS

![Pro hacker](http://i.giphy.com/ZHlGzvZb130nm.gif)

Yeah, that sounded way cooler in my head

## So what is this thing really
This thing here is multiple things at once. It's a server that connects to Arduino. It's also a static
web server (thanks Express) that serves a browser version of Pong. Lastly, it's a Socket.io server that
ties both together. The table lamp has two lights. The game has two paddles. When the ball hits a paddle,
the corresponding light glows briefly

## Nice how do I use this
If you don't have a LEDbit, which you don't because the product is launching ~~later this year~~ at some point, you can use
normal LED lights. Not as cool, but still nice to check out. Here's a shopping list:
- Arduino (Uno or whatever) with USB cable
- Two LEDs or something that accepts PWM input
- Jumper cables or something that connects the thingies to pin 6 and pin 9
- Node.js installed on your computer

Then do this:

1. Put StandardFirmata on the Arduino. Follow [these instructions][2].
2. You need the path to your Arduino device. Look at the status bar in the Arduino IDE.
3. Open `index.js` and paste the path in there.
4. `npm install && npm start`
5. Go here: http://localhost:4000


[1]: http://ledbits.eu
[2]: http://www.instructables.com/id/Arduino-Installing-Standard-Firmata/?ALLSTEPS
