import asyncio
import os
import subprocess
import sys

import websockets

from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def main():
    return render_template('index.html')

@asyncio.coroutine
def command(websocket, path):
    cmd = yield from websocket.recv()
    print("CMD< %s" % cmd)

    process = subprocess.Popen(('/bin/sh', '-c', cmd),
                               stdout=subprocess.PIPE)

    sys.stdout.write("CMD> ")
    for byte in iter(lambda: process.stdout.read(1), b''):
        sys.stdout.write(byte.decode('utf-8'))
        yield from websocket.send(byte)
        if byte == b"\n":
            sys.stdout.write("CMD> ")

if __name__ == '__main__':
    pid = os.fork()
    if pid:
        app.run(debug=True, host='0.0.0.0')
    else:
        socket_server = websockets.serve(command, '0.0.0.0', 5001)
        asyncio.get_event_loop().run_until_complete(socket_server)
        asyncio.get_event_loop().run_forever()
