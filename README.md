# VeilCall

A mobile-first proof of concept for real-time voice effects during calls made inside the app. It uses Web Audio to process microphone audio and WebRTC to send audio directly between two browsers. It does not make cellular calls through the phone's regular dialer.

## Run it
Open the hosted HTTPS page in Chrome or Safari and add it to the home screen to install it as a PWA.

## Make a call
1. Both callers open the hosted page.
2. One caller taps Start a call, copies the invite, and shares it privately.
3. The other taps Join a call, pastes the invite, taps Create reply, then shares the reply back.
4. The first caller pastes the reply and taps Connect call.

This proof of concept exchanges WebRTC connection details manually and uses Google's public STUN service. Some mobile networks require a TURN relay. A production service would need a TURN provider and secure signaling service.

## Limitations
Audio effects run locally in the browser; audio travels peer-to-peer. Calls are not guaranteed to connect on every network without TURN. The app cannot alter audio in standard cellular calls.