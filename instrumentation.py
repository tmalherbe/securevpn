#!/usr/bin/python3
# unpacker.py

import frida
import sys

device_ip = '10.11.1.5:5001'
script_name = 'traceHttpClients.js'
fd = open(script_name, 'r')
package_name = 'com.fast.free.unblock.secure.vpn'

def on_message(message, data):
	if message['type'] == 'send':
		print('[*] {0}'.format(message['payload']))
	else:
		print(message)

dm = frida.get_device_manager()
device = dm.get_device(device_ip)
pid = device.spawn([package_name])
session = device.attach(pid)
script = session.create_script(fd.read())
fd.close()
script.on('message', on_message)
script.load()
device.resume(pid)
sys.stdin.read()
