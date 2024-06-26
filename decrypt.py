#!/usr/bin/python3
# -*- coding: utf-8 -*-

from Cryptodome.Cipher import AES

key = b'\x46\x68\x38\x59\x55\x43\x39\x75\x54\x56\x76\x32\x71\x4a\x69\x6b'
nonce = b'\x57\x62\x58\x43\x48\x68\x00\x00\x00\x00\x00\x00'
plaintext = b'\xd5\xc2\xb3\x50\x09\xd8\xfc\x6e\x56\x9d\x01\x17\x37\x34\x01\x01\x00\x00\x5f\x53\x69\x47\x2e\xae\x5d\x8a\xc8\xf8\x43\x9a\x20\xf2\x49\x6b\xc4\x2d\x80\xbd\x45\x00\x00\x34\x0b\xe9\x40\x00\x40\x06\x2a\x4e\xc0\xa8\x01\x86\x8e\xfa\xb3\x64\x8e\x36\x01\xbb\xef\x16\x68\xf5\x5d\x8d\xa5\x89\x80\x11\x01\x2c\x74\x97\x00\x00\x01\x01\x08\x0a\x9e\x0f\xe7\xd0\xb4\x12\xd7\x63'

cipher = AES.new(key, AES.MODE_GCM, nonce)
ciphertext = cipher.encrypt(plaintext)

print(f"enc ciphertext : {ciphertext}")
