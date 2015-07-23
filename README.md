Minecraft server watchdog
-------------------------
A simple NodeJS application that manages a minecraft server.

# Features
- Autorestart on crash
- Restart interval

# Commands
- **Ingame**
  - `/stop`: Restart the server
- **Command Line**
  - `/stop`: Stops the server
  - `/restart`: Restarts the server

# Usage
- Install with `npm install -g minecraft-server-watchdog`
- Setup config file in directory of server (look at `watchdog.config.json` in repository)
- Execute `minecraft-server-watchdog` in the directory of the config file
- ???
- Profit!

# Authors
- Rene Hollander

# License
The MIT License (MIT)

Copyright (c) 2015 Rene Hollander

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
