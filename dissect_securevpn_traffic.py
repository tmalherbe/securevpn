#!/usr/bin/python 
# -*- coding: utf-8 -*-

import argparse
from Cryptodome.Cipher import AES
from scapy.all import *

def dissect_vpn_packet(packet, obfuscation_key, proto):

	# extract a 16-bytes AES key and a 12-bytes gcm nonce from obfuscation_key
	aes_key = bytes(obfuscation_key[:16], "utf-8")
	gcm_nonce = bytes(obfuscation_key[16:], "utf-8")
	gcm_nonce = gcm_nonce + b'\x00' * (12 - len(gcm_nonce))

	# extract TCP/UDP payload from packet
	if proto == "udp":
		packet_payload = bytes(packet[UDP].payload)
	else:
		packet_payload = bytes(packet[TCP].payload)

	# packets begin with 4 bytes of randomness
	if len(packet_payload) < 4:
		# don't dump the TCP acknowledgment packets or other TCP packet without payload 
		if len(packet_payload) > 0:
			print(f"this packet is not big enough {packet_payload}")
		return
	encypted_payload = packet_payload[4:]

	# decrypt packet			
	cipher = AES.new(aes_key, AES.MODE_GCM, gcm_nonce)
	plaintext = cipher.encrypt(encypted_payload)
	print(f"decrypted_payload : {plaintext}")

	# look for the 2 first bytes of an IPv4 packet			
	try:
		ip_packet_offset = plaintext.index(b'\x45\x00')
	except:
		print("this doesn't look like a IPv4 packet")
		return

	# print the raw decrypted IPv4 packet
	ip_packet = plaintext[ip_packet_offset:]
	print(f"plaintext ip_packet : {ip_packet}")

	# dump the parsed IPv4 packet			
	parsed_ip_packet = IP(ip_packet)
	parsed_ip_packet.show()

def dissect_vpn_traffic(pcap, obfuscation_key, port, addr, proto):

	# only packets to or from the VPN server are dissected
	for packet in pcap:
		if packet.haslayer(IP):

			if proto == "tcp": 
				if packet.haslayer(TCP):
					if packet[TCP].dport == port or packet[TCP].sport == port:
						if packet[IP].dst == addr or packet[IP].src == addr:
							dissect_vpn_packet(packet, obfuscation_key, proto)

			elif proto == "udp":
				if packet.haslayer(UDP):
					if packet[UDP].dport == port or packet[UDP].sport == port:
						if packet[IP].dst == addr or packet[IP].src == addr:
							dissect_vpn_packet(packet, obfuscation_key, proto)

def main():
	parser = argparse.ArgumentParser()

	parser.add_argument("-f", "--pcap",
								required = True,
								help = "VPN traffic to decrypt",
								type = str)

	parser.add_argument("-k", "--obfuscation_key",
								required = True,
								help="Key decrypt the traffic",
								type = str)

	parser.add_argument("-p", "--port",
								required = True,
								help = "Destination port of the VPN server. Default value : 9981",
								default = '9981',
								type = int)

	parser.add_argument("-a", "--ip_addr",
								required = True,
								help = "IP address of the VPN server",
								type = str)

	parser.add_argument('--proto', dest='proto', choices=['udp', 'tcp'],
								help="IP protocol (udp or tcp, default: tcp) used by the VPN tunnel",
								default='tcp',
								required=False)

	args = parser.parse_args()
	pcap_path = args.pcap
	obfuscation_key = args.obfuscation_key
	port = args.port
	addr = args.ip_addr
	proto = args.proto
	
	# open the pcap
	try:
		pcap = rdpcap(pcap_path)
	except:
		print(f"a problem occured while opening {pcap_path}")
		exit(0)

	# dissect the traffic
	dissect_vpn_traffic(pcap, obfuscation_key, port, addr, proto)

if __name__ == '__main__':
	main()
