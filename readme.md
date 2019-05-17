## Info

A very simple and bare-bones version of the popular Tier Maker app concept.  
Based on `react-beautiful-dnd`, utilizes `base64url` encoded strings to share/persist state.

The use of `base64url` encoded strings limits performance, data size and increaes link length severely, but enables the app to work without any kind of custom server-side API (which could still be added at any time).
